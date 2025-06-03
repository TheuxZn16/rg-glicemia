import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useMutation, useQuery } from '@tanstack/react-query';

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
