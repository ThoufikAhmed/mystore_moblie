import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { OrderItem } from '../../types';
import { ORDER_STATUS_MAP } from '../../constants';
import { formatPrice } from '../../utils';

export interface OrderCardProps {
  order: OrderItem;
  onCancel?: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onCancel }) => {
  const statusMeta = ORDER_STATUS_MAP[order.status] ?? {
    bg: '#F3F4F6',
    text: '#4B5563',
    icon: 'time-outline',
  };

  const canCancel = order.status !== 'Delivered' && order.status !== 'Cancelled';

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 mb-3"
      onPress={() => router.push(`/order-details/${order.id}`)}
      activeOpacity={0.8}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-gray-900 font-extrabold text-base">
            #{order.id}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            {order.date} · {order.items} {order.items === 1 ? 'Item' : 'Items'}
          </Text>
        </View>

        <View
          className="rounded-full px-3 py-1 flex-row items-center gap-1"
          style={{ backgroundColor: statusMeta.bg }}
        >
          <Ionicons
            name={statusMeta.icon as any}
            size={12}
            color={statusMeta.text}
          />
          <Text className="font-bold text-xs" style={{ color: statusMeta.text }}>
            {order.status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-gray-50 pt-3">
        <Text className="text-gray-900 font-extrabold text-base">
          {formatPrice(order.total)}
        </Text>

        <View className="flex-row items-center gap-2">
          {canCancel && onCancel && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onCancel(order.id);
              }}
              className="bg-red-50 border border-red-200 px-3 py-1.5 rounded-full"
              activeOpacity={0.7}
            >
              <Text className="text-red-600 font-extrabold text-xs">
                Cancel Order
              </Text>
            </TouchableOpacity>
          )}

          <View className="flex-row items-center gap-0.5">
            <Text className="text-green-700 font-bold text-sm">View Details</Text>
            <Ionicons name="chevron-forward" size={14} color="#16a34a" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
