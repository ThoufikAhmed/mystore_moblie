import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  iconSize = 18,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'outline':
        return 'bg-transparent border-2 border-green-600 text-green-700';
      case 'danger':
        return 'bg-red-500 text-white';
      case 'ghost':
        return 'bg-transparent text-gray-700';
      case 'primary':
      default:
        return 'bg-green-600 text-white shadow-sm';
    }
  };

  const getTextVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'text-green-800';
      case 'outline':
        return 'text-green-700';
      case 'danger':
        return 'text-white';
      case 'ghost':
        return 'text-gray-700';
      case 'primary':
      default:
        return 'text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-3 rounded-xl';
      case 'lg':
        return 'h-14 px-6 rounded-2xl';
      case 'md':
      default:
        return 'py-3.5 px-5 rounded-2xl';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs font-bold';
      case 'lg':
        return 'text-base font-extrabold';
      case 'md':
      default:
        return 'text-sm font-extrabold';
    }
  };

  const iconColor =
    variant === 'primary' || variant === 'danger'
      ? '#FFFFFF'
      : variant === 'outline' || variant === 'secondary'
      ? '#15803d'
      : '#374151';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${getVariantStyles()} ${getSizeStyles()} ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {leftIcon && <Ionicons name={leftIcon} size={iconSize} color={iconColor} />}
          <Text className={`${getTextVariantStyles()} ${getTextSizeStyles()} text-center`}>
            {title}
          </Text>
          {rightIcon && <Ionicons name={rightIcon} size={iconSize} color={iconColor} />}
        </View>
      )}
    </TouchableOpacity>
  );
};
