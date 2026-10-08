import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { userProfile } from '../../src/data/mockData';

interface MenuItemProps {
  icon: string;
  label: string;
  sub?: string;
  onPress?: () => void;
  danger?: boolean;
  iconColor?: string;
  iconBg?: string;
}

function MenuItem({ icon, label, sub, onPress, danger, iconColor, iconBg }: MenuItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center py-4 px-4 border-b border-gray-50 last:border-0"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="w-9 h-9 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: iconBg ?? (danger ? '#fef2f2' : '#f0fdf4') }}>
        <Ionicons name={icon as any} size={19} color={iconColor ?? (danger ? '#ef4444' : '#16a34a')} />
      </View>
      <View className="flex-1">
        <Text className={`font-semibold text-sm ${danger ? 'text-red-500' : 'text-gray-800'}`}>{label}</Text>
        {sub && <Text className="text-gray-400 text-xs mt-0.5">{sub}</Text>}
      </View>
      {!danger && <Ionicons name="chevron-forward" size={16} color="#d1d5db" />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { logout } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View className="bg-white px-4 pt-4 pb-6 mb-3">
          <Text className="text-gray-900 font-extrabold text-xl mb-5">My Account</Text>
          <View className="flex-row items-center">
            <Image source={{ uri: userProfile.avatar }} className="w-16 h-16 rounded-full border-2 border-green-100" />
            <View className="ml-4 flex-1">
              <Text className="text-gray-900 font-extrabold text-lg">{userProfile.name}</Text>
              <Text className="text-gray-500 text-sm">{userProfile.phone}</Text>
              <Text className="text-gray-400 text-xs">{userProfile.email}</Text>
            </View>
            <TouchableOpacity className="border border-green-200 bg-green-50 px-3 py-1.5 rounded-full">
              <Text className="text-green-700 text-sm font-bold">Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View className="flex-row mt-5 bg-gray-50 rounded-2xl p-3">
            {[
              { label: 'Orders', value: '12', icon: 'receipt-outline' },
              { label: 'Wishlist', value: '5', icon: 'heart-outline' },
              { label: 'Addresses', value: '2', icon: 'location-outline' },
            ].map((stat, idx) => (
              <View key={stat.label} className={`flex-1 items-center ${idx < 2 ? 'border-r border-gray-200' : ''}`}>
                <Ionicons name={stat.icon as any} size={18} color="#16a34a" />
                <Text className="text-gray-900 font-extrabold text-lg mt-1">{stat.value}</Text>
                <Text className="text-gray-400 text-xs">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Sections */}
        <View className="mx-4 mb-3 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
          <MenuItem icon="receipt-outline" label="My Orders" sub="Track & manage orders" onPress={() => router.push('/(tabs)/orders')} />
          <MenuItem icon="location-outline" label="My Addresses" sub="Saved delivery locations" iconBg="#eff6ff" iconColor="#3b82f6" />
          <MenuItem icon="card-outline" label="Payment Methods" sub="Cards, UPI & more" iconBg="#fef3c7" iconColor="#d97706" />
          <MenuItem icon="heart-outline" label="Wishlist" sub="Your saved items" iconBg="#fdf2f8" iconColor="#db2777" />
        </View>

        <View className="mx-4 mb-3 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
          <MenuItem icon="notifications-outline" label="Notifications" iconBg="#eff6ff" iconColor="#3b82f6" />
          <MenuItem icon="help-circle-outline" label="Help & Support" iconBg="#f5f3ff" iconColor="#7c3aed" />
          <MenuItem icon="document-text-outline" label="Terms & Conditions" iconBg="#fef3c7" iconColor="#b45309" />
          <MenuItem icon="shield-outline" label="Privacy Policy" iconBg="#fef2f2" iconColor="#dc2626" />
          <MenuItem icon="information-circle-outline" label="About Us" />
        </View>

        <View className="mx-4 mb-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
          <MenuItem icon="log-out-outline" label="Logout" danger onPress={logout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
