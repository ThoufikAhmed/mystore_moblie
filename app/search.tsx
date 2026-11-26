import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { products } from '../src/data/mockData';
import { formatPrice } from '../src/utils';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (query.trim().length === 0) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header Search Bar */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 p-1"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-12">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 font-medium"
            placeholder="Search for products..."
            placeholderTextColor="#9ca3af"
            autoFocus
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 bg-[#f8fafc]">
        {query.length === 0 ? (
          <View className="p-4">
            <Text className="text-gray-900 font-bold mb-4">Recent Searches</Text>
            <View className="flex-row flex-wrap gap-2">
              {['Basmati Rice', 'Sunflower Oil', 'Tomatoes'].map((item) => (
                <TouchableOpacity
                  key={item}
                  className="bg-white border border-gray-200 rounded-full px-4 py-2"
                  onPress={() => setQuery(item)}
                >
                  <Text className="text-gray-600 font-medium text-sm">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : searchResults.length > 0 ? (
          <View className="p-4">
            <Text className="text-gray-500 font-medium mb-4">
              {`Showing results for "${query}"`}
            </Text>
            {searchResults.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="flex-row items-center bg-white p-3 rounded-2xl mb-3 shadow-sm border border-gray-50"
                onPress={() => router.push(`/product/${product.id}`)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: product.image }}
                  className="w-16 h-16 rounded-xl bg-gray-100"
                  resizeMode="cover"
                />
                <View className="ml-3 flex-1">
                  <Text className="text-gray-900 font-bold text-sm" numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5">{product.unit}</Text>
                  <Text className="text-green-700 font-extrabold text-sm mt-1">
                    {formatPrice(product.price)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center p-8 mt-12">
            <Ionicons name="search-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-900 font-extrabold text-lg mt-4 mb-1">
              No results found
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              {`We couldn't find any products matching "${query}". Try searching for something else.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
