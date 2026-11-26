import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DeliveryOption } from '../../types';
import { formatPrice } from '../../utils';

export interface DeliveryOptionCardProps {
  option: DeliveryOption;
  isSelected: boolean;
  onSelect: (option: DeliveryOption) => void;
}

export const DeliveryOptionCard: React.FC<DeliveryOptionCardProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      className={`rounded-2xl p-4 mb-3 border-2 flex-row items-center ${
        isSelected ? 'border-green-600 bg-green-50' : 'border-gray-100 bg-white'
      }`}
      onPress={() => onSelect(option)}
      activeOpacity={0.8}
    >
      <View
        className={`w-11 h-11 rounded-xl items-center justify-center mr-3 ${
          isSelected ? 'bg-green-100' : 'bg-gray-100'
        }`}
      >
        <Ionicons
          name={option.icon as any}
          size={22}
          color={isSelected ? '#16a34a' : '#4b5563'}
        />
      </View>

      <View className="flex-1">
        <Text className="text-gray-900 font-extrabold text-sm">{option.label}</Text>
        <Text className="text-gray-500 text-xs mt-0.5">{option.sub}</Text>
      </View>

      <View className="items-end mr-3">
        {option.price === 0 ? (
          <Text className="text-green-700 font-extrabold text-sm">FREE</Text>
        ) : (
          <Text className="text-gray-900 font-extrabold text-sm">
            {formatPrice(option.price)}
          </Text>
        )}
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
