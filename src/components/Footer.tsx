import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import type { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { useTheme } from '../hooks/useTheme';

function Footer({ navigation, state }: MaterialTopTabBarProps) {
	const { isDark } = useTheme();

	return (
		<View
			className={`h-16 w-72 absolute bottom-14 left-1/2 -translate-x-1/2 rounded-full flex-row justify-around items-center ${isDark ? 'bg-secundaryBackground-dark' : 'bg-secundaryBackground-light'}`}
		>
			<TouchableOpacity
				onPress={() => navigation.navigate('Home')}
				className={`rounded-full w-12 h-12 justify-center items-center ${state.index === 0 ? (isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light') : ''}`}
			>
				<Icon name="home" size={20} color={isDark ? '#fff' : '#000000'} />
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => navigation.navigate('Adicionar')}
				className={`rounded-full w-12 h-12 justify-center items-center ${state.index === 1 ? (isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light') : ''}`}
			>
				<Icon name="plus" size={20} color={isDark ? '#fff' : '#000000'} />
			</TouchableOpacity>
			<TouchableOpacity className="rounded-full w-12 h-12 justify-center items-center">
				<Icon name="edit" size={20} color={isDark ? '#fff' : '#000000'} />
			</TouchableOpacity>
			<TouchableOpacity className="rounded-full w-12 h-12 justify-center items-center">
				<Icon
					name="file-export"
					size={20}
					color={isDark ? '#fff' : '#000000'}
				/>
			</TouchableOpacity>
		</View>
	);
}

export default Footer;
