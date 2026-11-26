import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/context';
import { useProducts } from '../../src/hooks';
import {
  ProductCard,
  CategoryItem,
  BannerSlider,
} from '../../src/components';

export default function HomeScreen() {
  const { user } = useAuth();
  const { products, categories, banners } = useProducts();
  const defaultAddress = user.addresses.find((a) => a.isDefault) ?? user.addresses[0];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <View className="flex-1 flex-row items-center mr-2">
          {/* User Profile Avatar */}
          <TouchableOpacity
            onPress={() => router.navigate('/(tabs)/profile')}
            activeOpacity={0.7}
            style={{ width: 44, height: 44 }}
            className="w-11 h-11 items-center justify-center mr-3"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Image
              source={{ uri: user.avatar }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              className="w-10 h-10 rounded-full bg-gray-100 border border-gray-100"
            />
          </TouchableOpacity>

          {/* Delivery Address Selector */}
          <TouchableOpacity
            className="flex-1 justify-center"
            onPress={() => router.push('/addresses')}
            activeOpacity={0.7}
          >
            <Text className="text-gray-500 text-xs font-medium">Delivering to</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-extrabold text-sm" numberOfLines={1}>
                {defaultAddress?.label ?? 'Home'} - {defaultAddress?.pin ?? '560029'}
              </Text>
              <Ionicons
                name="chevron-down"
                size={14}
                color="#111827"
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="relative p-2"
          onPress={() => router.push('/notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="#111827" />
          <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="bg-[#f8fafc]">
        {/* Search Bar Input Navigation */}
        <View className="bg-white px-4 pb-4 rounded-b-3xl shadow-sm z-10">
          <TouchableOpacity
            className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-12"
            onPress={() => router.push('/search')}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={20} color="#6b7280" />
            <Text className="ml-3 text-gray-400 font-medium">
              Search for products...
            </Text>
          </TouchableOpacity>
        </View>

        {/* Promotional Banners */}
        <BannerSlider banners={banners} />

        {/* Categories Section */}
        <View className="mt-8 mb-2">
          <View className="flex-row items-center justify-between px-4 mb-4">
            <Text className="text-gray-900 font-extrabold text-lg">
              Shop by Category
            </Text>
            <TouchableOpacity onPress={() => router.navigate('/categories')}>
              <Text className="text-green-700 font-bold text-sm">See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4"
          >
            {categories.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                onPress={() => router.push(`/category/${cat.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Best Sellers Section */}
        <View className="mt-8 mb-6">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <View className="flex-row items-center gap-2">
              <View className="w-7 h-7 rounded-full bg-orange-100 items-center justify-center">
                <Ionicons name="flame" size={16} color="#ea580c" />
              </View>
              <Text className="text-gray-900 font-extrabold text-lg">
                Best Sellers
              </Text>
              <View className="bg-orange-100 px-2 py-0.5 rounded-full">
                <Text className="text-orange-700 text-[10px] font-black">
                  HOT DEALS
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.navigate('/categories')}>
              <Text className="text-green-700 font-bold text-sm">See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4 pb-2"
          >
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </ScrollView>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
