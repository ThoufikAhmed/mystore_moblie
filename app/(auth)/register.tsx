import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/context';
import { Input, Button } from '../../src/components';

export default function RegisterScreen() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!name.trim() || !mobile.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please fill in Name, Mobile, and Password.');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms & Conditions', 'Please accept Terms & Privacy Policy to continue.');
      return;
    }

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
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mb-6 border border-gray-100"
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color="#111827" />
          </TouchableOpacity>

          <Text className="text-3xl font-extrabold text-gray-900 mb-2">
            Create Account
          </Text>
          <Text className="text-gray-500 font-medium mb-8">
            Join us for fresh and premium groceries delivered to your door.
          </Text>

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            leftIcon="person-outline"
          />

          <Input
            label="Mobile Number"
            placeholder="00000 00000"
            value={mobile}
            onChangeText={setMobile}
            leftIcon="call-outline"
            prefix="+91"
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Input
            label="Email (Optional)"
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChangeText={setPassword}
            leftIcon="lock-closed-outline"
            isPassword
          />

          {/* Terms Agreement Checkbox */}
          <TouchableOpacity
            className="flex-row items-center mt-2 mb-8"
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.7}
          >
            <View
              className={`w-5 h-5 rounded-md border items-center justify-center mr-3 ${
                agreed
                  ? 'border-green-600 bg-green-600'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {agreed && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
            <Text className="text-gray-600 text-xs flex-1 leading-4">
              I agree to the{' '}
              <Text className="text-green-700 font-bold">Terms of Service</Text> and{' '}
              <Text className="text-green-700 font-bold">Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <Button
            title="Create Account"
            size="lg"
            loading={loading}
            onPress={handleRegister}
          />

          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-gray-500 font-medium">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-green-700 font-extrabold">Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
