import {
	GoogleSignin,
	isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLogin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['user'],
		mutationFn: async () => {
			await GoogleSignin.hasPlayServices({
				showPlayServicesUpdateDialog: true,
			});
			return await GoogleSignin.signIn();
		},
		onSuccess: async (data) => {
			if (isSuccessResponse(data)) {
				await AsyncStorage.setItem('@user', JSON.stringify(data));
				queryClient.setQueryData(['user'], data);
			}
		},
		onError: (error) => {
			console.error('Login error:', error);
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['logout'],
		mutationFn: async () => {
			try {
				await GoogleSignin.signOut();
				await AsyncStorage.removeItem('@user');
				queryClient.setQueryData(['user'], null);
			} catch (error) {
				console.error('Logout error:', error);
				throw error;
			}
		},
	});
}

export async function getStoredUser() {
	try {
		const userData = await AsyncStorage.getItem('@user');
		return userData ? JSON.parse(userData) : null;
	} catch (error) {
		console.error('Error getting stored user:', error);
		return null;
	}
}
