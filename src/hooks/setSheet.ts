import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseMutateFunction } from '@tanstack/react-query';

interface GoogleDriveFile {
	id: string;
	kind: string;
	mimeType: string;
	name: string;
}

interface DataResponseSheets {
	files: GoogleDriveFile[];
	incompleteSearch: boolean;
	kind: string;
}

interface SheetData {
	id: string;
	name: string;
}

export async function getAllSheets() {
	try {
		const token = await GoogleSignin.getTokens();
		const response = await fetch(
			"https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'",
			{
				headers: {
					Authorization: `Bearer ${token.accessToken}`,
				},
			},
		);

		const data: DataResponseSheets = await response.json();

		if (!response.ok) {
			throw new Error('Failed to fetch sheets');
		}

		const sheet: SheetData[] = data.files.map((file: GoogleDriveFile) => ({
			id: file.id,
			name: file.name,
		}));

		return sheet;
	} catch (error) {
		return [];
	}
}

export function useCreateSheet() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['spreedshet'],
		mutationFn: async () => {
			const token = await GoogleSignin.getTokens();
			const accessToken = token.accessToken;

			const createSheetResponse = await fetch(
				'https://sheets.googleapis.com/v4/spreadsheets',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						properties: {
							title: 'Controle de Glicemia',
						},
					}),
				},
			);

			const newSheet = await createSheetResponse.json();

			if (!createSheetResponse.ok) {
				throw new Error('Failed to create spreadsheet');
			}

			const spreadsheetId = newSheet.spreadsheetId;

			const formatHeaderResponse = await fetch(
				`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						requests: [
							{
								updateCells: {
									range: {
										sheetId: 0,
										startRowIndex: 0,
										endRowIndex: 2,
										startColumnIndex: 0,
										endColumnIndex: 19,
									},
									rows: [
										{
											values: [
												// Row 1 values
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: 'Café da Manhã' } },
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: 'Almoço' } },
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: 'Café da Tarde' } },
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: 'Jantar' } },
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: 'Pós jantar' } },
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: 'Outro' } },
												{ userEnteredValue: { stringValue: '' } },
												{ userEnteredValue: { stringValue: '' } },
											],
										},
										{
											values: [
												// Row 2 values
												{ userEnteredValue: { stringValue: 'Dia' } },
												{ userEnteredValue: { stringValue: 'Horario' } },
												{ userEnteredValue: { stringValue: 'Glicemia' } },
												{ userEnteredValue: { stringValue: 'Correção' } },
												{ userEnteredValue: { stringValue: 'Horario' } },
												{ userEnteredValue: { stringValue: 'Glicemia' } },
												{ userEnteredValue: { stringValue: 'Correção' } },
												{ userEnteredValue: { stringValue: 'Horario' } },
												{ userEnteredValue: { stringValue: 'Glicemia' } },
												{ userEnteredValue: { stringValue: 'Correção' } },
												{ userEnteredValue: { stringValue: 'Horario' } },
												{ userEnteredValue: { stringValue: 'Glicemia' } },
												{ userEnteredValue: { stringValue: 'Correção' } },
												{ userEnteredValue: { stringValue: 'Horario' } },
												{ userEnteredValue: { stringValue: 'Glicemia' } },
												{ userEnteredValue: { stringValue: 'Correção' } },
												{ userEnteredValue: { stringValue: 'Horario' } },
												{ userEnteredValue: { stringValue: 'Glicemia' } },
												{ userEnteredValue: { stringValue: 'Correção' } },
											],
										},
									],
									fields: 'userEnteredValue', // Specify that we are updating the cell values
								},
							},

							{
								repeatCell: {
									range: {
										sheetId: 0,
										startRowIndex: 0,
										endRowIndex: 2,
										startColumnIndex: 0,
										endColumnIndex: 19,
									},
									cell: {
										userEnteredFormat: {
											horizontalAlignment: 'CENTER',
											textFormat: { bold: true },
										},
									},
									fields:
										'userEnteredFormat.horizontalAlignment,userEnteredFormat.textFormat.bold',
								},
							},

							{
								repeatCell: {
									range: {
										sheetId: 0,
										startRowIndex: 0,
										endRowIndex: 1,
										startColumnIndex: 1,
										endColumnIndex: 19,
									},
									cell: {
										userEnteredFormat: {
											backgroundColor: {
												red: 1.0,
												green: 0.0,
												blue: 0.0,
											},
										},
									},
									fields: 'userEnteredFormat.backgroundColor',
								},
							},

							{
								repeatCell: {
									range: {
										sheetId: 0,
										startRowIndex: 1,
										endRowIndex: 2,
										startColumnIndex: 0,
										endColumnIndex: 1,
									},
									cell: {
										userEnteredFormat: {
											backgroundColor: {
												red: 1.0,
												green: 0.0,
												blue: 0.0,
											},
										},
									},
									fields: 'userEnteredFormat.backgroundColor',
								},
							},

							{
								repeatCell: {
									range: {
										sheetId: 0,
										startRowIndex: 1,
										endRowIndex: 2,
										startColumnIndex: 1,
										endColumnIndex: 19,
									},
									cell: {
										userEnteredFormat: {
											backgroundColor: {
												red: 0.0,
												green: 1.0,
												blue: 0.0,
											},
										},
									},
									fields: 'userEnteredFormat.backgroundColor',
								},
							},
							{
								mergeCells: {
									range: {
										sheetId: 0, // 0 is the default sheet ID
										startRowIndex: 0, // Row 1
										endRowIndex: 1,
										startColumnIndex: 1, // Column B (0-based)
										endColumnIndex: 4, // Columns B, C, D (exclusive of 4)
									},
									mergeType: 'MERGE_ALL',
								},
							},
							{
								mergeCells: {
									range: {
										sheetId: 0,
										startRowIndex: 0,
										endRowIndex: 1,
										startColumnIndex: 4, // Column E (0-based)
										endColumnIndex: 7, // Columns E, F, G (exclusive of 7)
									},
									mergeType: 'MERGE_ALL',
								},
							},
							{
								mergeCells: {
									range: {
										sheetId: 0,
										startRowIndex: 0,
										endRowIndex: 1,
										startColumnIndex: 7, // Column H (0-based)
										endColumnIndex: 10, // Columns H, I, J (exclusive of 10)
									},
									mergeType: 'MERGE_ALL',
								},
							},
							{
								mergeCells: {
									range: {
										sheetId: 0,
										startRowIndex: 0,
										endRowIndex: 1,
										startColumnIndex: 10, // Column K (0-based)
										endColumnIndex: 13, // Columns K, L, M (exclusive of 13)
									},
									mergeType: 'MERGE_ALL',
								},
							},
							{
								mergeCells: {
									range: {
										sheetId: 0,
										startRowIndex: 0,
										endRowIndex: 1,
										startColumnIndex: 13, // Column N (0-based)
										endColumnIndex: 16, // Columns N, O, P (exclusive of 16)
									},
									mergeType: 'MERGE_ALL',
								},
							},
							{
								mergeCells: {
									range: {
										sheetId: 0,
										startRowIndex: 0,
										endRowIndex: 1,
										startColumnIndex: 16, // Column Q (0-based)
										endColumnIndex: 19, // Columns Q, R, S (exclusive of 19)
									},
									mergeType: 'MERGE_ALL',
								},
							},
						],
					}),
				},
			);

			if (!formatHeaderResponse.ok) {
				const errorResponse = await formatHeaderResponse.json();
				console.error('Failed to format header row:', errorResponse);
				throw new Error('Failed to format header row'); // Re-throw the error after logging
			}

			return { id: spreadsheetId, name: 'Controle de Glicemia' };
		},
		onSuccess: async (data) => {
			await AsyncStorage.setItem('@spreedshet', JSON.stringify(data));
			queryClient.invalidateQueries({ queryKey: ['selectedSheet'] });
			queryClient.invalidateQueries({ queryKey: ['availableSheets'] });
		},
	});
}

export function useSetSheet() {
	return useMutation({
		mutationKey: ['spreedshet'],
		mutationFn: async (sheetData: SheetData) => {
			await AsyncStorage.setItem('@spreedshet', JSON.stringify(sheetData));
		},
	});
}

export function useDeleteSheet() {
	return useMutation({
		mutationKey: ['spreedshet'],
		mutationFn: async () => {
			await AsyncStorage.setItem('@spreedshet', JSON.stringify(null));
		},
	});
}

export function useGetSelectedSheet() {
	return useQuery({
		queryKey: ['selectedSheet'],
		queryFn: async () => {
			const spreadsheet = await AsyncStorage.getItem('@spreedshet');
			return spreadsheet ? JSON.parse(spreadsheet) : null;
		},
	});
}
