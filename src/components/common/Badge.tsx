import React from 'react';
import { View, Text, ViewProps } from 'react-native';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-amber-100 text-amber-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      case 'info':
        return 'bg-blue-100 text-blue-700';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return 'text-green-700';
      case 'warning':
        return 'text-amber-700';
      case 'error':
        return 'text-red-700';
      case 'info':
        return 'text-blue-700';
      case 'neutral':
      default:
        return 'text-gray-700';
    }
  };

  const getSizeStyles = () => {
    return size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  };

  const getTextSizeStyles = () => {
    return size === 'sm' ? 'text-[10px] font-bold' : 'text-xs font-extrabold';
  };

  return (
    <View
      className={`rounded-full self-start flex-row items-center justify-center ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      <Text className={`${getTextColor()} ${getTextSizeStyles()}`}>{label}</Text>
    </View>
  );
};
