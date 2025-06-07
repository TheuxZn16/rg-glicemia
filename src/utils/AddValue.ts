import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SheetData {
	id: string;
	name: string;
}

let tokenPromise: Promise<{ accessToken: string }> | null = null;

async function getAccessToken() {
	if (!tokenPromise) {
		tokenPromise = GoogleSignin.getTokens();
	}
	try {
		const token = await tokenPromise;
		return token;
	} catch (error) {
		tokenPromise = null;
		throw error;
	}
}

async function getTime() {
	return new Date().toLocaleTimeString('pt-BR', {
		timeZone: 'America/Sao_Paulo',
	});
}

async function getDay() {
	return new Date().toLocaleDateString('pt-BR');
}

async function fetchSheetData(
	range: string,
	spreadsheetId: string,
	accessToken: string,
	method: 'GET' | 'POST' = 'GET',
	body?: Record<string, unknown>,
) {
	try {
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}${method === 'POST' ? ':append' : ''}${method === 'POST' ? '?valueInputOption=USER_ENTERED' : ''}`;

		const requestBody =
			method === 'POST'
				? {
						range: range,
						majorDimension: 'ROWS',
						values: body?.values || [],
					}
				: undefined;

		console.log('Request URL:', url);
		console.log('Request Body:', JSON.stringify(requestBody, null, 2));

		const response = await fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			...(requestBody && { body: JSON.stringify(requestBody) }),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Erro na resposta da API:', {
				status: response.status,
				statusText: response.statusText,
				errorText,
			});

			try {
				const errorData = JSON.parse(errorText);
				throw new Error(
					errorData.error?.message || 'Failed to fetch sheet data',
				);
			} catch (parseError) {
				throw new Error(
					`Erro na API: ${response.status} ${response.statusText}`,
				);
			}
		}

		const responseText = await response.text();
		console.log('Response Text:', responseText);

		try {
			return JSON.parse(responseText);
		} catch (parseError) {
			console.error('Erro ao fazer parse da resposta:', responseText);
			throw new Error('Resposta inválida da API');
		}
	} catch (error) {
		console.error('Erro detalhado:', error);
		if (error instanceof Error) {
			throw new Error(`Erro ao ler planilha: ${error.message}`);
		}
		throw new Error('Erro desconhecido ao ler planilha');
	}
}

async function createRecord(meal: string) {
	let row = await nextRow(meal);
	const day = await dayExist(meal);

	if (day) {
		let date = await dateCorrect(row, meal);
		while (date !== true) {
			row++;
			date = await dateCorrect(row, meal);
		}
	}

	return row;
}

async function dateCorrect(row: number, meal: string) {
	const { accessToken } = await getAccessToken();
	const selectedSheet = await AsyncStorage.getItem('@spreedshet');
	if (!selectedSheet) throw new Error('Planilha não selecionada');

	const sheetData: SheetData = JSON.parse(selectedSheet);
	if (!sheetData.id) throw new Error('ID da planilha não encontrado');

	const response = await fetchSheetData(
		`Registro Diabetes!A${row}`,
		sheetData.id,
		accessToken,
	);

	let range1 = '';
	let range2 = '';

	if (response.values[0][0] !== (await getDay())) {
		switch (meal) {
			case 'Café da manhã':
				range1 = 'B';
				range2 = 'D';
				break;
			case 'Almoço':
				range1 = 'E';
				range2 = 'G';
				break;
			case 'Café da tarde':
				range1 = 'H';
				range2 = 'J';
				break;
			case 'Jantar':
				range1 = 'K';
				range2 = 'M';
				break;
			case 'Ceia':
				range1 = 'N';
				range2 = 'P';
				break;
			case 'Outro':
				range1 = 'Q';
				range2 = 'S';
				break;
		}
		await fetchSheetData(
			`Registro Diabetes!${range1}${row}:${range2}${row}`,
			sheetData.id,
			accessToken,
			'POST',
			{
				values: [['-', '-', '-']],
				valueInputOption: 'USER_ENTERED',
			},
		);
		return false;
	}
	return true;
}

async function nextRow(meal: string) {
	let range = '';
	switch (meal) {
		case 'Café da manhã':
			range = 'B:D';
			break;
		case 'Almoço':
			range = 'E:G';
			break;
		case 'Café da tarde':
			range = 'H:J';
			break;
		case 'Jantar':
			range = 'K:M';
			break;
		case 'Ceia':
			range = 'N:P';
			break;
		case 'Outro':
			range = 'Q:S';
			break;
	}

	const { accessToken } = await getAccessToken();
	const selectedSheet = await AsyncStorage.getItem('@spreedshet');
	if (!selectedSheet) throw new Error('Planilha não selecionada');

	const sheetData: SheetData = JSON.parse(selectedSheet);
	if (!sheetData.id) throw new Error('ID da planilha não encontrado');

	const response = await fetchSheetData(
		`Registro Diabetes!${range}`,
		sheetData.id,
		accessToken,
	);

	return response.values.length + 1;
}

async function dayExist(meal: string) {
	const rw = await nextRow(meal);
	const { accessToken } = await getAccessToken();
	const selectedSheet = await AsyncStorage.getItem('@spreedshet');
	if (!selectedSheet) throw new Error('Planilha não selecionada');

	const sheetData: SheetData = JSON.parse(selectedSheet);
	if (!sheetData.id) throw new Error('ID da planilha não encontrado');

	const dayExist = await fetchSheetData(
		`Registro Diabetes!A${rw}`,
		sheetData.id,
		accessToken,
	);

	if (!dayExist.values) {
		await fetchSheetData(
			`Registro Diabetes!A${rw}`,
			sheetData.id,
			accessToken,
			'POST',
			{
				values: [[await getDay()]],
				valueInputOption: 'USER_ENTERED',
			},
		);
		return false;
	}
	return true;
}

async function registerMeal(meal: string, value: string, correction: string) {
	console.log('Registering meal:', { meal, value, correction });

	if (!value || !correction) {
		throw new Error('Valor e correção são obrigatórios');
	}

	const { accessToken } = await getAccessToken();
	const selectedSheet = await AsyncStorage.getItem('@spreedshet');
	if (!selectedSheet) throw new Error('Planilha não selecionada');

	const sheetData: SheetData = JSON.parse(selectedSheet);
	if (!sheetData.id) throw new Error('ID da planilha não encontrado');

	const row = await createRecord(meal);
	let range = '';

	switch (meal) {
		case 'Café da manhã':
			range = 'B:D';
			break;
		case 'Almoço':
			range = 'E:G';
			break;
		case 'Café da tarde':
			range = 'H:J';
			break;
		case 'Jantar':
			range = 'K:M';
			break;
		case 'Ceia':
			range = 'N:P';
			break;
		case 'Outro':
			range = 'Q:S';
			break;
		default:
			throw new Error(`Refeição inválida: ${meal}`);
	}

	console.log('Sending data to sheet:', {
		range: `Registro Diabetes!${range}${row}`,
		values: [await getTime(), value, correction],
	});

	await fetchSheetData(
		`Registro Diabetes!${range}${row}`,
		sheetData.id,
		accessToken,
		'POST',
		{
			values: [[await getTime(), value, correction]],
			valueInputOption: 'USER_ENTERED',
		},
	);
}

async function registerBreakfast(value: string, correction: string) {
	await registerMeal('Café da manhã', value, correction);
}

async function registerLunch(value: string, correction: string) {
	await registerMeal('Almoço', value, correction);
}

async function registerAfternoonSnack(value: string, correction: string) {
	await registerMeal('Café da tarde', value, correction);
}

async function registerDinner(value: string, correction: string) {
	await registerMeal('Jantar', value, correction);
}

async function registerSupper(value: string, correction: string) {
	await registerMeal('Ceia', value, correction);
}

async function registerOther(value: string, correction: string) {
	await registerMeal('Outro', value, correction);
}

export {
	createRecord,
	getTime,
	getDay,
	registerBreakfast,
	registerLunch,
	registerAfternoonSnack,
	registerDinner,
	registerSupper,
	registerOther,
};
