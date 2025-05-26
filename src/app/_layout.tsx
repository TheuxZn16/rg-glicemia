import '../styles/global.css';
import 'react-native-gesture-handler';

import Home from '../screens/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
	createMaterialTopTabNavigator,
	type MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import AddValueAtSheet from '../screens/AddValueAtSheet';
import Footer from '../components/Footer';
import { View } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const queryClient = new QueryClient();

function Routes() {
	return (
		<QueryClientProvider client={queryClient}>
			<View className="flex-1">
				<Tab.Navigator
					initialRouteName="Home"
					screenOptions={{
						headerShown: false,
					}}
					tabBar={(props: MaterialTopTabBarProps) => <Footer {...props} />}
					tabBarPosition="bottom"
				>
					<Tab.Screen name="Home" component={Home} />
					<Tab.Screen name="Adicionar" component={AddValueAtSheet} />
				</Tab.Navigator>
			</View>
		</QueryClientProvider>
	);
}

export default Routes;
