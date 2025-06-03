import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import SheetSelectionModal from './SheetSelectionModal';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllSheets, useSetSheet } from '../hooks/setSheet';

interface SheetSelectionButtonsProps {
	onSheetSelected?: () => void;
}

function SheetSelectionButtons({
	onSheetSelected,
}: SheetSelectionButtonsProps) {
	const { isDark } = useTheme();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { data: availableSheets } = useQuery({
		queryKey: ['availableSheets'],
		queryFn: getAllSheets,
	});
	const { mutate: setSheet } = useSetSheet();

	const handleSheetSelection = (sheet: { id: string; name: string }) => {
		setSheet(sheet, {
			onSuccess: () => {
				onSheetSelected?.();
			},
		});
	};

	return (
		<>
			<TouchableOpacity
				className={`p-4 rounded-xl mb-4 w-full ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
			>
				<Text className="text-white text-center text-lg font-bold">
					Criar Nova Planilha
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				className={`p-4 rounded-xl w-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
				onPress={() => setIsModalVisible(true)}
			>
				<Text
					className={`text-center text-lg font-bold ${isDark ? 'text-textColor-dark' : 'text-textColor-light'}`}
				>
					Selecionar Planilha Existente
				</Text>
			</TouchableOpacity>

			<SheetSelectionModal
				visible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				sheets={availableSheets || []}
				onSelectSheet={handleSheetSelection}
			/>
		</>
	);
}

export default SheetSelectionButtons;
