import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function RegisterScreen() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mb-6 border border-gray-100">
            <Ionicons name="chevron-back" size={20} color="#111827" />
          </TouchableOpacity>

          <Text className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</Text>
          <Text className="text-gray-500 font-medium mb-8">Join us for fresh and premium groceries.</Text>

          <View className="gap-5 mb-6">
            <View>
              <Text className="text-gray-700 font-bold mb-2 ml-1">Full Name</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
                <Ionicons name="person-outline" size={20} color="#9ca3af" />
                <TextInput className="flex-1 ml-3 text-gray-900 font-medium" placeholder="Enter your full name" />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-bold mb-2 ml-1">Mobile Number</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
                <Ionicons name="call-outline" size={20} color="#9ca3af" />
                <Text className="text-gray-900 font-bold ml-3 border-r border-gray-300 pr-3">+91</Text>
                <TextInput className="flex-1 ml-3 text-gray-900 font-medium" placeholder="00000 00000" keyboardType="phone-pad" />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-bold mb-2 ml-1">Email (Optional)</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                <TextInput className="flex-1 ml-3 text-gray-900 font-medium" placeholder="Enter email" keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-bold mb-2 ml-1">Password</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 mx-3 text-gray-900 font-medium"
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity className="flex-row items-center mb-8 pr-4" onPress={() => setAgreed(!agreed)}>
            <View className={`w-6 h-6 rounded-md items-center justify-center mr-3 border ${agreed ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'}`}>
              {agreed && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text className="text-gray-500 font-medium leading-5">
              I agree to the <Text className="text-green-700 font-bold">Terms & Conditions</Text> and <Text className="text-green-700 font-bold">Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`h-14 rounded-2xl items-center justify-center shadow-sm mb-6 ${agreed ? 'bg-green-700' : 'bg-gray-300'}`}
            disabled={!agreed}
            onPress={login}
          >
            <Text className="text-white font-extrabold text-lg">Create Account</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-auto pb-4">
            <Text className="text-gray-500 font-medium">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-green-700 font-extrabold">Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
