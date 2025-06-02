import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../hooks/useTheme';
import { getStoredUser, useLogin, useLogout } from '../hooks/setAuth';
import { useQuery } from '@tanstack/react-query';

function Header() {
	const { isDark, toggleTheme } = useTheme();
	const { data: user } = useQuery({
		queryKey: ['user'],
		queryFn: getStoredUser,
	});
	const { mutate: login } = useLogin();
	const { mutate: logout } = useLogout();

	return (
		<View className="p-5 flex justify-between items-center flex-row h-20">
			<Text
				className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-black'}`}
			>
				Controle de Glicemia
			</Text>

			<View className="flex-row justify-center items-center gap-4">
				<TouchableOpacity onPress={toggleTheme} className="rounded-full">
					<Icon
						name={isDark ? 'sun' : 'moon'}
						size={22}
						color={isDark ? '#FACC15' : '#0F172A'}
					/>
				</TouchableOpacity>
				{user ? (
					<TouchableOpacity onPress={() => logout()} className="rounded-full">
						<Icon
							name="sign-out-alt"
							size={22}
							color={isDark ? '#fff' : '#000'}
						/>
					</TouchableOpacity>
				) : (
					<TouchableOpacity onPress={() => login()} className="rounded-full">
						<Icon
							name="user-circle"
							size={22}
							color={isDark ? '#fff' : '#000'}
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}

export default Header;
