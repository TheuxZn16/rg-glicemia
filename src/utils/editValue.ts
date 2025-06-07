import { fetchSheetData, getAccessToken } from './glicemiaAnalysis';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SheetData {
	id: string;
	name: string;
}

interface CheckValueResponse {
	range: string;
	values: string[];
	row: number;
}

export async function checkIfValueExists(
	day: string,
	meal: string,
): Promise<CheckValueResponse | null> {
	try {
		const { accessToken } = await getAccessToken();
		const selectedSheet = await AsyncStorage.getItem('@spreedshet');
		if (!selectedSheet) throw new Error('Planilha não selecionada');

		const sheetData: SheetData = JSON.parse(selectedSheet);
		if (!sheetData.id) throw new Error('ID da planilha não encontrado');
		const daysOfSheet = await fetchSheetData('A:A', sheetData.id, accessToken);

		const dayExist = daysOfSheet.values.find((days) => days[0] === day);
		if (!dayExist) return null;
		const line = daysOfSheet.values.indexOf(dayExist) + 1;

		const { accessToken: accessToken2 } = await getAccessToken();
		let range = '';
		let returnRange = '';
		switch (meal) {
			case 'café da manhã':
				range = `C${line}:C${line}`;
				returnRange = `B${line}:D${line}`;
				break;
			case 'almoço':
				range = `F${line}:F${line}`;
				returnRange = `E${line}:G${line}`;
				break;
			case 'café da tarde':
				range = `I${line}:I${line}`;
				returnRange = `H${line}:J${line}`;
				break;
			case 'jantar':
				range = `L${line}:L${line}`;
				returnRange = `K${line}:M${line}`;
				break;
			case 'ceia':
				range = `O${line}:O${line}`;
				returnRange = `N${line}:P${line}`;
				break;
			case 'outro':
				range = `R${line}:R${line}`;
				returnRange = `Q${line}:S${line}`;
				break;
		}
		const mealOfSheet = await fetchSheetData(range, sheetData.id, accessToken2);
		if (!mealOfSheet) return null;

		const { accessToken: accessToken3 } = await getAccessToken();

		const currentValues = await fetchSheetData(
			returnRange,
			sheetData.id,
			accessToken3,
		);
		return { range: returnRange, values: currentValues.values[0], row: line };
	} catch (error) {
		console.error('Erro ao verificar valor:', error);
		return null;
	}
}

export async function editValues(
	date: string,
	meal: string,
	newGlicemy?: string,
	newMeal?: string,
	newCorrection?: string,
) {
	if (!date || !meal) throw new Error('Data e refeição não foram selecionados');
	if (!newGlicemy && !newMeal && !newCorrection)
		throw new Error(
			'Pelo menos um valor deve ser selecionado para ser modificado',
		);

	try {
		const { accessToken } = await getAccessToken();
		const selectedSheet = await AsyncStorage.getItem('@spreedshet');
		if (!selectedSheet) throw new Error('Planilha não selecionada');

		const sheetData: SheetData = JSON.parse(selectedSheet);
		if (!sheetData.id) throw new Error('ID da planilha não encontrado');
		const check = await checkIfValueExists(date, meal);
		let glicemy = '';
		let correction = '';

		if (!check) throw new Error('Elementos não existem na planilha');
		if (meal === newMeal || newMeal === undefined) {
			if (!newGlicemy) {
				glicemy = check.values[1];
			} else {
				glicemy = newGlicemy;
			}
			if (!newCorrection) {
				correction = check.values[2];
			} else {
				correction = newCorrection;
			}

			await updateSheetValue(
				`Registro Diabetes!${check.range}`,
				sheetData.id,
				accessToken,
				[[check.values[0], glicemy, correction]],
			);
		} else {
			let range = '';
			await updateSheetValue(
				`Registro Diabetes!${check.range}`,
				sheetData.id,
				accessToken,
				[['', '', '']],
			);

			if (!newGlicemy) {
				glicemy = check.values[1];
			} else {
				glicemy = newGlicemy;
			}
			if (!newCorrection) {
				correction = check.values[2];
			} else {
				correction = newCorrection;
			}

			switch (newMeal) {
				case 'café da manhã':
					range = `B${check.row}:D${check.row}`;
					break;
				case 'almoço':
					range = `E${check.row}:G${check.row}`;
					break;
				case 'café da tarde':
					range = `H${check.row}:J${check.row}`;
					break;
				case 'jantar':
					range = `K${check.row}:M${check.row}`;
					break;
				case 'ceia':
					range = `N${check.row}:P${check.row}`;
					break;
				case 'outro':
					range = `Q${check.row}:S${check.row}`;
					break;
			}

			await updateSheetValue(range, sheetData.id, accessToken, [
				[check.values[0], glicemy, correction],
			]);
		}
	} catch (error) {
		console.error('Erro ao editar valor:', error);
		throw error;
	}
}

async function updateSheetValue(
	range: string,
	spreadsheetId: string,
	accessToken: string,
	values: string[][],
) {
	try {
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`;

		const requestBody = {
			range: range,
			majorDimension: 'ROWS',
			values: values,
		};

		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Erro na atualização da planilha:', {
				status: response.status,
				statusText: response.statusText,
				errorText,
			});

			try {
				const errorData = JSON.parse(errorText);
				throw new Error(
					errorData.error?.message || 'Erro ao atualizar valor na planilha',
				);
			} catch (parseError) {
				throw new Error(
					`Erro na API: ${response.status} ${response.statusText}`,
				);
			}
		}

		const responseText = await response.text();
		try {
			return JSON.parse(responseText);
		} catch (parseError) {
			console.error('Erro ao fazer parse da resposta:', responseText);
			throw new Error('Resposta inválida da API');
		}
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Erro ao atualizar planilha: ${error.message}`);
		}
		throw new Error('Erro desconhecido ao atualizar planilha');
	}
}
