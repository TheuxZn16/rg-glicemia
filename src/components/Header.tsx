import { Text, View, TouchableOpacity, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function Header() {
	const queryClient = useQueryClient();
	const isDarkScheme = useColorScheme() === 'dark';

	const { data: isDark = isDarkScheme } = useQuery({
		queryKey: ['isDark'],
		initialData: isDarkScheme,
		queryFn: () => queryClient.getQueryData(['isDark']) || isDarkScheme,
	});

	function handleTheme() {
		const newTheme = !isDark;
		queryClient.setQueryData(['isDark'], newTheme);
	}

	return (
		<View className="p-5 flex justify-between items-center flex-row h-20">
			<Text
				className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-black'}`}
			>
				Controle de Glicemia
			</Text>
			<TouchableOpacity onPress={handleTheme} className="rounded-full">
				<Icon
					name={isDark ? 'sun' : 'moon'}
					size={22}
					color={isDark ? '#FACC15' : '#0F172A'}
				/>
			</TouchableOpacity>
		</View>
	);
}

export default Header;
