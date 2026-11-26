import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth, useCart, useWishlist } from '../../src/context';
import { useOrders } from '../../src/hooks';
import { MenuItemRow, Input, Button } from '../../src/components';
import { isValidEmail, formatPrice } from '../../src/utils';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
];

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const { orders } = useOrders();
  const { cartCount, grandTotal } = useCart();
  const { wishlistCount } = useWishlist();

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openEditModal = () => {
    setName(user.name);
    setPhone(user.phone);
    setEmail(user.email);
    setAvatar(user.avatar);
    setError('');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (!phone.trim()) {
      setError('Phone number cannot be empty');
      return;
    }

    if (email.trim() && !isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      updateUser({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        avatar,
      });
      setIsSaving(false);
      setIsEditModalOpen(false);
      Alert.alert('Profile Updated', 'Your account details have been saved successfully.');
    }, 400);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View className="bg-white px-4 pt-4 pb-6 mb-3 border-b border-gray-100">
          <Text className="text-gray-900 font-extrabold text-xl mb-5">
            My Account
          </Text>

          <View className="flex-row items-center">
            <View className="relative">
              <Image
                source={{ uri: user.avatar }}
                className="w-16 h-16 rounded-full border-2 border-green-100 bg-gray-100"
              />
              <TouchableOpacity
                onPress={openEditModal}
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-600 items-center justify-center border-2 border-white"
                activeOpacity={0.8}
              >
                <Ionicons name="pencil" size={10} color="white" />
              </TouchableOpacity>
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-gray-900 font-extrabold text-lg" numberOfLines={1}>
                {user.name}
              </Text>
              <Text className="text-gray-500 text-sm mt-0.5">{user.phone}</Text>
              <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
                {user.email}
              </Text>
            </View>

            <TouchableOpacity
              onPress={openEditModal}
              className="border border-green-200 bg-green-50 px-3.5 py-1.5 rounded-full flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={14} color="#15803d" />
              <Text className="text-green-700 text-sm font-extrabold">Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats Summary */}
          <View className="flex-row mt-5 bg-gray-50 rounded-2xl p-3 border border-gray-100">
            <TouchableOpacity
              className="flex-1 items-center border-r border-gray-200"
              onPress={() => router.push('/orders')}
            >
              <Text className="text-gray-900 font-black text-lg">
                {orders.length}
              </Text>
              <Text className="text-gray-400 text-xs font-semibold">Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 items-center border-r border-gray-200"
              onPress={() => router.push('/cart')}
            >
              <Text className="text-gray-900 font-black text-lg">
                {cartCount}
              </Text>
              <Text className="text-gray-400 text-xs font-semibold">Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 items-center border-r border-gray-200"
              onPress={() => router.push('/wishlist')}
            >
              <Text className="text-gray-900 font-black text-lg">{wishlistCount}</Text>
              <Text className="text-gray-400 text-xs font-semibold">Wishlist</Text>
            </TouchableOpacity>

            <View className="flex-1 items-center">
              <Text className="text-gray-900 font-black text-lg">₹450</Text>
              <Text className="text-gray-400 text-xs font-semibold">Saved</Text>
            </View>
          </View>
        </View>

        {/* Cart Quick Action Banner */}
        {cartCount > 0 && (
          <TouchableOpacity
            onPress={() => router.push('/cart')}
            className="mx-4 mb-3 bg-green-50 border border-green-200 rounded-2xl p-4 flex-row items-center justify-between shadow-sm"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-xl bg-green-600 items-center justify-center mr-3">
                <Ionicons name="cart" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-green-900 font-extrabold text-sm">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in your Cart
                </Text>
                <Text className="text-green-700 text-xs font-medium mt-0.5">
                  Total: {formatPrice(grandTotal)} · Tap to checkout
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1 bg-green-600 px-3 py-1.5 rounded-full">
              <Text className="text-white font-bold text-xs">View</Text>
              <Ionicons name="chevron-forward" size={14} color="white" />
            </View>
          </TouchableOpacity>
        )}

        {/* Menu Navigation Items */}
        <View className="bg-white mx-4 rounded-2xl overflow-hidden shadow-sm border border-gray-50 mb-3">
          <MenuItemRow
            icon="cart-outline"
            label="My Cart"
            sub={
              cartCount > 0
                ? `${cartCount} ${cartCount === 1 ? 'item' : 'items'} ready for checkout`
                : 'View items & checkout'
            }
            badge={cartCount > 0 ? cartCount : undefined}
            onPress={() => router.push('/cart')}
          />
          <MenuItemRow
            icon="receipt-outline"
            label="My Orders"
            sub={
              orders.length > 0
                ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} placed`
                : 'View order status, invoice & history'
            }
            badge={orders.length > 0 ? orders.length : undefined}
            onPress={() => router.push('/orders')}
          />
          <MenuItemRow
            icon="heart-outline"
            label="My Wishlist"
            sub="Saved items for later purchase"
            onPress={() => router.push('/wishlist')}
          />
          <MenuItemRow
            icon="location-outline"
            label="Delivery Addresses"
            sub="Manage home, work & other addresses"
            onPress={() => router.push('/addresses')}
          />
          <MenuItemRow
            icon="map-outline"
            label="Live Map & GPS Tracking"
            sub="OpenStreetMap live tracking & backend sync"
            onPress={() => router.push('/track-location')}
          />
          <MenuItemRow
            icon="notifications-outline"
            label="Notifications"
            sub="Order updates & promotional alerts"
            onPress={() => router.push('/notifications')}
          />
        </View>

        <View className="bg-white mx-4 rounded-2xl overflow-hidden shadow-sm border border-gray-50 mb-6">
          <MenuItemRow
            icon="help-circle-outline"
            label="Help & Support"
            sub="FAQ, contact us & live chat"
            onPress={() => router.push('/help')}
          />
          <MenuItemRow
            icon="refresh-outline"
            label="Return & Refunds"
            sub="Initiate or track returns"
            onPress={() => router.push('/return')}
          />
          <MenuItemRow
            icon="log-out-outline"
            label="Log Out"
            sub="Sign out of this device"
            danger
            onPress={logout}
          />
        </View>

        <View className="items-center pb-8">
          <Text className="text-gray-400 text-xs">MyStore App · Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
            <Text className="text-gray-900 font-black text-xl">
              Edit Profile
            </Text>
            <TouchableOpacity
              onPress={() => setIsEditModalOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1"
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20 }}
            >
              {/* Avatar Selector Section */}
              <View className="items-center mb-6">
                <View className="relative mb-3">
                  <Image
                    source={{ uri: avatar }}
                    className="w-24 h-24 rounded-full border-4 border-green-100 bg-gray-100"
                  />
                  <View className="absolute bottom-0 right-0 bg-green-600 rounded-full w-8 h-8 items-center justify-center border-2 border-white">
                    <Ionicons name="camera" size={16} color="white" />
                  </View>
                </View>
                <Text className="text-gray-500 text-xs font-semibold mb-2">
                  Choose Profile Picture
                </Text>

                {/* Avatar presets */}
                <View className="flex-row gap-3">
                  {AVATAR_PRESETS.map((preset, idx) => {
                    const isSelected = avatar === preset;
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setAvatar(preset)}
                        className={`rounded-full p-0.5 border-2 ${
                          isSelected ? 'border-green-600' : 'border-transparent'
                        }`}
                        activeOpacity={0.8}
                      >
                        <Image
                          source={{ uri: preset }}
                          className="w-12 h-12 rounded-full"
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Input Fields */}
              <Input
                label="Full Name"
                placeholder="Enter full name"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  setError('');
                }}
                leftIcon="person-outline"
              />

              <Input
                label="Mobile Number"
                placeholder="Mobile number"
                value={phone}
                onChangeText={(t) => {
                  setPhone(t);
                  setError('');
                }}
                leftIcon="call-outline"
                keyboardType="phone-pad"
              />

              <Input
                label="Email Address"
                placeholder="Enter email address"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setError('');
                }}
                leftIcon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {error ? (
                <Text className="text-red-500 text-xs font-semibold mb-4 ml-1">
                  {error}
                </Text>
              ) : null}

              {/* Actions */}
              <View className="gap-3 mt-4 mb-10">
                <Button
                  title="Save Changes"
                  size="lg"
                  loading={isSaving}
                  onPress={handleSaveProfile}
                />
                <Button
                  title="Cancel"
                  variant="ghost"
                  size="md"
                  onPress={() => setIsEditModalOpen(false)}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
