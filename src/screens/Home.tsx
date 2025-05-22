import '../styles/global.css';

import { View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {
	const queryClient = useQueryClient();

	const { data: isDark } = useQuery({
		queryKey: ['isDark'],
		queryFn: () => queryClient.getQueryData(['isDark']),
	});

	return (
		<SafeAreaProvider>
			<SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
				<Header />

				<View className="flex-1 p-3">
					<View
						className={`p-1 mt-4 h-96 rounded-xl ${isDark ? 'bg-secundaryBackground-dark' : 'bg-secundaryBackground-light'}`}
					>
						<Text className={isDark ? 'text-white' : 'text-black'}>hi1</Text>
					</View>
					<View
						className={`p-1 mt-4 h-28 rounded-xl ${isDark ? 'bg-secundaryBackground-dark' : 'bg-secundaryBackground-light'}`}
					>
						<Text className={isDark ? 'text-white' : 'text-black'}>hi1</Text>
					</View>
				</View>

				<Footer />
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

export default Home;
