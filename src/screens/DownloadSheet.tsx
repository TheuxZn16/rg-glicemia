import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import Header from '../components/Header';
import {
	Text,
	View,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { ArrowDownIcon, Icon } from '@/components/ui/icon';
import { useQuery } from '@tanstack/react-query';
import { getStoredUser } from '../hooks/setAuth';
import { useGetSelectedSheet } from '../hooks/setSheet';
import { useState } from 'react';
import { downloadCompleteSheet } from '../utils/downloadSheet';
import React from 'react';

function DownloadSheet() {
	const { isDark } = useTheme();
	const [isLoading, setIsLoading] = useState(false);
	const { data: user } = useQuery({
		queryKey: ['user'],
		queryFn: getStoredUser,
	});
	const { data: selectedSheet } = useGetSelectedSheet();

	if (!user) {
		return (
			<SafeAreaProvider>
				<SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
					<Header />
					<View className="flex-1 p-3 items-center justify-center">
						<Text
							className={`text-2xl font-bold text-center ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
						>
							É necessário fazer login para acessar esta funcionalidade
						</Text>
					</View>
				</SafeAreaView>
			</SafeAreaProvider>
		);
	}

	if (!selectedSheet) {
		return (
			<SafeAreaProvider>
				<SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
					<Header />
					<View className="flex-1 p-3 items-center justify-center">
						<Text
							className={`text-2xl font-bold text-center ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
						>
							É necessário selecionar uma planilha para acessar esta
							funcionalidade
						</Text>
					</View>
				</SafeAreaView>
			</SafeAreaProvider>
		);
	}

	const handleDownload = async () => {
		try {
			setIsLoading(true);
			const filePath = await downloadCompleteSheet();
			Alert.alert(
				'Download',
				`Planilha baixada com sucesso!\nO arquivo PDF foi gerado e está pronto para compartilhamento.`,
				[
					{
						text: 'OK',
						style: 'default',
					},
				],
				{
					cancelable: true,
					userInterfaceStyle: isDark ? 'dark' : 'light',
				},
			);
		} catch (error) {
			Alert.alert(
				'Erro',
				error instanceof Error ? error.message : 'Erro ao baixar planilha',
				[
					{
						text: 'OK',
						style: 'default',
					},
				],
				{
					cancelable: true,
					userInterfaceStyle: isDark ? 'dark' : 'light',
				},
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SafeAreaProvider>
			<SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
				<Header />

				<View className="p-3">
					<View
						className={`p-4 mt-4 rounded-xl shadow-lg ${isDark ? 'bg-secundaryBackground-dark shadow-white' : 'bg-secundaryBackground-light shadow-black'}`}
					>
						<Text
							className={`${isDark ? 'text-textColor-dark' : 'text-textColor-light'} text-2xl font-black mb-6`}
						>
							Download da Planilha
						</Text>

						<Text
							className={`${isDark ? 'text-textColor-dark' : 'text-textColor-light'} text-lg mb-8`}
						>
							Faça o download da sua planilha de glicemia em formato PDF para
							análise detalhada dos seus dados.
						</Text>

						<TouchableOpacity
							onPress={handleDownload}
							disabled={isLoading}
							className={`h-14 rounded-lg flex-row justify-center items-center ${isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light'}`}
						>
							{isLoading ? (
								<ActivityIndicator color={isDark ? 'white' : 'black'} />
							) : (
								<>
									<Icon as={ArrowDownIcon} className="mr-2" />
									<Text className="text-xl font-medium text-black">
										Baixar Planilha
									</Text>
								</>
							)}
						</TouchableOpacity>
					</View>

					<View
						className={`p-4 mt-4 rounded-xl shadow-lg ${isDark ? 'bg-secundaryBackground-dark shadow-white' : 'bg-secundaryBackground-light shadow-black'}`}
					>
						<Text
							className={`${isDark ? 'text-textColor-dark' : 'text-textColor-light'} text-xl font-semibold mb-4`}
						>
							Informações da Planilha:
						</Text>

						<View className="space-y-2">
							<Text
								className={`${isDark ? 'text-textColor-dark' : 'text-textColor-light'} text-lg`}
							>
								• Formato: PDF
							</Text>
							<Text
								className={`${isDark ? 'text-textColor-dark' : 'text-textColor-light'} text-lg`}
							>
								• Dados incluídos: Todas as medições registradas
							</Text>
							<Text
								className={`${isDark ? 'text-textColor-dark' : 'text-textColor-light'} text-lg`}
							>
								• Período: Desde o primeiro registro
							</Text>
						</View>
					</View>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

export default DownloadSheet;
