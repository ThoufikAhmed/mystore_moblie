import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  iconColor = '#16a34a',
  iconBgColor = '#f0fdf4',
  title,
  description,
  actionTitle,
  onAction,
}) => {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View
        style={{ backgroundColor: iconBgColor }}
        className="w-24 h-24 rounded-full items-center justify-center mb-5"
      >
        <Ionicons name={icon} size={44} color={iconColor} />
      </View>
      <Text className="text-gray-900 font-extrabold text-xl mb-2 text-center">
        {title}
      </Text>
      <Text className="text-gray-500 font-medium text-center leading-6 mb-8">
        {description}
      </Text>
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} size="md" />
      )}
    </View>
  );
};
