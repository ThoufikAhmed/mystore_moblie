import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  badgeCount?: number;
  borderBottom?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBackPress,
  rightAction,
  rightIcon,
  onRightPress,
  badgeCount,
  borderBottom = true,
}) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      className={`flex-row items-center px-4 py-3 bg-white ${
        borderBottom ? 'border-b border-gray-100' : ''
      }`}
    >
      {showBack && (
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3 border border-gray-100"
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
      )}

      <View className="flex-1 justify-center">
        {title && (
          <Text className="text-gray-900 font-extrabold text-lg" numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text className="text-gray-400 text-xs font-medium" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightAction ? (
        rightAction
      ) : rightIcon ? (
        <TouchableOpacity
          onPress={onRightPress}
          activeOpacity={0.7}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center relative border border-gray-100"
        >
          <Ionicons name={rightIcon} size={20} color="#111827" />
          {badgeCount && badgeCount > 0 ? (
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-[9px] font-bold">{badgeCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
