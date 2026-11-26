import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppNotification } from '../../types';

export interface NotificationItemCardProps {
  notification: AppNotification;
  onPress: () => void;
}

const ICON_MAP = {
  order: { icon: 'receipt-outline', bg: '#eff6ff', color: '#2563eb' },
  offer: { icon: 'pricetag-outline', bg: '#fef3c7', color: '#d97706' },
  delivery: { icon: 'bicycle-outline', bg: '#f0fdf4', color: '#16a34a' },
  stock: { icon: 'cube-outline', bg: '#f5f3ff', color: '#7c3aed' },
} as const;

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  notification,
  onPress,
}) => {
  const meta = ICON_MAP[notification.type] ?? ICON_MAP.order;

  return (
    <TouchableOpacity
      className={`rounded-2xl p-4 mb-3 border flex-row items-start ${
        notification.read
          ? 'bg-white border-gray-100'
          : 'bg-green-50 border-green-200'
      }`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={{ backgroundColor: meta.bg }}
        className="w-11 h-11 rounded-xl items-center justify-center mr-3 mt-0.5"
      >
        <Ionicons name={meta.icon as any} size={22} color={meta.color} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className={`text-sm ${
              notification.read
                ? 'font-bold text-gray-800'
                : 'font-extrabold text-gray-900'
            }`}
          >
            {notification.title}
          </Text>
          <Text className="text-gray-400 text-[10px]">{notification.time}</Text>
        </View>

        <Text className="text-gray-500 text-xs leading-4">
          {notification.body}
        </Text>
      </View>

      {!notification.read && (
        <View className="w-2.5 h-2.5 bg-green-600 rounded-full ml-2 mt-1.5" />
      )}
    </TouchableOpacity>
  );
};
