import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import Header from '../components/Header';
import { useTheme } from '../hooks/useTheme';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getStoredUser } from '../hooks/setAuth';
import { useGetSelectedSheet, useCreateSheet } from '../hooks/setSheet';
import SheetSelectionButtons from '../components/SheetSelectionButtons';

const data = [
	{ value: 222, label: 'Jan' },
	{ value: 150, label: 'Feb' },
	{ value: 170, label: 'Mar' },
	{ value: 299, label: 'Apr' },
	{ value: 70, label: 'May' },
	{ value: 100, label: 'Jun' },
	{ value: 445, label: 'Jul' },
];

interface DataPoint {
	value: number;
	label: string;
}

function Home() {
	const { width } = Dimensions.get('window');
	const { isDark } = useTheme();
	const queryClient = useQueryClient();
	const { data: user } = useQuery({
		queryKey: ['user'],
		queryFn: getStoredUser,
	});
	const { data: selectedSheet } = useGetSelectedSheet();
	const { mutate: createSheet } = useCreateSheet();

	if (!user) {
		return (
			<SafeAreaProvider>
				<SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
					<Header />
					<View className="flex-1 p-3 items-center justify-center">
						<Text
							className={`text-2xl font-bold text-center ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
						>
							É necessário fazer login para acessar esta funcionalidade
						</Text>
					</View>
				</SafeAreaView>
			</SafeAreaProvider>
		);
	}

	if (!selectedSheet) {
		return (
			<SafeAreaProvider>
				<SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
					<Header />
					<View className="flex-1 p-3 items-center justify-center">
						<Text
							className={`text-2xl font-bold text-center mb-8 ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
						>
							Selecione ou crie uma planilha para começar
						</Text>

						<SheetSelectionButtons
							onSheetSelected={() => {
								queryClient.invalidateQueries({ queryKey: ['selectedSheet'] });
							}}
							onCreateSheetPress={createSheet}
						/>
					</View>
				</SafeAreaView>
			</SafeAreaProvider>
		);
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
				<Header />

				<View className="flex-1 p-3">
					<View
						className={`p-1 mt-4 h-96 rounded-xl shadow-lg items-center justify-center flex ${isDark ? 'bg-secundaryBackground-dark shadow-white' : 'bg-secundaryBackground-light shadow-black'}`}
					>
						<LineChart
							width={width - 100}
							areaChart
							curved
							data={data}
							height={260}
							spacing={44}
							disableScroll={true}
							hideRules={true}
							initialSpacing={20}
							hideDataPoints1
							isAnimated
							animationDuration={1500}
							yAxisColor={isDark ? '#918d8d' : '#4a4a4a'}
							xAxisColor={isDark ? '#918d8d' : '#4a4a4a'}
							color={isDark ? '#1717d1' : '#1f82f2'}
							startFillColor1={isDark ? '#1717d1' : '#1f82f2'}
							endFillColor1={isDark ? '#1717d1' : '#1f82f2'}
							startOpacity1={1}
							endOpacity1={0.2}
							yAxisTextStyle={{ color: isDark ? '#918d8d' : '#4a4a4a' }}
							xAxisLabelTextStyle={{ color: isDark ? '#918d8d' : '#4a4a4a' }}
							pointerConfig={{
								pointerStripUptoDataPoint: true,
								pointerStripColor: isDark ? '#444444' : '#d3d3d3',
								pointerStripWidth: 2,
								strokeDashArray: [2, 5],
								pointerColor: isDark ? '#1e90ff' : '#007bff',
								radius: 4,
								pointerLabelWidth: 100,
								pointerLabelHeight: 120,
								pointerLabelComponent: (items: DataPoint[]) => {
									return (
										<View
											className={`${isDark ? 'bg-gray-800' : 'bg-gray-200'} h-12 w-14 justify-center items-center rounded-xl opacity-60`}
										>
											<Text
												className={
													isDark
														? 'text-textColor-dark'
														: 'text-textColor-light'
												}
											>
												{items[0].label}
											</Text>
											<Text
												className={`${isDark ? 'text-textColor-dark' : 'text-textColor-light'} font-black `}
											>
												{items[0].value}
											</Text>
										</View>
									);
								},
							}}
						/>
					</View>
					<View
						className={`pt-2 pl-4 mt-4 h-28 rounded-xl justify-center shadow-black shadow-lg ${isDark ? 'bg-secundaryBackground-dark shadow-white' : 'bg-secundaryBackground-light shadow-black'}`}
					>
						<Text
							className={`text-xl ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
						>
							Média dos resultados:
						</Text>
						<Text
							className={`text-4xl font-bold ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
						>
							15 mg/dL
						</Text>
					</View>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

export default Home;
