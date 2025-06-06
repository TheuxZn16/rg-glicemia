import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

interface SheetData {
	id: string;
	name: string;
}

interface SheetValue {
	formattedValue?: string;
	userEnteredValue?: {
		stringValue?: string;
		numberValue?: number;
	};
}

interface SheetRow {
	values?: SheetValue[];
}

interface SheetResponse {
	range: string;
	majorDimension: string;
	values: string[][];
}

export async function downloadCompleteSheet(): Promise<string> {
	try {
		// Get access token
		const { accessToken } = await GoogleSignin.getTokens();

		// Get selected sheet info
		const selectedSheet = await AsyncStorage.getItem('@spreedshet');
		if (!selectedSheet) throw new Error('Planilha não selecionada');

		const sheetData: SheetData = JSON.parse(selectedSheet);
		if (!sheetData.id) throw new Error('ID da planilha não encontrado');

		// URL de exportação direta do Google Sheets
		const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetData.id}/export?format=pdf&portrait=true&fitw=true&gridlines=false&printtitle=true&sheetnames=true&pagenum=false&attachment=true&size=letter&fzr=true`;

		// Download do arquivo
		const downloadResult = await FileSystem.downloadAsync(
			exportUrl,
			FileSystem.documentDirectory + `${sheetData.name}.pdf`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		if (downloadResult.status !== 200) {
			throw new Error('Falha ao baixar o arquivo PDF');
		}

		// Share the PDF
		if (await Sharing.isAvailableAsync()) {
			await Sharing.shareAsync(downloadResult.uri, {
				mimeType: 'application/pdf',
				dialogTitle: `Download ${sheetData.name}`,
			});
		}

		return downloadResult.uri;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Erro ao baixar planilha: ${error.message}`);
		}
		throw new Error('Erro desconhecido ao baixar planilha');
	}
}
