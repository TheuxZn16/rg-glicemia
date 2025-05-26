import { Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useQueryClient, useQuery } from '@tanstack/react-query';

function AddValueAtSheet() {
	const isDarkScheme = useColorScheme() === 'dark';
	const QueryClient = useQueryClient();

	const { data: isDark = isDarkScheme } = useQuery({
		queryKey: ['isDark'],
		initialData: isDarkScheme,
		queryFn: () => QueryClient.getQueryData(['isDark']) || isDarkScheme,
	});
	return (
		<SafeAreaProvider>
			<SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
				<Header />

				<View className="flex-1 p-3">
					<View
						className={`p-1 mt-4 h-96 rounded-xl  shadow-lg items-center justify-center flex ${isDark ? 'bg-secundaryBackground-dark shadow-white' : 'bg-secundaryBackground-light shadow-black'}`}
					>
						<Text>h</Text>
					</View>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

export default AddValueAtSheet;
