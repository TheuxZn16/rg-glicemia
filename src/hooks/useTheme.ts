import { useColorScheme } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@theme_mode';

export function useTheme() {
	const queryClient = useQueryClient();
	const isDarkScheme = useColorScheme() === 'dark';

	const { data: isDark = isDarkScheme } = useQuery({
		queryKey: ['isDark'],
		initialData: isDarkScheme,
		queryFn: async () => {
			try {
				const storedTheme = await AsyncStorage.getItem(THEME_KEY);
				return storedTheme ? JSON.parse(storedTheme) : isDarkScheme;
			} catch (error) {
				console.error('Error reading theme:', error);
				return isDarkScheme;
			}
		},
	});

	const toggleTheme = async () => {
		const newTheme = !isDark;
		try {
			await AsyncStorage.setItem(THEME_KEY, JSON.stringify(newTheme));
			queryClient.setQueryData(['isDark'], newTheme);
		} catch (error) {
			console.error('Error saving theme:', error);
		}
	};

	return { isDark, toggleTheme };
}
