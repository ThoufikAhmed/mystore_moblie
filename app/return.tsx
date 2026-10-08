import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const REASONS = [
  'Wrong product delivered',
  'Product is damaged',
  'Product is expired',
  'Product not as described',
  'I changed my mind',
  'Other',
];

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
        <Text className="text-gray-900 font-extrabold text-2xl mb-3 text-center">Return Request Submitted</Text>
        <Text className="text-gray-500 text-center leading-6 mb-10">
          We've received your return request. Our team will review it and arrange a pickup within 24–48 hours.
        </Text>
        <View className="w-full bg-gray-50 rounded-2xl p-5 mb-8 gap-3 border border-gray-100">
          {[
            { label: 'Status', value: 'Requested', color: '#d97706' },
            { label: 'Next Step', value: 'Pickup Scheduled', color: '#2563eb' },
            { label: 'Refund', value: 'After Verification', color: '#16a34a' },
          ].map(row => (
            <View key={row.label} className="flex-row justify-between">
              <Text className="text-gray-500 font-medium">{row.label}</Text>
              <Text className="font-extrabold" style={{ color: row.color }}>{row.value}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          className="w-full bg-green-600 h-14 rounded-2xl items-center justify-center"
          onPress={() => router.replace('/(tabs)/orders')}
        >
          <Text className="text-white font-extrabold text-base">Go to My Orders</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-gray-900 font-extrabold text-base">Return Product</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-gray-900 font-extrabold text-base mb-1">Why are you returning?</Text>
          <Text className="text-gray-500 text-sm mb-5">Please select the most appropriate reason.</Text>

          <View className="gap-3 mb-6">
            {REASONS.map(reason => (
              <TouchableOpacity
                key={reason}
                className={`flex-row items-center p-4 rounded-2xl border-2 ${selectedReason === reason ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}
                onPress={() => setSelectedReason(reason)}
              >
                <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${selectedReason === reason ? 'border-green-500' : 'border-gray-300'}`}>
                  {selectedReason === reason && <View className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                </View>
                <Text className={`flex-1 font-semibold text-sm ${selectedReason === reason ? 'text-green-800' : 'text-gray-700'}`}>{reason}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-gray-900 font-extrabold mb-2">Additional Details (Optional)</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-2xl p-4 text-gray-700 font-medium h-28 mb-4"
            placeholder="Describe the issue in more detail..."
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <View className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex-row items-start gap-3 mb-6">
            <Ionicons name="information-circle-outline" size={20} color="#d97706" style={{ marginTop: 1 }} />
            <Text className="text-amber-700 font-medium text-sm flex-1 leading-5">
              Refunds are processed within 5–7 business days to your original payment method after the product is picked up and verified.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="px-4 pb-4 pt-3 bg-white border-t border-gray-100">
        <TouchableOpacity
          className={`h-14 rounded-2xl items-center justify-center ${selectedReason ? 'bg-green-600' : 'bg-gray-200'}`}
          onPress={handleSubmit}
          disabled={!selectedReason}
        >
          <Text className={`font-extrabold text-base ${selectedReason ? 'text-white' : 'text-gray-400'}`}>
            Submit Return Request
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
