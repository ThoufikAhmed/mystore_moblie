import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types';

export interface CategoryItemProps {
  category: Category;
  onPress: () => void;
  width?: number;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onPress,
  width,
}) => {
  return (
    <TouchableOpacity
      className="items-center mr-5"
      style={width ? { width } : undefined}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        style={{ backgroundColor: category.color }}
        className="w-16 h-16 rounded-full items-center justify-center mb-2 border border-black/5"
      >
        <Ionicons name={category.icon as any} size={28} color="#16a34a" />
      </View>
      <Text
        className="text-gray-700 font-semibold text-xs text-center"
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};
