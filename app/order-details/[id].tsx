import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { TimelineStep } from '../../src/types';
import { useOrders } from '../../src/hooks';
import { Header, Button, OrderTimeline } from '../../src/components';
import { formatPrice } from '../../src/utils';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, cancelOrder } = useOrders();
  const [showOtp, setShowOtp] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const OTP = '4821';

  const order = orders.find((o) => o.id === id) ?? orders[0];
  const isCancelled = order?.status === 'Cancelled';
  const isDelivered = order?.status === 'Delivered';
  const canCancel = !isCancelled && !isDelivered;

  const handleCancel = () => {
    if (!order) return;
    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel order #${order.id}?`,
      [
        { text: 'Keep Order', style: 'cancel' },
        {
          text: 'Yes, Cancel Order',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            const success = await cancelOrder(order.id);
            setCancelling(false);
            if (success) {
              Alert.alert(
                'Order Cancelled',
                `Order #${order.id} has been cancelled. Your refund of ${formatPrice(order.total)} will be processed in 5–7 business days.`
              );
            } else {
              Alert.alert('Error', 'Failed to cancel the order. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getTimelineSteps = (): TimelineStep[] => {
    if (isCancelled) {
      return [
        {
          label: 'Order Placed',
          sub: `${order?.date ?? 'Oct 7, 2026'} · 11:20 AM`,
          icon: 'receipt-outline',
          done: true,
          active: false,
        },
        {
          label: 'Cancelled',
          sub: 'Order cancelled by customer',
          icon: 'close-circle-outline',
          done: true,
          active: true,
        },
      ];
    }

    if (isDelivered) {
      return [
        { label: 'Order Placed', sub: `${order?.date ?? 'Oct 7, 2026'} · 11:20 AM`, icon: 'receipt-outline', done: true, active: false },
        { label: 'Order Confirmed', sub: `${order?.date ?? 'Oct 7, 2026'} · 11:22 AM`, icon: 'checkmark-circle-outline', done: true, active: false },
        { label: 'Preparing', sub: `${order?.date ?? 'Oct 7, 2026'} · 11:45 AM`, icon: 'construct-outline', done: true, active: false },
        { label: 'Packed', sub: `${order?.date ?? 'Oct 7, 2026'} · 12:30 PM`, icon: 'cube-outline', done: true, active: false },
        { label: 'Partner Assigned', sub: `${order?.date ?? 'Oct 7, 2026'} · 12:55 PM`, icon: 'person-outline', done: true, active: false },
        { label: 'Picked Up', sub: `${order?.date ?? 'Oct 7, 2026'} · 01:10 PM`, icon: 'bicycle-outline', done: true, active: false },
        { label: 'Out for Delivery', sub: `${order?.date ?? 'Oct 7, 2026'} · 02:00 PM`, icon: 'navigate-outline', done: true, active: false },
        { label: 'Delivered', sub: `${order?.date ?? 'Oct 7, 2026'} · 02:45 PM`, icon: 'checkmark-done-circle-outline', done: true, active: true },
      ];
    }

    return [
      { label: 'Order Placed', sub: `${order?.date ?? 'Oct 7, 2026'} · 11:20 AM`, icon: 'receipt-outline', done: true, active: false },
      { label: 'Order Confirmed', sub: `${order?.date ?? 'Oct 7, 2026'} · 11:22 AM`, icon: 'checkmark-circle-outline', done: true, active: false },
      { label: 'Preparing', sub: `${order?.date ?? 'Oct 7, 2026'} · 11:45 AM`, icon: 'construct-outline', done: true, active: false },
      { label: 'Packed', sub: `${order?.date ?? 'Oct 7, 2026'} · 12:30 PM`, icon: 'cube-outline', done: true, active: false },
      { label: 'Partner Assigned', sub: `${order?.date ?? 'Oct 7, 2026'} · 12:55 PM`, icon: 'person-outline', done: true, active: false },
      { label: 'Picked Up', sub: `${order?.date ?? 'Oct 7, 2026'} · 01:10 PM`, icon: 'bicycle-outline', done: true, active: false },
      { label: 'Out for Delivery', sub: 'Arriving by 7:00 PM', icon: 'navigate-outline', done: false, active: true },
      { label: 'Delivered', sub: 'Estimated Today', icon: 'home-outline', done: false, active: false },
    ];
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      <Header
        title={`Order #${order ? order.id : (id ?? 'ORD10002')}`}
        subtitle={
          order
            ? `${order.status} · ${order.items} ${order.items === 1 ? 'item' : 'items'} · ${formatPrice(order.total)}`
            : undefined
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} className="p-4">
        {/* Delivery / Status Card */}
        {isCancelled ? (
          <View className="bg-red-50 rounded-2xl p-4 shadow-sm border border-red-200 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <Text className="text-red-600 font-extrabold text-sm">Cancelled</Text>
              </View>
              <Text className="text-red-400 text-xs">Refund Initiated</Text>
            </View>

            <Text className="text-gray-900 font-extrabold text-xl mb-1">
              Order Cancelled
            </Text>
            <Text className="text-gray-600 text-xs leading-5">
              This order has been cancelled. A refund of{' '}
              <Text className="font-bold text-gray-900">{formatPrice(order?.total ?? 0)}</Text>{' '}
              will be credited to your original payment method within 5–7 business days.
            </Text>
          </View>
        ) : isDelivered ? (
          <View className="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-200 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-green-700 font-extrabold text-sm">Delivered</Text>
              </View>
              <Text className="text-green-600 text-xs font-semibold">{order?.date}</Text>
            </View>

            <Text className="text-gray-900 font-extrabold text-xl mb-1">
              Delivered Successfully
            </Text>
            <Text className="text-gray-600 text-xs">
              Package was handed to customer. Thank you for shopping with us!
            </Text>
          </View>
        ) : (
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <Text className="text-amber-600 font-extrabold text-sm">
                  {order?.status ?? 'Out for Delivery'}
                </Text>
              </View>
              <Text className="text-gray-400 text-xs">Arriving Today</Text>
            </View>

            <Text className="text-gray-900 font-extrabold text-xl mb-1">
              Arriving by 7:00 PM
            </Text>
            <Text className="text-gray-500 text-xs mb-4">
              Delivery partner is on the way with your order
            </Text>

            {/* Delivery OTP Box */}
            <View className="bg-amber-50 rounded-xl p-3 border border-amber-200 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="key-outline" size={18} color="#d97706" />
                <View>
                  <Text className="text-amber-800 font-bold text-xs">Delivery OTP</Text>
                  <Text className="text-amber-600 text-[10px]">Share only with your delivery partner</Text>
                </View>
              </View>
              <TouchableOpacity
                className="bg-amber-600 px-3 py-1.5 rounded-lg"
                onPress={() => setShowOtp(!showOtp)}
                activeOpacity={0.8}
              >
                <Text className="text-white font-extrabold text-xs">
                  {showOtp ? OTP : 'View OTP'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Live Map Tracking Button */}
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/track-location',
                  params: { title: `Track Order #${order ? order.id : (id ?? 'ORD10002')}` },
                })
              }
              className="mt-3 bg-green-600 rounded-xl p-3.5 flex-row items-center justify-between shadow-sm"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center gap-2.5">
                <View className="w-8 h-8 rounded-full bg-green-700 items-center justify-center">
                  <Ionicons name="map-outline" size={18} color="#ffffff" />
                </View>
                <View>
                  <Text className="text-white font-extrabold text-sm">Track Live on OpenStreetMap</Text>
                  <Text className="text-green-100 text-xs">Real-time GPS updates & route</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Timeline Component */}
        <View className="mb-4">
          <OrderTimeline steps={getTimelineSteps()} />
        </View>

        {/* Delivery Address */}
        <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <Text className="text-gray-900 font-extrabold text-base mb-2">Delivery Address</Text>
          <Text className="text-gray-900 font-bold text-sm">Thoufik Ahmed</Text>
          <Text className="text-gray-500 text-xs mt-0.5 leading-4">
            123, 5th Cross, BTM Layout Phase 1, Bangalore, Karnataka – 560029
          </Text>
          <Text className="text-gray-500 text-xs mt-1">+91 9876543210</Text>
        </View>

        {/* Action Buttons */}
        <View className="gap-3 mb-8">
          <Button
            title="Need Help with this Order?"
            variant="outline"
            leftIcon="help-circle-outline"
            onPress={() => router.push('/help')}
          />

          {canCancel && (
            <Button
              title="Cancel Order"
              variant="danger"
              loading={cancelling}
              onPress={handleCancel}
            />
          )}

          {isDelivered && (
            <Button
              title="Return / Exchange Item"
              variant="secondary"
              leftIcon="refresh-outline"
              onPress={() => router.push('/return')}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
