import '../utils/ignoreWarnings';
import '../styles/global.css';
import 'react-native-gesture-handler';

import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@env';

import Home from '../screens/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
	createMaterialTopTabNavigator,
	type MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import AddValueAtSheet from '../screens/AddValueAtSheet';
import Footer from '../components/Footer';
import { View } from 'react-native';
import EditValueFromSheet from '../screens/EditValueFromSheet';
import DownloadSheet from '../screens/DownloadSheet';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

function GoogleSigninConfig() {
	try {
		GoogleSignin.configure({
			iosClientId: GOOGLE_IOS_CLIENT_ID,
			webClientId: GOOGLE_WEB_CLIENT_ID,
			offlineAccess: true,
			scopes: [
				'https://www.googleapis.com/auth/spreadsheets',
				'https://www.googleapis.com/auth/drive.file',
				'profile',
				'email',
			],
		});
	} catch (error) {
		console.error('Erro ao configurar Google Sign-In:', error);
	}
}

const Tab = createMaterialTopTabNavigator();

const queryClient = new QueryClient();

function Routes() {
	GoogleSigninConfig();
	return (
		<QueryClientProvider client={queryClient}>
			<View className="flex-1">
				<Tab.Navigator
					initialRouteName="Home"
					tabBar={(props: MaterialTopTabBarProps) => <Footer {...props} />}
					tabBarPosition="bottom"
				>
					<Tab.Screen name="Home" component={Home} />
					<Tab.Screen name="Adicionar" component={AddValueAtSheet} />
					<Tab.Screen name="Editar" component={EditValueFromSheet} />
					<Tab.Screen name="Baixar" component={DownloadSheet} />
				</Tab.Navigator>
			</View>
		</QueryClientProvider>
	);
}

export default Routes;
