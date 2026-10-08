import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'order' | 'offer' | 'delivery' | 'stock';
  read: boolean;
}

const ICON_MAP = {
  order: { icon: 'receipt-outline', bg: '#eff6ff', color: '#2563eb' },
  offer: { icon: 'pricetag-outline', bg: '#fef3c7', color: '#d97706' },
  delivery: { icon: 'bicycle-outline', bg: '#f0fdf4', color: '#16a34a' },
  stock: { icon: 'cube-outline', bg: '#f5f3ff', color: '#7c3aed' },
};

const INITIAL: Notification[] = [
  { id: 'n1', title: 'Order Confirmed!', body: 'Your order #ORD10002 has been confirmed and is being prepared.', time: '2 min ago', type: 'order', read: false },
  { id: 'n2', title: 'Out for Delivery 🚴', body: 'Your order #ORD10002 is on the way. Arriving by 7:00 PM today.', time: '1 hr ago', type: 'delivery', read: false },
  { id: 'n3', title: '🎉 Weekend Offer!', body: 'Get 20% OFF on all fruits & vegetables this weekend. Use code FRESH20.', time: '3 hr ago', type: 'offer', read: true },
  { id: 'n4', title: 'Back in Stock!', body: 'India Gate Basmati Rice (10 KG) is back in stock. Order now!', time: 'Yesterday', type: 'stock', read: true },
  { id: 'n5', title: 'Order Delivered ✓', body: 'Your order #ORD10001 has been delivered. Rate your experience!', time: '2 days ago', type: 'order', read: true },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(INITIAL);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3">
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-gray-900 font-extrabold text-lg flex-1">Notifications</Text>
        {unreadCount > 0 && (
          <View className="bg-red-500 rounded-full px-2.5 py-0.5 mr-2">
            <Text className="text-white font-extrabold text-xs">{unreadCount} New</Text>
          </View>
        )}
      </View>

      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center mb-5">
            <Ionicons name="notifications-outline" size={40} color="#3b82f6" />
          </View>
          <Text className="text-gray-900 font-extrabold text-xl mb-2">All Caught Up!</Text>
          <Text className="text-gray-500 text-center font-medium">No notifications right now. We'll let you know about your orders and offers.</Text>
        </View>
      ) : (
        <>
          {/* Actions Bar */}
          <View className="flex-row justify-end px-4 py-2 bg-white border-b border-gray-50">
            <TouchableOpacity onPress={markAllRead} className="mr-4">
              <Text className="text-green-700 font-bold text-sm">Mark all read</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearAll}>
              <Text className="text-red-500 font-bold text-sm">Clear all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="p-4 gap-2">
              {notifications.map(n => {
                const icon = ICON_MAP[n.type];
                return (
                  <TouchableOpacity
                    key={n.id}
                    className={`rounded-2xl p-4 flex-row items-start gap-3 border ${n.read ? 'bg-white border-gray-100' : 'bg-blue-50/60 border-blue-100'}`}
                    onPress={() => markRead(n.id)}
                    activeOpacity={0.75}
                  >
                    <View className="w-11 h-11 rounded-full items-center justify-center flex-shrink-0" style={{ backgroundColor: icon.bg }}>
                      <Ionicons name={icon.icon as any} size={20} color={icon.color} />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between">
                        <Text className={`font-extrabold text-sm flex-1 pr-2 ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</Text>
                        {!n.read && <View className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />}
                      </View>
                      <Text className="text-gray-500 text-xs font-medium mt-1 leading-4">{n.body}</Text>
                      <Text className="text-gray-400 text-[10px] mt-2">{n.time}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View className="h-6" />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
