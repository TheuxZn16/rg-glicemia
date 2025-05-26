import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../hooks/useTheme';

function Header() {
	const { isDark, toggleTheme } = useTheme();

	return (
		<View className="p-5 flex justify-between items-center flex-row h-20">
			<Text
				className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-black'}`}
			>
				Controle de Glicemia
			</Text>
			<TouchableOpacity onPress={toggleTheme} className="rounded-full">
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
