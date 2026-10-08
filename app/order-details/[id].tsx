import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Preparing'
  | 'Packed'
  | 'Partner Assigned'
  | 'Picked Up'
  | 'Out for Delivery'
  | 'Delivered';

interface TimelineStep {
  label: OrderStatus;
  sub: string;
  icon: string;
  done: boolean;
  active: boolean;
}

// Demo: order is "Out for Delivery"
const ACTIVE_STEP: OrderStatus = 'Out for Delivery';

const TIMELINE: TimelineStep[] = [
  { label: 'Order Placed',      sub: 'Oct 7, 2026 · 11:20 AM', icon: 'receipt-outline',         done: true,  active: false },
  { label: 'Order Confirmed',   sub: 'Oct 7, 2026 · 11:22 AM', icon: 'checkmark-circle-outline', done: true,  active: false },
  { label: 'Preparing',         sub: 'Oct 7, 2026 · 11:45 AM', icon: 'construct-outline',        done: true,  active: false },
  { label: 'Packed',            sub: 'Oct 7, 2026 · 12:30 PM', icon: 'cube-outline',             done: true,  active: false },
  { label: 'Partner Assigned',  sub: 'Oct 7, 2026 · 12:55 PM', icon: 'person-outline',           done: true,  active: false },
  { label: 'Picked Up',         sub: 'Oct 7, 2026 · 01:10 PM', icon: 'bicycle-outline',          done: true,  active: false },
  { label: 'Out for Delivery',  sub: 'Arriving by 7:00 PM',    icon: 'navigate-outline',         done: false, active: true  },
  { label: 'Delivered',         sub: 'Estimated Today',        icon: 'home-outline',             done: false, active: false },
];

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showOtp, setShowOtp] = useState(false);
  const OTP = '4821';

  const handleCancel = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Cancel Order',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Order Cancelled', 'Your refund will be processed in 5–7 business days.');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-gray-900 font-extrabold text-base">Order #{id}</Text>
          <Text className="text-gray-400 text-xs">Placed on Oct 7, 2026</Text>
        </View>
        <View className="bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
          <Text className="text-amber-700 font-extrabold text-xs">Out for Delivery</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Live Delivery Banner */}
        <View className="mx-4 mt-4 bg-green-600 rounded-2xl p-4 flex-row items-center gap-3">
          <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="navigate" size={24} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-extrabold text-base">Out for Delivery</Text>
            <Text className="text-green-100 text-sm font-medium">Arriving today by 7:00 PM</Text>
          </View>
          <TouchableOpacity
            className="bg-white/20 px-3 py-2 rounded-xl border border-white/30"
            onPress={() => setShowOtp(true)}
          >
            <Text className="text-white font-bold text-xs">View OTP</Text>
          </TouchableOpacity>
        </View>

        {/* OTP Card */}
        {showOtp && (
          <View className="mx-4 mt-3 bg-white border-2 border-green-200 rounded-2xl p-5 items-center">
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="lock-open-outline" size={24} color="#16a34a" />
            </View>
            <Text className="text-gray-500 font-medium text-sm mb-1">Your Delivery OTP</Text>
            <Text className="text-gray-900 font-extrabold text-5xl tracking-[12px] my-2">{OTP}</Text>
            <Text className="text-gray-400 text-xs text-center mt-1">
              Share this OTP only with your delivery partner to confirm delivery.
            </Text>
          </View>
        )}

        {/* Order Items */}
        <View className="mx-4 mt-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <Text className="text-gray-900 font-extrabold mb-3">Items Ordered</Text>
          {[
            { name: 'India Gate Basmati Rice', unit: '10 KG', qty: 1, price: 650 },
            { name: 'Tata Tea Premium', unit: '500g', qty: 2, price: 480 },
          ].map((item, idx) => (
            <View key={idx} className="flex-row justify-between py-2.5 border-b border-gray-50 last:border-0">
              <View className="flex-1 pr-4">
                <Text className="text-gray-800 font-semibold text-sm">{item.name}</Text>
                <Text className="text-gray-400 text-xs">{item.unit} × {item.qty}</Text>
              </View>
              <Text className="text-gray-900 font-extrabold">₹{item.price}</Text>
            </View>
          ))}
        </View>

        {/* Order Timeline */}
        <View className="mx-4 mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <Text className="text-gray-900 font-extrabold text-base mb-5">Order Timeline</Text>
          {TIMELINE.map((step, idx) => (
            <View key={step.label} className="flex-row items-start">
              {/* Line + dot */}
              <View className="items-center" style={{ width: 28 }}>
                <View
                  className="w-7 h-7 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: step.done ? '#16a34a' : step.active ? '#16a34a' : '#e5e7eb',
                    borderWidth: step.active ? 2 : 0,
                    borderColor: step.active ? '#bbf7d0' : undefined,
                  }}
                >
                  {step.done ? (
                    <Ionicons name="checkmark" size={14} color="white" />
                  ) : (
                    <Ionicons name={step.icon as any} size={13} color={step.active ? 'white' : '#9ca3af'} />
                  )}
                </View>
                {idx < TIMELINE.length - 1 && (
                  <View
                    className="w-0.5 my-1"
                    style={{ height: 28, backgroundColor: step.done ? '#86efac' : '#e5e7eb' }}
                  />
                )}
              </View>

              {/* Text */}
              <View className="ml-3 pb-6 flex-1">
                <Text
                  className="font-extrabold text-sm"
                  style={{ color: step.done || step.active ? '#111827' : '#9ca3af' }}
                >
                  {step.label}
                </Text>
                <Text className="text-xs mt-0.5" style={{ color: step.done ? '#6b7280' : step.active ? '#16a34a' : '#d1d5db' }}>
                  {step.sub}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View className="mx-4 mt-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <Text className="text-gray-900 font-extrabold mb-3">Delivery Address</Text>
          <View className="flex-row items-start gap-3">
            <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mt-0.5">
              <Ionicons name="location" size={16} color="#16a34a" />
            </View>
            <View>
              <Text className="text-gray-900 font-bold">Thoufik Ahmed · Home</Text>
              <Text className="text-gray-500 text-sm mt-0.5">123, 5th Cross, BTM Layout</Text>
              <Text className="text-gray-500 text-sm">Bangalore, Karnataka - 560029</Text>
            </View>
          </View>
        </View>

        {/* Price Details */}
        <View className="mx-4 mt-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <Text className="text-gray-900 font-extrabold mb-4">Price Details</Text>
          <View className="gap-3">
            {[
              { label: 'Subtotal', value: '₹1,130' },
              { label: 'Delivery', value: 'FREE', green: true },
              { label: 'Discount', value: '-₹110', green: true },
            ].map(row => (
              <View key={row.label} className="flex-row justify-between">
                <Text className="text-gray-500 font-medium">{row.label}</Text>
                <Text className={`font-semibold ${row.green ? 'text-green-600' : 'text-gray-700'}`}>{row.value}</Text>
              </View>
            ))}
            <View className="border-t border-dashed border-gray-200 my-1" />
            <View className="flex-row justify-between">
              <Text className="text-gray-900 font-extrabold">Total</Text>
              <Text className="text-gray-900 font-extrabold">₹1,020</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mx-4 mt-4 mb-8 gap-3">
          <TouchableOpacity className="bg-green-600 h-13 py-4 rounded-2xl items-center flex-row justify-center gap-2 shadow-sm">
            <Ionicons name="download-outline" size={18} color="white" />
            <Text className="text-white font-extrabold">Download Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white border-2 border-red-100 h-13 py-4 rounded-2xl items-center flex-row justify-center gap-2"
            onPress={handleCancel}
          >
            <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
            <Text className="text-red-500 font-extrabold">Cancel Order</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
