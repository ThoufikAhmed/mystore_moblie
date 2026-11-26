import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/context';
import { Input, Button } from '../../src/components';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login();
    }, 600);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-10 items-center">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="basket" size={40} color="#16a34a" />
            </View>
            <Text className="text-3xl font-extrabold text-gray-900 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-500 font-medium text-center">
              Login to your account to continue shopping.
            </Text>
          </View>

          <Input
            label="Email or Mobile"
            placeholder="Enter email or mobile"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError('');
            }}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError('');
            }}
            leftIcon="lock-closed-outline"
            isPassword
          />

          {error ? (
            <Text className="text-red-500 text-xs font-semibold mb-4 ml-1">
              {error}
            </Text>
          ) : null}

          <TouchableOpacity className="self-end mb-8">
            <Text className="text-green-700 font-bold">Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Log In"
            size="lg"
            loading={loading}
            onPress={handleLogin}
          />

          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-gray-500 font-medium">{"Don't have an account? "}</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-green-700 font-extrabold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
