import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface OrderItem {
  id: string;
  date: string;
  items: number;
  total: number;
  status: 'Delivered' | 'Processing' | 'Cancelled' | 'Out for Delivery';
}

const statusColors: Record<OrderItem['status'], { bg: string; text: string }> = {
  Delivered: { bg: '#f0fdf4', text: '#16a34a' },
  Processing: { bg: '#eff6ff', text: '#2563eb' },
  'Out for Delivery': { bg: '#fffbeb', text: '#d97706' },
  Cancelled: { bg: '#fef2f2', text: '#dc2626' },
};

const mockOrders: OrderItem[] = [
  { id: 'ORD10001', date: 'Oct 5, 2026', items: 3, total: 1240, status: 'Delivered' },
  { id: 'ORD10002', date: 'Oct 7, 2026', items: 2, total: 780, status: 'Out for Delivery' },
];

export default function OrdersScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <Text className="text-xl font-extrabold text-gray-900">My Orders</Text>
      </View>

      {mockOrders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="receipt-outline" size={36} color="#9ca3af" />
          </View>
          <Text className="text-gray-900 font-extrabold text-lg mb-2">No Orders Yet</Text>
          <Text className="text-gray-500 text-center mb-6">When you place an order, it will appear here.</Text>
          <TouchableOpacity className="bg-green-600 px-8 py-3 rounded-2xl" onPress={() => router.push('/(tabs)')}>
            <Text className="text-white font-extrabold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="p-4 gap-3">
          {mockOrders.map(order => {
            const colors = statusColors[order.status];
            return (
              <TouchableOpacity key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50" onPress={() => router.push(`/order-details/${order.id}`)}>
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text className="text-gray-900 font-extrabold text-base">#{order.id}</Text>
                    <Text className="text-gray-400 text-xs mt-0.5">{order.date} · {order.items} Items</Text>
                  </View>
                  <View className="rounded-full px-3 py-1" style={{ backgroundColor: colors.bg }}>
                    <Text className="font-bold text-xs" style={{ color: colors.text }}>{order.status}</Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between border-t border-gray-50 pt-3">
                  <Text className="text-gray-900 font-extrabold">₹{order.total.toLocaleString()}</Text>
                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Text className="text-green-700 font-bold text-sm">View Details</Text>
                    <Ionicons name="chevron-forward" size={14} color="#16a34a" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}
