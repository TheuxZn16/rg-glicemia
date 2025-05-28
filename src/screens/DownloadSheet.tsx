import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import Header from '../components/Header';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { ArrowDownIcon, Icon } from '@/components/ui/icon';

function DownloadSheet() {
	const { isDark } = useTheme();

	const handleDownload = () => {
		Alert.alert(
			'Download',
			'Planilha baixada com sucesso!',
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
							Faça o download da sua planilha de glicemia em formato Excel para
							análise detalhada dos seus dados.
						</Text>

						<TouchableOpacity
							onPress={handleDownload}
							className={`h-14 rounded-lg flex-row justify-center items-center ${isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light'}`}
						>
							<Icon as={ArrowDownIcon} className="mr-2" />
							<Text className="text-xl font-medium text-black">
								Baixar Planilha
							</Text>
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
								• Formato: Excel (.xlsx)
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
