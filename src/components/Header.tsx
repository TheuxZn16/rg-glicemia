import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../hooks/useTheme';
import { getStoredUser, useLogin, useLogout } from '../hooks/setAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDeleteSheet, useGetSelectedSheet } from '../hooks/setSheet';

function Header() {
	const { isDark, toggleTheme } = useTheme();
	const queryClient = useQueryClient();
	const { data: user } = useQuery({
		queryKey: ['user'],
		queryFn: getStoredUser,
	});
	const { data: selectedSheet } = useGetSelectedSheet();
	const { mutate: login } = useLogin();
	const { mutate: logout } = useLogout();
	const { mutate: deleteSheet } = useDeleteSheet();

	const handleDeleteSheet = () => {
		deleteSheet(undefined, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['selectedSheet'] });
			},
		});
	};

	return (
		<View className="p-5 flex justify-between items-center flex-row h-20">
			<Text
				className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-black'}`}
			>
				Controle de Glicemia
			</Text>

			<View className="flex-row justify-center items-center gap-4">
				{user && selectedSheet && (
					<TouchableOpacity
						onPress={handleDeleteSheet}
						className="rounded-full"
					>
						<Icon
							name="trash-alt"
							size={22}
							color={isDark ? '#ff4444' : '#ff0000'}
						/>
					</TouchableOpacity>
				)}
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
