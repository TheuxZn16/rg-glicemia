import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface SheetSelectionModalProps {
	visible: boolean;
	onClose: () => void;
	sheets: Array<{ id: string; name: string }>;
	onSelectSheet: (sheet: { id: string; name: string }) => void;
}

function SheetSelectionModal({
	visible,
	onClose,
	sheets,
	onSelectSheet,
}: SheetSelectionModalProps) {
	const { isDark } = useTheme();

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose}
		>
			<View className="flex-1 justify-end">
				<View
					className={`h-2/3 rounded-t-3xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}
				>
					<View className="p-4 border-b border-gray-200">
						<Text
							className={`text-xl font-bold ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
						>
							Selecione uma Planilha
						</Text>
					</View>
					<ScrollView className="p-4">
						{sheets.map((sheet) => (
							<TouchableOpacity
								key={sheet.id}
								className={`p-4 rounded-xl mb-2 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
								onPress={() => {
									onSelectSheet(sheet);
									onClose();
								}}
							>
								<Text
									className={`text-center ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
								>
									{sheet.name}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
					<TouchableOpacity
						className={`p-4 m-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
						onPress={onClose}
					>
						<Text
							className={`text-center font-bold ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
						>
							Cancelar
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

export default SheetSelectionModal;
