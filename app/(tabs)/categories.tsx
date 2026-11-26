import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { categories } from '../../src/data/mockData';
import { Header, EmptyState } from '../../src/components';

const { width } = Dimensions.get('window');
const cardWidth = (width - 36) / 2;

export default function CategoriesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.subcategories?.some((sub) => sub.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      {/* Top Header */}
      <Header
        title="All Categories"
        subtitle="Explore fresh groceries & daily essentials"
        showBack={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Search Bar */}
        <View className="px-4 pt-3 pb-2 bg-white border-b border-gray-100">
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-12">
            <Ionicons name="search" size={18} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 font-medium text-sm"
              placeholder="Search category or product..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hero Promotion Banner */}
        <View className="mx-4 mt-4 bg-green-800 rounded-3xl p-5 overflow-hidden shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <View className="bg-green-700/80 self-start px-2.5 py-1 rounded-full mb-2">
                <Text className="text-green-100 text-[10px] font-extrabold uppercase tracking-wider">
                  Instant Delivery
                </Text>
              </View>
              <Text className="text-white font-black text-xl leading-tight">
                Fresh Groceries Delivered in 15 Mins
              </Text>
              <Text className="text-green-100 text-xs mt-1">
                Highest quality sourced directly from trusted local farms
              </Text>
            </View>
            <View className="w-16 h-16 rounded-full bg-white/10 items-center justify-center border border-white/20">
              <Ionicons name="flash" size={32} color="#facc15" />
            </View>
          </View>
        </View>

        {/* Section Heading */}
        <View className="flex-row items-center justify-between px-4 mt-6 mb-3">
          <View>
            <Text className="text-gray-900 font-extrabold text-lg">
              Shop by Department
            </Text>
            <Text className="text-gray-400 text-xs font-medium">
              Select a category to view all products
            </Text>
          </View>
          <View className="bg-green-100 px-2.5 py-1 rounded-full">
            <Text className="text-green-800 font-extrabold text-xs">
              {filteredCategories.length} Categories
            </Text>
          </View>
        </View>

        {/* Full-Screen Category Cards Grid */}
        {filteredCategories.length === 0 ? (
          <View className="mt-8">
            <EmptyState
              icon="search-outline"
              iconColor="#9ca3af"
              iconBgColor="#f3f4f6"
              title="No Categories Found"
              description={`No category matched "${searchQuery}". Try searching for fruits, vegetables, rice, or tea.`}
              actionTitle="Clear Search"
              onAction={() => setSearchQuery('')}
            />
          </View>
        ) : (
          <View className="flex-row flex-wrap px-4 justify-between">
            {filteredCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                className="bg-white rounded-3xl mb-4 overflow-hidden shadow-sm border border-gray-100"
                style={{ width: cardWidth }}
                onPress={() => router.push(`/category/${cat.id}`)}
                activeOpacity={0.85}
              >
                {/* Category Header Image with Icon Overlay */}
                <View className="relative h-28 bg-gray-100">
                  {cat.bannerImage ? (
                    <Image
                      source={{ uri: cat.bannerImage }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : null}

                  {/* Gradient mask */}
                  <View
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
                    className="absolute inset-0"
                  />

                  {/* Icon badge */}
                  <View
                    style={{ backgroundColor: cat.color }}
                    className="absolute top-2.5 left-2.5 w-11 h-11 rounded-2xl items-center justify-center border border-white/60 shadow-sm"
                  >
                    <Ionicons name={cat.icon as any} size={22} color="#16a34a" />
                  </View>

                  {/* Discount tag */}
                  {cat.discountText ? (
                    <View className="absolute top-2.5 right-2.5 bg-red-500 rounded-full px-2 py-0.5 shadow-sm">
                      <Text className="text-white text-[9px] font-extrabold">
                        {cat.discountText}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Card Content */}
                <View className="p-3.5">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text
                      className="text-gray-900 font-black text-base flex-1 pr-1"
                      numberOfLines={1}
                    >
                      {cat.name}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#16a34a" />
                  </View>

                  <Text className="text-gray-400 text-xs font-semibold mb-2.5">
                    {cat.itemCount ? `${cat.itemCount}+ Products` : 'Explore items'}
                  </Text>

                  {/* Subcategories tags */}
                  {cat.subcategories && cat.subcategories.length > 0 ? (
                    <View className="flex-row flex-wrap gap-1">
                      {cat.subcategories.slice(0, 2).map((sub) => (
                        <View
                          key={sub}
                          className="bg-gray-100 rounded-lg px-2 py-0.5"
                        >
                          <Text
                            className="text-gray-600 text-[10px] font-medium"
                            numberOfLines={1}
                          >
                            {sub}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quality Badges */}
        <View className="mx-4 mt-4 mb-24 bg-white rounded-3xl p-4 border border-gray-100 flex-row items-center justify-between shadow-sm">
          <View className="items-center flex-1">
            <Ionicons name="shield-checkmark" size={24} color="#16a34a" />
            <Text className="text-gray-800 font-bold text-xs mt-1 text-center">
              100% Quality
            </Text>
            <Text className="text-gray-400 text-[10px] text-center">
              Fresh & Verified
            </Text>
          </View>
          <View className="w-px h-10 bg-gray-100" />
          <View className="items-center flex-1">
            <Ionicons name="time" size={24} color="#2563eb" />
            <Text className="text-gray-800 font-bold text-xs mt-1 text-center">
              15 Min Delivery
            </Text>
            <Text className="text-gray-400 text-[10px] text-center">
              To Doorstep
            </Text>
          </View>
          <View className="w-px h-10 bg-gray-100" />
          <View className="items-center flex-1">
            <Ionicons name="repeat" size={24} color="#d97706" />
            <Text className="text-gray-800 font-bold text-xs mt-1 text-center">
              Easy Return
            </Text>
            <Text className="text-gray-400 text-[10px] text-center">
              No questions asked
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
