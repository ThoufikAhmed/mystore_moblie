import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { RETURN_REASONS } from '../src/constants';
import { Header, Button } from '../src/components';

export default function ReturnScreen() {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) {
      Alert.alert('Select Reason', 'Please select a reason for your return.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-8">
        <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={56} color="#16a34a" />
        </View>
        <Text className="text-gray-900 font-extrabold text-2xl mb-3 text-center">
          Return Request Submitted
        </Text>
        <Text className="text-gray-500 text-center leading-6 mb-10">
          {"We've received your return request. Our team will review it and arrange a pickup within 24–48 hours."}
        </Text>

        <View className="w-full bg-gray-50 rounded-2xl p-5 mb-8 gap-3 border border-gray-100">
          {[
            { label: 'Status', value: 'Requested', color: '#d97706' },
            { label: 'Next Step', value: 'Pickup Scheduled', color: '#2563eb' },
            { label: 'Refund', value: 'After Verification', color: '#16a34a' },
          ].map((row) => (
            <View key={row.label} className="flex-row justify-between">
              <Text className="text-gray-500 font-medium">{row.label}</Text>
              <Text className="font-extrabold" style={{ color: row.color }}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        <Button
          title="Go to My Orders"
          size="lg"
          className="w-full"
          onPress={() => router.navigate('/orders')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      <Header title="Return Product" />

      <ScrollView showsVerticalScrollIndicator={false} className="p-4">
        {/* Order Reference Card */}
        <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
          <Text className="text-gray-400 text-xs font-semibold mb-1">
            RETURNING ITEMS FROM
          </Text>
          <Text className="text-gray-900 font-extrabold text-base">
            Order #ORD10001
          </Text>
          <Text className="text-gray-500 text-xs mt-0.5">
            Delivered on Oct 5, 2026
          </Text>
        </View>

        {/* Reason Selection */}
        <Text className="text-gray-900 font-extrabold text-base mb-3">
          Why are you returning?
        </Text>
        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
          {RETURN_REASONS.map((reason, index) => {
            const isSelected = selectedReason === reason;
            const isLast = index === RETURN_REASONS.length - 1;

            return (
              <TouchableOpacity
                key={reason}
                className={`flex-row items-center justify-between p-4 ${
                  !isLast ? 'border-b border-gray-50' : ''
                } ${isSelected ? 'bg-green-50' : ''}`}
                onPress={() => setSelectedReason(reason)}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm ${
                    isSelected
                      ? 'text-green-800 font-extrabold'
                      : 'text-gray-700 font-medium'
                  }`}
                >
                  {reason}
                </Text>
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    isSelected
                      ? 'border-green-600 bg-green-600'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Details Input */}
        <Text className="text-gray-900 font-extrabold text-base mb-2">
          Additional Details (Optional)
        </Text>
        <View className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
          <TextInput
            className="text-gray-900 font-medium text-sm"
            placeholder="Tell us more about the issue with the product..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <Button
          title="Submit Return Request"
          size="lg"
          onPress={handleSubmit}
        />

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
