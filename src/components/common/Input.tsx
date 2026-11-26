import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  error?: string;
  isPassword?: boolean;
  prefix?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  leftIcon,
  rightIcon,
  onRightIconPress,
  error,
  isPassword = false,
  prefix,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return '#f87171'; // red-400
    if (isFocused) return '#16a34a'; // green-600
    return '#e5e7eb'; // gray-200
  };

  const getBackgroundColor = () => {
    if (error) return '#fef2f2'; // red-50
    if (isFocused) return '#ffffff'; // white
    return '#f9fafb'; // gray-50
  };

  return (
    <View className={`w-full mb-4 ${containerClassName}`}>
      {label ? (
        <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">{label}</Text>
      ) : null}

      <View
        style={{
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        }}
        className={`flex-row items-center border rounded-2xl px-4 h-14 ${className}`}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={20}
            color={error ? '#ef4444' : isFocused ? '#16a34a' : '#9ca3af'}
          />
        ) : null}

        {prefix ? (
          <Text className="text-gray-900 font-bold ml-3 border-r border-gray-300 pr-3">
            {prefix}
          </Text>
        ) : null}

        <TextInput
          className="flex-1 ml-3 text-gray-900 font-medium text-base"
          placeholderTextColor="#9ca3af"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-1"
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            className="p-1"
            activeOpacity={0.7}
          >
            <Ionicons name={rightIcon} size={20} color="#9ca3af" />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <Text className="text-red-500 text-xs font-semibold mt-1 ml-1">
          {error}
        </Text>
      ) : null}
    </View>
  );
};
