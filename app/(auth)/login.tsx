import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          
          <View className="mb-10 items-center">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="basket" size={40} color="#16a34a" />
            </View>
            <Text className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</Text>
            <Text className="text-gray-500 font-medium text-center">Login to your account to continue shopping.</Text>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-bold mb-2 ml-1">Email / Mobile Number</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Ionicons name="mail-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 font-medium"
                placeholder="Enter email or mobile"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-bold mb-2 ml-1">Password</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 mx-3 text-gray-900 font-medium"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity className="self-end mb-8">
            <Text className="text-green-700 font-bold">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-700 h-14 rounded-2xl items-center justify-center shadow-sm mb-6"
            onPress={login}
          >
            <Text className="text-white font-extrabold text-lg">Login</Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-400 font-medium">OR</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          <TouchableOpacity className="flex-row h-14 border border-gray-200 rounded-2xl items-center justify-center mb-8">
            <Ionicons name="logo-google" size={20} color="#ef4444" style={{ marginRight: 12 }} />
            <Text className="text-gray-800 font-bold text-base">Continue with Google</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-auto">
            <Text className="text-gray-500 font-medium">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-green-700 font-extrabold">Register</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
