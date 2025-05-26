import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useTheme } from '../hooks/useTheme';

function AddValueAtSheet() {
	const { isDark } = useTheme();

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
