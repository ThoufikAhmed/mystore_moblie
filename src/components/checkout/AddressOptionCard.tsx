import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Address } from '../../types';

export interface AddressOptionCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: (address: Address) => void;
}

export const AddressOptionCard: React.FC<AddressOptionCardProps> = ({
  address,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      className={`rounded-2xl p-4 mb-3 border-2 ${
        isSelected ? 'border-green-600 bg-green-50' : 'border-gray-100 bg-white'
      }`}
      onPress={() => onSelect(address)}
      activeOpacity={0.8}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-2 mb-1">
          <View className="bg-gray-100 px-2 py-0.5 rounded-md">
            <Text className="text-gray-700 font-extrabold text-xs">
              {address.label}
            </Text>
          </View>
          {address.isDefault && (
            <View className="bg-green-100 px-2 py-0.5 rounded-md">
              <Text className="text-green-700 font-extrabold text-[10px]">
                DEFAULT
              </Text>
            </View>
          )}
        </View>

        <View
          className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
            isSelected ? 'border-green-600 bg-green-600' : 'border-gray-300'
          }`}
        >
          {isSelected && <Ionicons name="checkmark" size={12} color="white" />}
        </View>
      </View>

      <Text className="text-gray-900 font-extrabold text-sm mt-1">
        {address.name}
      </Text>
      <Text className="text-gray-600 text-xs mt-0.5 leading-4">
        {address.street}, {address.area}
      </Text>
      <Text className="text-gray-500 text-xs">
        {address.city}, {address.state} – {address.pin}
      </Text>
    </TouchableOpacity>
  );
};
