import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const FAQ = [
  { q: 'How do I track my order?', a: 'Go to My Orders, select your order and tap "Track Order" to see real-time delivery updates.' },
  { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for eligible products. Go to the order and tap "Return Product".' },
  { q: 'How long does delivery take?', a: 'Standard delivery arrives the next day. Express delivery is available for same-day delivery for an additional fee.' },
  { q: 'How do I cancel my order?', a: 'You can cancel an order before it is "Picked Up" by going to Order Details and tapping Cancel Order.' },
  { q: 'When will my refund be processed?', a: 'Refunds are credited within 5–7 business days to your original payment method after we receive and verify the returned product.' },
];

const TOPICS = [
  { id: 't1', icon: 'cube-outline',     label: 'Order Issue',         color: '#2563eb', bg: '#eff6ff' },
  { id: 't2', icon: 'card-outline',     label: 'Payment Issue',       color: '#d97706', bg: '#fef3c7' },
  { id: 't3', icon: 'bicycle-outline',  label: 'Delivery Issue',      color: '#16a34a', bg: '#f0fdf4' },
  { id: 't4', icon: 'refresh-outline',  label: 'Return / Refund',     color: '#7c3aed', bg: '#f5f3ff' },
  { id: 't5', icon: 'cube-outline',     label: 'Product Quality',     color: '#dc2626', bg: '#fef2f2' },
  { id: 't6', icon: 'person-outline',   label: 'Account Issue',       color: '#0891b2', bg: '#ecfeff' },
];

export default function HelpScreen() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3">
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-gray-900 font-extrabold text-lg">Help & Support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Contact Options */}
        <View className="px-4 pt-5 pb-2">
          <Text className="text-gray-900 font-extrabold text-base mb-4">Contact Us</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 items-center shadow-sm"
              onPress={() => Linking.openURL('tel:+918001234567')}
            >
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="call-outline" size={24} color="#16a34a" />
              </View>
              <Text className="text-gray-900 font-extrabold text-sm">Call Us</Text>
              <Text className="text-gray-400 text-[10px] mt-0.5">Mon–Sat 9AM–6PM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 items-center shadow-sm"
              onPress={() => Alert.alert('Chat Support', 'Opening chat support...')}
            >
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="chatbubbles-outline" size={24} color="#2563eb" />
              </View>
              <Text className="text-gray-900 font-extrabold text-sm">Live Chat</Text>
              <Text className="text-gray-400 text-[10px] mt-0.5">24/7 Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 items-center shadow-sm"
              onPress={() => Linking.openURL('mailto:support@mygrocery.com')}
            >
              <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="mail-outline" size={24} color="#7c3aed" />
              </View>
              <Text className="text-gray-900 font-extrabold text-sm">Email Us</Text>
              <Text className="text-gray-400 text-[10px] mt-0.5">Reply in 24h</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Topic Selection */}
        <View className="px-4 pt-6 pb-2">
          <Text className="text-gray-900 font-extrabold text-base mb-4">What do you need help with?</Text>
          <View className="flex-row flex-wrap gap-3">
            {TOPICS.map(t => (
              <TouchableOpacity
                key={t.id}
                className="bg-white border border-gray-100 rounded-2xl py-3 px-4 flex-row items-center gap-2 shadow-sm"
                onPress={() => Alert.alert(t.label, `Raise a ticket for "${t.label}". Our team will respond within 4 hours.`)}
              >
                <View className="w-7 h-7 rounded-full items-center justify-center" style={{ backgroundColor: t.bg }}>
                  <Ionicons name={t.icon as any} size={14} color={t.color} />
                </View>
                <Text className="text-gray-700 font-bold text-xs">{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ */}
        <View className="px-4 pt-6 pb-4">
          <Text className="text-gray-900 font-extrabold text-base mb-4">Frequently Asked Questions</Text>
          <View className="gap-2">
            {FAQ.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                onPress={() => setOpenFaq(openFaq === idx ? null : idx)}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-between p-4">
                  <Text className="text-gray-900 font-bold text-sm flex-1 pr-3">{item.q}</Text>
                  <Ionicons
                    name={openFaq === idx ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#6b7280"
                  />
                </View>
                {openFaq === idx && (
                  <View className="px-4 pb-4 border-t border-gray-50">
                    <Text className="text-gray-500 font-medium text-sm leading-5 pt-3">{item.a}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
