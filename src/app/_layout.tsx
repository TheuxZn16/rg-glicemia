import {
	createNativeStackNavigator,
	type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type RootStackParamList = {
	Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export type ScreenProps<T extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, T>;

const queryClient = new QueryClient();

function Routes() {
	return (
		<QueryClientProvider client={queryClient}>
			<Stack.Navigator
				initialRouteName="Home"
				screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
			>
				<Stack.Screen name="Home" component={Home} />
			</Stack.Navigator>
		</QueryClientProvider>
	);
}

export default Routes;
