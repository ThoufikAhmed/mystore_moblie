import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentMethod } from '../../types';

export interface PaymentOptionCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: (method: PaymentMethod) => void;
}

export const PaymentOptionCard: React.FC<PaymentOptionCardProps> = ({
  method,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      className={`rounded-2xl p-4 mb-3 border-2 flex-row items-center ${
        isSelected ? 'border-green-600 bg-green-50' : 'border-gray-100 bg-white'
      }`}
      onPress={() => onSelect(method)}
      activeOpacity={0.8}
    >
      <View
        style={{ backgroundColor: `${method.color}15` }}
        className="w-11 h-11 rounded-xl items-center justify-center mr-3"
      >
        <Ionicons name={method.icon as any} size={22} color={method.color} />
      </View>

      <View className="flex-1">
        <Text className="text-gray-900 font-extrabold text-sm">{method.label}</Text>
        <Text className="text-gray-500 text-xs mt-0.5">{method.sub}</Text>
      </View>

      <View
        className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
          isSelected ? 'border-green-600 bg-green-600' : 'border-gray-300'
        }`}
      >
        {isSelected && <Ionicons name="checkmark" size={12} color="white" />}
      </View>
    </TouchableOpacity>
  );
};
