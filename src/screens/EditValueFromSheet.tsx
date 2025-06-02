import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import {
	Modal,
	Pressable,
	Text,
	TouchableOpacity,
	View,
	Alert,
	ScrollView,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useQuery } from '@tanstack/react-query';
import { getStoredUser } from '../hooks/setAuth';
import {
	FormControl,
	FormControlLabel,
	FormControlLabelText,
} from '@/components/ui/form-control';
import { CalendarDaysIcon, ChevronDownIcon, Icon } from '@/components/ui/icon';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, InputField } from '@/components/ui/input';

const meals = [
	{ label: 'Café da manhã', value: 'café da manhã' },
	{ label: 'Almoço', value: 'almoço' },
	{ label: 'Café da tarde', value: 'café da tarde' },
	{ label: 'Jantar', value: 'jantar' },
	{ label: 'Pós jantar', value: 'ceia' },
	{ label: 'Outro', value: 'outro' },
];

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(date: Date) {
	return date.toLocaleDateString('pt-BR');
}

function EditValueFromSheet() {
	const { isDark } = useTheme();
	const { data: user } = useQuery({
		queryKey: ['user'],
		queryFn: getStoredUser,
	});
	const [selectedMeal, setSelectedMeal] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [glucoseValue, setGlucoseValue] = useState('');
	const [correctionValue, setCorrectionValue] = useState('');

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

	const handleSelect = (value: string) => {
		setSelectedMeal(value);
		setIsModalVisible(false);
	};

	const handleDateChange = (event: { type: string }, date?: Date) => {
		setShowDatePicker(false);
		if (date) {
			setSelectedDate(date);
		}
	};

	const handleSubmit = () => {
		const formData = {
			refeicao: selectedMeal,
			data: selectedDate,
			glicemia: glucoseValue,
			correcao: correctionValue,
		};

		console.log('Dados do formulário:', formData);

		Alert.alert(
			'Sucesso!',
			'Valores registrados com sucesso!',
			[
				{
					text: 'OK',
					style: 'default',
					onPress: () => {
						setSelectedMeal('');
						setSelectedDate(undefined);
						setGlucoseValue('');
						setCorrectionValue('');
					},
				},
			],
			{
				cancelable: true,
				userInterfaceStyle: isDark ? 'dark' : 'light',
			},
		);
	};

	return (
		<SafeAreaProvider>
			<SafeAreaView className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
				<Header />

				<ScrollView className="flex-1">
					<View className="p-3">
						<View
							className={`p-4 mt-4 rounded-xl shadow-lg ${isDark ? 'bg-secundaryBackground-dark shadow-white' : 'bg-secundaryBackground-light shadow-black'}`}
						>
							<Text
								className={`${isDark ? 'text-textColor-dark' : 'text-textColor-light'} text-2xl font-black`}
							>
								Editar valor da tabela
							</Text>

							<FormControl className="my-6">
								<FormControlLabel>
									<FormControlLabelText
										className={`text-xl font-semibold ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
									>
										Selecione a refeição a ser editada:
									</FormControlLabelText>
								</FormControlLabel>
								<Pressable
									onPress={() => setIsModalVisible(true)}
									className={`h-14 rounded-lg border-0 flex-row justify-between items-center px-4 ${isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light'}`}
								>
									<Text
										className={`text-black text-lg ${!selectedMeal ? 'opacity-50' : ''}`}
									>
										{selectedMeal
											? capitalizeFirstLetter(selectedMeal)
											: 'Selecione uma refeição'}
									</Text>
									<View className="w-7 h-7 justify-center items-center">
										<Icon as={ChevronDownIcon} />
									</View>
								</Pressable>

								<Modal
									visible={isModalVisible}
									transparent
									animationType="slide"
									onRequestClose={() => setIsModalVisible(false)}
								>
									<Pressable
										className="flex-1 justify-end bg-black/50"
										onPress={() => setIsModalVisible(false)}
									>
										<View
											className={`${isDark ? 'bg-secundaryBackground-dark' : 'bg-secundaryBackground-light'} rounded-t-3xl p-4`}
										>
											<View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
											{meals.map((meal) => (
												<TouchableOpacity
													key={meal.value}
													onPress={() => handleSelect(meal.value)}
													className={`py-4 px-4 ${selectedMeal === meal.value ? (isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light') : ''}`}
												>
													<Text
														className={`text-xl ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
													>
														{meal.label}
													</Text>
												</TouchableOpacity>
											))}
										</View>
									</Pressable>
								</Modal>
							</FormControl>

							<FormControl>
								<FormControlLabel>
									<FormControlLabelText
										className={`text-xl font-semibold ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
									>
										Selecione o dia da refeição a ser editada:
									</FormControlLabelText>
								</FormControlLabel>
								<Pressable
									onPress={() => setShowDatePicker(true)}
									className={`h-14 rounded-lg border-0 flex-row justify-between items-center px-4 ${isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light'}`}
								>
									<Text
										className={`text-black text-lg ${!selectedDate ? 'opacity-50' : ''}`}
									>
										{selectedDate
											? formatDate(selectedDate)
											: 'Selecione uma data'}
									</Text>
									<View className="w-7 h-7 justify-center items-center">
										<Icon as={CalendarDaysIcon} />
									</View>
								</Pressable>

								{showDatePicker && (
									<DateTimePicker
										value={selectedDate || new Date()}
										mode="date"
										display="default"
										onChange={handleDateChange}
									/>
								)}
							</FormControl>
						</View>

						<View
							className={`p-4 mt-4 rounded-xl shadow-lg ${isDark ? 'bg-secundaryBackground-dark shadow-white' : 'bg-secundaryBackground-light shadow-black'}`}
						>
							<Text
								className={`${isDark ? 'text-textColor-dark' : 'text-textColor-light'} mb-6 text-2xl font-black`}
							>
								Novos valores
							</Text>

							<FormControl className="mb-6">
								<FormControlLabel>
									<FormControlLabelText
										className={`text-xl font-semibold ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
									>
										Selecione uma refeição:
									</FormControlLabelText>
								</FormControlLabel>
								<Pressable
									onPress={() => setIsModalVisible(true)}
									className={`h-14 rounded-lg border-0 flex-row justify-between items-center px-4 ${isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light'}`}
								>
									<Text
										className={`text-black text-lg ${!selectedMeal ? 'opacity-50' : ''}`}
									>
										{selectedMeal
											? capitalizeFirstLetter(selectedMeal)
											: 'Selecione uma refeição'}
									</Text>
									<View className="w-7 h-7 justify-center items-center">
										<Icon as={ChevronDownIcon} />
									</View>
								</Pressable>

								<Modal
									visible={isModalVisible}
									transparent
									animationType="slide"
									onRequestClose={() => setIsModalVisible(false)}
								>
									<Pressable
										className="flex-1 justify-end bg-black/50"
										onPress={() => setIsModalVisible(false)}
									>
										<View
											className={`${isDark ? 'bg-secundaryBackground-dark' : 'bg-secundaryBackground-light'} rounded-t-3xl p-4`}
										>
											<View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
											{meals.map((meal) => (
												<TouchableOpacity
													key={meal.value}
													onPress={() => handleSelect(meal.value)}
													className={`py-4 px-4 ${selectedMeal === meal.value ? (isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light') : ''}`}
												>
													<Text
														className={`text-xl ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
													>
														{meal.label}
													</Text>
												</TouchableOpacity>
											))}
										</View>
									</Pressable>
								</Modal>
							</FormControl>

							<FormControl className="mb-6">
								<FormControlLabel>
									<FormControlLabelText
										className={`text-xl font-semibold ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
									>
										Digite o valor da glicemia:
									</FormControlLabelText>
								</FormControlLabel>
								<Input
									className={`h-14 rounded-lg border-0 ${isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light'}`}
								>
									<InputField
										type="text"
										keyboardType="numeric"
										placeholder="Valor da glicemia"
										className="text-lg px-4 text-black"
										placeholderTextColor={isDark ? '#918d8d' : '#4a4a4a'}
										value={glucoseValue}
										onChangeText={(text) =>
											setGlucoseValue(text.replace(/[^0-9]/g, ''))
										}
									/>
								</Input>
							</FormControl>

							<FormControl className="mb-6">
								<FormControlLabel>
									<FormControlLabelText
										className={`text-xl font-semibold ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
									>
										Digite o valor da correção:
									</FormControlLabelText>
								</FormControlLabel>
								<Input
									className={`h-14 rounded-lg border-0 ${isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light'}`}
								>
									<InputField
										type="text"
										keyboardType="numeric"
										placeholder="Valor da correção"
										className="text-lg px-4 text-black"
										placeholderTextColor={isDark ? '#918d8d' : '#4a4a4a'}
										value={correctionValue}
										onChangeText={(text) =>
											setCorrectionValue(text.replace(/[^0-9]/g, ''))
										}
									/>
								</Input>
							</FormControl>

							<TouchableOpacity
								onPress={handleSubmit}
								className={`h-14 rounded-lg flex-row justify-center items-center mt-8 ${isDark ? 'bg-tertiaryBackground-dark' : 'bg-tertiaryBackground-light'}`}
							>
								<Text className="text-xl font-medium text-black">Salvar</Text>
							</TouchableOpacity>
						</View>
						<View className="h-32" />
					</View>
				</ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

export default EditValueFromSheet;
