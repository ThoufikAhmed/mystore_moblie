import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Generate a random order ID
const ORDER_ID = `ORD${Math.floor(10000 + Math.random() * 90000)}`;

export default function OrderSuccessScreen() {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1,
        tension: 8,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
      {/* Animated check circle */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <View className="w-28 h-28 bg-green-100 rounded-full items-center justify-center mb-8 border-4 border-green-200">
          <Ionicons name="checkmark-circle" size={72} color="#16a34a" />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity, transform: [{ translateY: slide }] }} className="items-center w-full">
        <Text className="text-gray-900 font-extrabold text-3xl mb-2 text-center">Order Placed!</Text>
        <Text className="text-gray-500 font-medium text-center leading-6 mb-10">
          Yay! Your order has been placed successfully and will be delivered soon.
        </Text>

        {/* Order Summary Card */}
        <View className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8 gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-500 font-medium">Order ID</Text>
            <Text className="text-gray-900 font-extrabold">#{ORDER_ID}</Text>
          </View>
          <View className="border-t border-dashed border-gray-200" />
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-500 font-medium">Estimated Delivery</Text>
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="calendar-outline" size={14} color="#16a34a" />
              <Text className="text-green-700 font-extrabold">Tomorrow</Text>
            </View>
          </View>
          <View className="border-t border-dashed border-gray-200" />
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-500 font-medium">Payment Status</Text>
            <View className="bg-green-100 px-2 py-1 rounded-full flex-row items-center gap-1">
              <Ionicons name="checkmark-circle" size={12} color="#16a34a" />
              <Text className="text-green-700 font-extrabold text-xs">Confirmed</Text>
            </View>
          </View>
        </View>

        {/* CTA Buttons */}
        <TouchableOpacity
          className="w-full bg-green-600 h-14 rounded-2xl items-center justify-center flex-row gap-2 shadow-sm mb-3"
          onPress={() => router.push(`/order-details/${ORDER_ID}`)}
        >
          <Ionicons name="cube-outline" size={20} color="white" />
          <Text className="text-white font-extrabold text-base">Track My Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full h-14 rounded-2xl items-center justify-center border-2 border-green-100"
          onPress={() => router.replace('/(tabs)')}
        >
          <Text className="text-green-700 font-extrabold text-base">Continue Shopping</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
