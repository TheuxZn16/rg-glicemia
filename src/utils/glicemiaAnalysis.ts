import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SheetData {
	id: string;
	name: string;
}

interface SheetResponse {
	values: string[][];
}

export function useReadSheetData(range: string) {
	const queryClient = useQueryClient();
	return useQuery({
		queryKey: ['readSpredsheet', range],
		queryFn: async () => {
			try {
				const { accessToken } = await GoogleSignin.getTokens();
				const spreadsheetId = queryClient.getQueryData<SheetData | null>([
					'selectedSheet',
				]);
				if (!spreadsheetId) throw new Error('Planilha não selecionada');

				const response = await fetch(
					`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId.id}/values/${range}`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${accessToken}`,
							'Content-Type': 'application/json',
						},
					},
				);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.error?.message || 'Failed to fetch sheet data',
					);
				}

				return response.json();
			} catch (error) {
				if (error instanceof Error) {
					throw new Error(`Erro ao ler planilha: ${error.message}`);
				}
				throw new Error('Erro desconhecido ao ler planilha');
			}
		},
	});
}

export async function fetchSheetData(
	range: string,
	sheetId: string,
	accessToken: string,
	method: 'GET' | 'POST' | 'PUT' = 'GET',
	body?: { values: string[][] },
): Promise<SheetResponse> {
	try {
		const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;
		const url =
			method === 'GET' ? baseUrl : `${baseUrl}?valueInputOption=USER_ENTERED`;

		const response = await fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: method !== 'GET' ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			throw new Error(`Erro ao ler planilha: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Erro ao buscar dados da planilha:', error);
		throw error;
	}
}

let tokenPromise: Promise<{ accessToken: string }> | null = null;

export async function getAccessToken() {
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

export async function getGeneralAverage() {
	const values: number[] = [];
	const range = ['C:C', 'F:F', 'I:I', 'L:L', 'O:O', 'R:R'];

	try {
		const { accessToken } = await getAccessToken();
		const selectedSheet = await AsyncStorage.getItem('@spreedshet');
		if (!selectedSheet) throw new Error('Planilha não selecionada');

		const sheetData: SheetData = JSON.parse(selectedSheet);
		if (!sheetData.id) throw new Error('ID da planilha não encontrado');

		const promises = range.map(async (range) => {
			const response = await fetchSheetData(range, sheetData.id, accessToken);
			if (response.values && response.values.length > 0) {
				for (const row of response.values) {
					const value = row[0];
					if (value && !/[^0-9]/.test(value)) {
						values.push(Number(value));
					}
				}
			}
		});

		await Promise.all(promises);

		if (values.length === 0) {
			return 0;
		}

		const sum = values.reduce((acc: number, val: number) => acc + val, 0);
		const media = sum / values.length;
		return media.toFixed(2);
	} catch (error) {
		console.error('Erro ao calcular média geral:', error);
		throw new Error('Erro ao calcular média geral');
	}
}

function getCurrentDay() {
	return new Date().toLocaleDateString('pt-BR');
}

async function getSevenDaysAgo() {
	try {
		const { accessToken } = await getAccessToken();
		const selectedSheet = await AsyncStorage.getItem('@spreedshet');
		if (!selectedSheet) throw new Error('Planilha não selecionada');

		const sheetData: SheetData = JSON.parse(selectedSheet);
		if (!sheetData.id) throw new Error('ID da planilha não encontrado');

		const { values: dateValues } = await fetchSheetData(
			'A:A',
			sheetData.id,
			accessToken,
		);
		if (dateValues.length - 7 < 0) return undefined;
		const range = dateValues.length + 1;
		const values = dateValues;
		return { range, values };
	} catch (error) {
		console.log(error);
		return undefined;
	}
}

export async function getAverageOfSevenDaysAgo() {
	const result = await getSevenDaysAgo();
	if (!result) return [];

	const range = Array.from({ length: 7 }, (_, i) => [
		`C${result.range - i - 1}:C${result.range - i - 1}`,
		`F${result.range - i - 1}:F${result.range - i - 1}`,
		`I${result.range - i - 1}:I${result.range - i - 1}`,
		`L${result.range - i - 1}:L${result.range - i - 1}`,
		`O${result.range - i - 1}:O${result.range - i - 1}`,
		`R${result.range - i - 1}:R${result.range - i - 1}`,
	]);

	try {
		const { accessToken } = await getAccessToken();
		const selectedSheet = await AsyncStorage.getItem('@spreedshet');
		if (!selectedSheet) throw new Error('Planilha não selecionada');

		const sheetData: SheetData = JSON.parse(selectedSheet);
		if (!sheetData.id) throw new Error('ID da planilha não encontrado');

		const dailyAverages = await Promise.all(
			range.map(async (ranges) => {
				const values: number[] = [];
				await Promise.all(
					ranges.map(async (range) => {
						const response = await fetchSheetData(
							range,
							sheetData.id,
							accessToken,
						);
						if (response.values && response.values.length > 0) {
							for (const row of response.values) {
								const value = row[0];
								if (value && !/[^0-9]/.test(value)) {
									values.push(Number(value));
								}
							}
						}
					}),
				);

				if (values.length === 0) {
					return 0;
				}

				const sum = values.reduce((acc: number, val: number) => acc + val, 0);
				const media = sum / values.length;
				return Number(media.toFixed(2));
			}),
		);

		const results = dailyAverages.map((value, i) => ({
			value,
			label: result.values[result.values.length - 1 - i][0].slice(
				0,
				-5,
			) as string,
		}));

		return results;
	} catch (error) {
		console.error('Erro ao calcular média dos últimos 7 dias:', error);
		throw new Error('Erro ao calcular média dos últimos 7 dias');
	}
}
