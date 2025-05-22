import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

function Footer() {
	const queryClient = useQueryClient();

	const { data: isDark } = useQuery({
		queryKey: ['isDark'],
		queryFn: () => queryClient.getQueryData(['isDark']),
	});
	return (
		<View
			className={`h-14 w-72 mx-auto rounded-full fixed bottom-7 p-4 flex-row justify-around items-center ${isDark ? 'bg-secundaryBackground-dark' : 'bg-secundaryBackground-light'}`}
		>
			<TouchableOpacity
				className={`rounded-full w-10 h-10 justify-center items-center ${isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light'}`}
			>
				<Icon name="home" size={18} color={isDark ? '#fff' : '#000000'} />
			</TouchableOpacity>
			<TouchableOpacity className="rounded-full w-10 h-10 justify-center items-center">
				<Icon name="plus" size={18} color={isDark ? '#fff' : '#000000'} />
			</TouchableOpacity>
			<TouchableOpacity className="rounded-full w-10 h-10 justify-center items-center">
				<Icon name="edit" size={18} color={isDark ? '#fff' : '#000000'} />
			</TouchableOpacity>
			<TouchableOpacity className="rounded-full w-10 h-10 justify-center items-center">
				<Icon
					name="file-export"
					size={18}
					color={isDark ? '#fff' : '#000000'}
				/>
			</TouchableOpacity>
		</View>
	);
}

export default Footer;
