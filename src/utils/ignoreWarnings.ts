import { LogBox } from 'react-native';

// Ignorar warnings específicos
LogBox.ignoreLogs([
	'setLayoutAnimationEnabledExperimental is currently a no-op in the New Architecture',
]);
