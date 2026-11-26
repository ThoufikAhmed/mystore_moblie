import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  size = 'md',
}) => {
  const isSmall = size === 'sm';

  return (
    <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <TouchableOpacity
        onPress={onDecrement}
        activeOpacity={0.7}
        className={isSmall ? 'p-1.5' : 'px-3 py-2'}
      >
        <Ionicons name="remove" size={isSmall ? 14 : 18} color="#374151" />
      </TouchableOpacity>

      <Text
        className={`font-extrabold text-gray-900 ${
          isSmall ? 'px-2 text-xs' : 'px-3 text-sm'
        }`}
      >
        {quantity}
      </Text>

      <TouchableOpacity
        onPress={onIncrement}
        activeOpacity={0.7}
        className={`bg-green-600 ${isSmall ? 'p-1.5' : 'px-3 py-2'}`}
      >
        <Ionicons name="add" size={isSmall ? 14 : 18} color="white" />
      </TouchableOpacity>
    </View>
  );
};
