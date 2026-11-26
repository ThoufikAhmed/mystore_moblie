import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { HELP_FAQ, APP_CONFIG } from '../src/constants';
import { Header, Button, Input } from '../src/components';

interface HelpTopic {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub: string;
  color: string;
  bg: string;
  primaryActionLabel?: string;
  primaryActionRoute?: string;
  secondaryActionLabel?: string;
  secondaryActionRoute?: string;
  faqs: { q: string; a: string }[];
}

const TOPICS: HelpTopic[] = [
  {
    id: 't1',
    icon: 'cube-outline',
    label: 'Order Issue',
    sub: 'Missing items, cancel order, or track status',
    color: '#2563eb',
    bg: '#eff6ff',
    primaryActionLabel: 'View My Orders',
    primaryActionRoute: '/orders',
    secondaryActionLabel: 'Track Current Order',
    secondaryActionRoute: '/order-details/ORD10002',
    faqs: [
      {
        q: 'How do I cancel my order?',
        a: 'You can cancel an order before it is out for delivery by going to My Orders > Order Details > Cancel Order.',
      },
      {
        q: 'What if items are missing from my bag?',
        a: 'If any item is missing, please report it within 24 hours via Return & Refunds for an instant refund or free redelivery.',
      },
      {
        q: 'I received the wrong product',
        a: 'You can request a free pickup and replacement by selecting the order and tapping "Return Product".',
      },
    ],
  },
  {
    id: 't2',
    icon: 'card-outline',
    label: 'Payment Issue',
    sub: 'Failed payments, double debits, and refunds',
    color: '#d97706',
    bg: '#fef3c7',
    primaryActionLabel: 'Check My Orders',
    primaryActionRoute: '/orders',
    secondaryActionLabel: 'Call Billing Support',
    secondaryActionRoute: 'call',
    faqs: [
      {
        q: 'Money deducted but order not confirmed?',
        a: 'Bank debits for failed transactions are automatically refunded by your bank within 24 to 48 hours. If not received, please contact us with the transaction UTR number.',
      },
      {
        q: 'Charged twice for a single order?',
        a: 'Duplicate charges are instantly flagged by our gateway and refunded to your original payment method within 3 business days.',
      },
      {
        q: 'Which payment methods are accepted?',
        a: 'We accept UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery.',
      },
    ],
  },
  {
    id: 't3',
    icon: 'bicycle-outline',
    label: 'Delivery Issue',
    sub: 'Rider delays, wrong address, or delivery slot',
    color: '#16a34a',
    bg: '#f0fdf4',
    primaryActionLabel: 'Track Active Delivery',
    primaryActionRoute: '/order-details/ORD10002',
    secondaryActionLabel: 'Manage Addresses',
    secondaryActionRoute: '/addresses',
    faqs: [
      {
        q: 'My delivery is delayed',
        a: 'During peak hours or rain, deliveries may take 10-15 minutes longer. You can track your rider location live on the Order Details screen.',
      },
      {
        q: 'Delivery marked completed but not received',
        a: 'Please check with your building security or front door. If still not received, contact our Live Chat team immediately for urgent assistance.',
      },
      {
        q: 'Can I change delivery instructions?',
        a: 'Yes, you can share delivery instructions directly with the assigned delivery partner once your order is out for delivery.',
      },
    ],
  },
  {
    id: 't4',
    icon: 'refresh-outline',
    label: 'Return / Refund',
    sub: 'Pickup schedules, refund status, and return policy',
    color: '#7c3aed',
    bg: '#f5f3ff',
    primaryActionLabel: 'Initiate Return Request',
    primaryActionRoute: '/return',
    secondaryActionLabel: 'View Orders',
    secondaryActionRoute: '/orders',
    faqs: [
      {
        q: 'When will my refund arrive?',
        a: 'Refunds are credited to your original payment method within 5–7 business days after our executive verifies and picks up the item.',
      },
      {
        q: 'What is the return window?',
        a: 'Non-perishable items have a 7-day return window. Fresh fruits and vegetables should be reported within 24 hours of delivery.',
      },
      {
        q: 'Is there any pickup fee for returns?',
        a: 'No, return pickups are 100% free of charge.',
      },
    ],
  },
  {
    id: 't5',
    icon: 'shield-checkmark-outline',
    label: 'Product Quality',
    sub: 'Freshness, damaged packaging, or expiry dates',
    color: '#dc2626',
    bg: '#fef2f2',
    primaryActionLabel: 'Request Return / Refund',
    primaryActionRoute: '/return',
    secondaryActionLabel: 'Live Chat Support',
    secondaryActionRoute: 'chat',
    faqs: [
      {
        q: 'What if fruits or vegetables are not fresh?',
        a: 'We offer a 100% Freshness Guarantee. Tap "Return Product" in your order details to receive an immediate replacement or full refund.',
      },
      {
        q: 'Received a damaged or leaking product?',
        a: 'Please report it through Return & Refunds. We will immediately process a replacement or credit your payment method.',
      },
      {
        q: 'How do you ensure food safety?',
        a: 'All items are stored in temperature-controlled fulfillment hubs and undergo 3-stage quality checks before packing.',
      },
    ],
  },
  {
    id: 't6',
    icon: 'person-outline',
    label: 'Account Issue',
    sub: 'Profile details, addresses, and account security',
    color: '#0891b2',
    bg: '#ecfeff',
    primaryActionLabel: 'Manage Delivery Addresses',
    primaryActionRoute: '/addresses',
    secondaryActionLabel: 'Edit Profile Account',
    secondaryActionRoute: '/profile',
    faqs: [
      {
        q: 'How do I update my name or phone number?',
        a: 'Navigate to My Account > tap "Edit" next to your profile photo to update your personal information.',
      },
      {
        q: 'How do I save a new delivery address?',
        a: 'Go to My Account > Delivery Addresses > tap "+ Add" to save a new home, work, or other address.',
      },
      {
        q: 'How do I log out of my account?',
        a: 'Go to My Account, scroll to the bottom, and tap the red "Log Out" button.',
      },
    ],
  },
];

