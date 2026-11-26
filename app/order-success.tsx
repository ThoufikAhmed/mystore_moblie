import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button } from '../src/components';
import { generateOrderId } from '../src/utils';

export default function OrderSuccessScreen() {
  const [orderId] = useState(() => generateOrderId());
  const [scale] = useState(() => new Animated.Value(0));
  const [opacity] = useState(() => new Animated.Value(0));
  const [slide] = useState(() => new Animated.Value(40));

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
  }, [opacity, scale, slide]);

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
      {/* Animated check circle */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <View className="w-28 h-28 bg-green-100 rounded-full items-center justify-center mb-8 border-4 border-green-200">
          <Ionicons name="checkmark-circle" size={72} color="#16a34a" />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity, transform: [{ translateY: slide }] }} className="items-center w-full">
        <Text className="text-gray-900 font-extrabold text-3xl mb-2 text-center">
          Order Placed!
        </Text>
        <Text className="text-gray-500 font-medium text-center leading-6 mb-8">
          Yay! Your order has been placed successfully and will be delivered soon.
        </Text>

        {/* Order Summary Card */}
        <View className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8 gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-500 font-medium">Order ID</Text>
            <Text className="text-gray-900 font-extrabold">#{orderId}</Text>
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
        <View className="w-full gap-3">
          <Button
            title="Track My Order"
            leftIcon="cube-outline"
            size="lg"
            onPress={() => router.push(`/order-details/${orderId}`)}
          />

          <Button
            title="View All Orders"
            leftIcon="receipt-outline"
            variant="secondary"
            size="md"
            onPress={() => router.navigate('/orders')}
          />

          <Button
            title="Continue Shopping"
            variant="outline"
            size="md"
            onPress={() => router.navigate('/')}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
