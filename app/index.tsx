import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { Redirect } from 'expo-router';

export default function SplashScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 10, friction: 2, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  // Use declarative redirect after loading — avoids premature router.replace calls
  if (!isLoading) {
    if (isAuthenticated) return <Redirect href="/(tabs)" />;
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-green-700 justify-center items-center">
      <Animated.View style={{ transform: [{ scale }], opacity }} className="items-center">
        <View className="w-28 h-28 bg-white rounded-full items-center justify-center mb-6 shadow-lg">
          <Ionicons name="basket" size={56} color="#15803d" />
        </View>
        <Text className="text-white font-extrabold text-4xl tracking-tight mb-2">MyGrocery</Text>
        <Text className="text-green-100 font-semibold text-base tracking-widest">FRESH DELIVERY</Text>
      </Animated.View>
    </SafeAreaView>
  );
}