export default function HelpScreen() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);
  const [openTopicFaq, setOpenTopicFaq] = useState<number | null>(null);

  // Ticket modal state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketOrderId, setTicketOrderId] = useState('ORD10002');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSuccessId, setTicketSuccessId] = useState<string | null>(null);

  const handleAction = (route?: string) => {
    if (!route) return;
    if (route === 'call') {
      Linking.openURL(`tel:${APP_CONFIG.supportPhone.replace(/\s+/g, '')}`);
    } else if (route === 'chat') {
      Alert.alert('Live Chat', 'Connecting with support agent in chat...');
    } else {
      setSelectedTopic(null);
      if (
        route === '/orders' ||
        route === '/profile' ||
        route === '/cart' ||
        route === '/categories'
      ) {
        router.navigate(route as any);
      } else {
        router.push(route as any);
      }
    }
  };

  const handleOpenTicket = () => {
    if (selectedTopic) {
      setTicketSubject(`${selectedTopic.label} - Assistance Required`);
    } else {
      setTicketSubject('Support Assistance Required');
    }
    setTicketDescription('');
    setTicketSuccessId(null);
    setIsTicketModalOpen(true);
  };

  const handleSubmitTicket = () => {
    if (!ticketDescription.trim()) {
      Alert.alert('Required', 'Please describe the issue you are facing.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
      setIsSubmitting(false);
      setTicketSuccessId(generatedId);
    }, 600);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      <Header title="Help & Support" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Contact Options */}
        <View className="px-4 pt-5 pb-2">
          <Text className="text-gray-900 font-extrabold text-base mb-4">
            Contact Us
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 items-center shadow-sm"
              onPress={() => Linking.openURL(`tel:${APP_CONFIG.supportPhone.replace(/\s+/g, '')}`)}
              activeOpacity={0.8}
            >
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="call-outline" size={24} color="#16a34a" />
              </View>
              <Text className="text-gray-900 font-extrabold text-sm">Call Us</Text>
              <Text className="text-gray-400 text-[10px] mt-0.5">Mon–Sat 9AM–6PM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 items-center shadow-sm"
              onPress={() => Alert.alert('Chat Support', 'Connecting with a customer support executive...')}
              activeOpacity={0.8}
            >
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="chatbubbles-outline" size={24} color="#2563eb" />
              </View>
              <Text className="text-gray-900 font-extrabold text-sm">Live Chat</Text>
              <Text className="text-gray-400 text-[10px] mt-0.5">Instant response</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Topics Grid */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 font-extrabold text-base">
              Browse by Topic
            </Text>
            <Text className="text-green-700 text-xs font-bold">Tap to explore</Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {TOPICS.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-row items-center"
                style={{ width: '48%' }}
                onPress={() => {
                  setSelectedTopic(topic);
                  setOpenTopicFaq(0);
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{ backgroundColor: topic.bg }}
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                >
                  <Ionicons name={topic.icon} size={20} color={topic.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-extrabold text-sm" numberOfLines={1}>
                    {topic.label}
                  </Text>
                  <Text className="text-gray-400 text-[10px] mt-0.5">Quick Help</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Raise a Ticket Banner */}
        <View className="mx-4 mt-6 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1 pr-3">
              <Text className="text-gray-900 font-extrabold text-base">
                Still Need Assistance?
              </Text>
              <Text className="text-gray-500 text-xs mt-1">
                Raise a support ticket and our team will resolve it within 15 minutes.
              </Text>
            </View>
            <View className="w-12 h-12 bg-amber-100 rounded-2xl items-center justify-center">
              <Ionicons name="mail-unread-outline" size={24} color="#d97706" />
            </View>
          </View>
          <Button
            title="Raise Support Ticket"
            variant="outline"
            size="md"
            onPress={handleOpenTicket}
          />
        </View>

        {/* FAQs Accordion */}
        <View className="px-4 mt-6 mb-16">
          <Text className="text-gray-900 font-extrabold text-base mb-4">
            Frequently Asked Questions
          </Text>
          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {HELP_FAQ.map((faq, index) => {
              const isOpen = openFaq === index;
              const isLast = index === HELP_FAQ.length - 1;

              return (
                <View key={index} className={!isLast ? 'border-b border-gray-100' : ''}>
                  <TouchableOpacity
                    className="flex-row items-center justify-between p-4"
                    onPress={() => setOpenFaq(isOpen ? null : index)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-900 font-bold text-sm flex-1 pr-3">
                      {faq.q}
                    </Text>
                    <Ionicons
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                  {isOpen && (
                    <View className="px-4 pb-4 pt-1 bg-gray-50">
                      <Text className="text-gray-600 text-xs leading-5">
                        {faq.a}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Topic Details Modal */}
      <Modal
        visible={!!selectedTopic}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedTopic(null)}
      >
        {selectedTopic && (
          <SafeAreaView className="flex-1 bg-white">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
              <View className="flex-row items-center gap-2.5">
                <View
                  style={{ backgroundColor: selectedTopic.bg }}
                  className="w-9 h-9 rounded-xl items-center justify-center"
                >
                  <Ionicons
                    name={selectedTopic.icon}
                    size={20}
                    color={selectedTopic.color}
                  />
                </View>
                <View>
                  <Text className="text-gray-900 font-black text-lg">
                    {selectedTopic.label}
                  </Text>
                  <Text className="text-gray-400 text-xs font-medium">
                    Help & Resolutions
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedTopic(null)}
                className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
              {/* Topic Description Card */}
              <View
                style={{ backgroundColor: selectedTopic.bg }}
                className="rounded-2xl p-4 mb-5 border border-black/5"
              >
                <Text
                  style={{ color: selectedTopic.color }}
                  className="font-extrabold text-sm mb-1"
                >
                  {selectedTopic.label} Assistance
                </Text>
                <Text className="text-gray-700 text-xs leading-5">
                  {selectedTopic.sub}
                </Text>
              </View>

              {/* Quick Action Shortcuts */}
              <Text className="text-gray-900 font-extrabold text-sm mb-3">
                Quick Actions
              </Text>
              <View className="gap-2.5 mb-6">
                {selectedTopic.primaryActionLabel && (
                  <Button
                    title={selectedTopic.primaryActionLabel}
                    rightIcon="arrow-forward"
                    size="md"
                    onPress={() => handleAction(selectedTopic.primaryActionRoute)}
                  />
                )}

                {selectedTopic.secondaryActionLabel && (
                  <Button
                    title={selectedTopic.secondaryActionLabel}
                    variant="outline"
                    size="md"
                    onPress={() => handleAction(selectedTopic.secondaryActionRoute)}
                  />
                )}
              </View>

              {/* Topic Specific FAQs */}
              <Text className="text-gray-900 font-extrabold text-sm mb-3">
                Common Questions
              </Text>
              <View className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden mb-6">
                {selectedTopic.faqs.map((item, idx) => {
                  const isOpen = openTopicFaq === idx;
                  const isLast = idx === selectedTopic.faqs.length - 1;

                  return (
                    <View
                      key={idx}
                      className={!isLast ? 'border-b border-gray-200' : ''}
                    >
                      <TouchableOpacity
                        className="flex-row items-center justify-between p-4 bg-white"
                        onPress={() => setOpenTopicFaq(isOpen ? null : idx)}
                        activeOpacity={0.7}
                      >
                        <Text className="text-gray-900 font-bold text-xs flex-1 pr-2">
                          {item.q}
                        </Text>
                        <Ionicons
                          name={isOpen ? 'chevron-up' : 'chevron-down'}
                          size={16}
                          color="#9ca3af"
                        />
                      </TouchableOpacity>
                      {isOpen && (
                        <View className="px-4 pb-4 pt-1 bg-gray-50">
                          <Text className="text-gray-600 text-xs leading-5">
                            {item.a}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Still need help? */}
              <View className="bg-white rounded-2xl p-4 border border-gray-200 mb-12 items-center">
                <Text className="text-gray-900 font-extrabold text-sm mb-1 text-center">
                  Did not find what you were looking for?
                </Text>
                <Text className="text-gray-500 text-xs text-center mb-4">
                  Raise a ticket and our support agent will help you directly.
                </Text>
                <Button
                  title="Raise a Ticket for this Issue"
                  variant="secondary"
                  size="sm"
                  onPress={handleOpenTicket}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      {/* Raise Ticket Modal */}
      <Modal
        visible={isTicketModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsTicketModalOpen(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
            <Text className="text-gray-900 font-black text-xl">
              Raise Support Ticket
            </Text>
            <TouchableOpacity
              onPress={() => setIsTicketModalOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {ticketSuccessId ? (
            <View className="flex-1 items-center justify-center p-6">
              <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-5">
                <Ionicons name="checkmark-circle" size={48} color="#16a34a" />
              </View>
              <Text className="text-gray-900 font-black text-2xl mb-2 text-center">
                Ticket Created!
              </Text>
              <Text className="text-green-700 font-extrabold text-base mb-2">
                #{ticketSuccessId}
              </Text>
              <Text className="text-gray-500 text-center leading-6 text-sm mb-8">
                Your ticket has been registered. An executive is reviewing your issue and will respond within 15 minutes.
              </Text>

              <Button
                title="Done"
                size="lg"
                className="w-full"
                onPress={() => {
                  setIsTicketModalOpen(false);
                  setSelectedTopic(null);
                }}
              />
            </View>
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              className="flex-1"
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20 }}
              >
                <Input
                  label="Subject"
                  placeholder="Issue subject"
                  value={ticketSubject}
                  onChangeText={setTicketSubject}
                />

                <Input
                  label="Related Order ID (Optional)"
                  placeholder="e.g. ORD10002"
                  value={ticketOrderId}
                  onChangeText={setTicketOrderId}
                />

                <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">
                  Describe Your Issue
                </Text>
                <View className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6">
                  <TextInput
                    className="text-gray-900 font-medium text-sm"
                    placeholder="Provide details about what went wrong..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={ticketDescription}
                    onChangeText={setTicketDescription}
                  />
                </View>

                <View className="gap-3 mb-10">
                  <Button
                    title="Submit Ticket"
                    size="lg"
                    loading={isSubmitting}
                    onPress={handleSubmitTicket}
                  />
                  <Button
                    title="Cancel"
                    variant="ghost"
                    size="md"
                    onPress={() => setIsTicketModalOpen(false)}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
