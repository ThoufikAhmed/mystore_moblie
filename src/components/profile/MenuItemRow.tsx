import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface MenuItemRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  onPress?: () => void;
  danger?: boolean;
  iconColor?: string;
  iconBg?: string;
  badge?: string | number;
}

export const MenuItemRow: React.FC<MenuItemRowProps> = ({
  icon,
  label,
  sub,
  onPress,
  danger = false,
  iconColor,
  iconBg,
  badge,
}) => {
  return (
    <TouchableOpacity
      className="flex-row items-center py-4 px-4 border-b border-gray-50"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{
          backgroundColor: iconBg ?? (danger ? '#fef2f2' : '#f0fdf4'),
        }}
      >
        <Ionicons
          name={icon}
          size={20}
          color={iconColor ?? (danger ? '#ef4444' : '#16a34a')}
        />
      </View>

      <View className="flex-1">
        <Text
          className={`font-semibold text-sm ${
            danger ? 'text-red-500' : 'text-gray-800'
          }`}
        >
          {label}
        </Text>
        {sub && <Text className="text-gray-400 text-xs mt-0.5">{sub}</Text>}
      </View>

      {badge !== undefined && (
        <View className="bg-green-100 px-2.5 py-0.5 rounded-full mr-2">
          <Text className="text-green-800 text-xs font-bold">{badge}</Text>
        </View>
      )}

      {!danger && <Ionicons name="chevron-forward" size={16} color="#d1d5db" />}
    </TouchableOpacity>
  );
};
