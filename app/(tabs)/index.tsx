import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { products, categories, banners, userProfile, Product } from '../../src/data/mockData';
import { useCart } from '../../src/context/CartContext';

const { width } = Dimensions.get('window');

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`;
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mr-4 shadow-sm border border-gray-100"
      style={{ width: 160 }}
      onPress={() => router.push(`/product/${product.id}`)}
      activeOpacity={0.85}
    >
      <View className="relative">
        <Image
          source={{ uri: product.image }}
          style={{ width: '100%', height: 140, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          resizeMode="cover"
        />
        {product.discount && (
          <View className="absolute top-2 left-2 bg-red-500 rounded-full px-2 py-0.5">
            <Text className="text-white text-[10px] font-bold">{product.discount}% OFF</Text>
          </View>
        )}
      </View>
      <View className="p-3">
        <Text className="text-gray-900 font-semibold text-sm mb-1" numberOfLines={2}>{product.name}</Text>
        <Text className="text-gray-500 text-xs mb-2">{product.unit}</Text>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-900 font-extrabold text-base">{formatPrice(product.price)}</Text>
            {product.originalPrice && (
              <Text className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</Text>
            )}
          </View>
          <TouchableOpacity 
            className="bg-green-600 rounded-full w-8 h-8 items-center justify-center shadow-sm"
            onPress={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <View className="flex-1 flex-row items-center">
          <Image source={{ uri: userProfile.avatar }} className="w-10 h-10 rounded-full mr-3" />
          <View>
            <Text className="text-gray-500 text-xs font-medium">Delivering to</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-extrabold text-sm">{userProfile.addresses[0].label} - {userProfile.addresses[0].pin}</Text>
              <Ionicons name="chevron-down" size={14} color="#111827" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </View>
        <TouchableOpacity className="relative p-2">
          <Ionicons name="notifications-outline" size={24} color="#111827" />
          <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="bg-[#f8fafc]">
        
        {/* Search Bar */}
        <View className="bg-white px-4 pb-4 rounded-b-3xl shadow-sm z-10">
          <TouchableOpacity 
            className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-12"
            onPress={() => router.push('/search')}
          >
            <Ionicons name="search" size={20} color="#6b7280" />
            <Text className="ml-3 text-gray-400 font-medium">Search for products...</Text>
          </TouchableOpacity>
        </View>

        {/* Banners */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4 mt-6">
          {banners.map((banner) => (
            <TouchableOpacity key={banner.id} className="mr-4 relative overflow-hidden rounded-3xl" style={{ width: width * 0.8, height: 160, backgroundColor: banner.color }}>
              <Image source={{ uri: banner.image }} style={{ width: '100%', height: '100%', opacity: 0.8 }} />
              <View className="absolute inset-0 p-5 justify-center">
                <Text className="text-white font-extrabold text-2xl w-2/3 leading-tight shadow-sm">{banner.title}</Text>
                <Text className="text-white font-medium text-sm mt-1">{banner.subtitle}</Text>
                <View className="bg-white/20 self-start px-3 py-1.5 rounded-full mt-3 backdrop-blur-md border border-white/30">
                  <Text className="text-white font-bold text-xs">Shop Now</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Categories */}
        <View className="mt-8 mb-2">
          <View className="flex-row items-center justify-between px-4 mb-4">
            <Text className="text-gray-900 font-extrabold text-lg">Shop by Category</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
              <Text className="text-green-700 font-bold text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} className="items-center mr-5" onPress={() => router.push('/(tabs)/categories')}>
                <View style={{ backgroundColor: cat.color }} className="w-16 h-16 rounded-full items-center justify-center mb-2 border border-black/5">
                  <Ionicons name={cat.icon as any} size={28} color="#16a34a" />
                </View>
                <Text className="text-gray-700 font-semibold text-xs text-center">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Best Sellers */}
        <View className="mt-8 mb-6">
          <View className="flex-row items-center justify-between px-4 mb-4">
            <Text className="text-gray-900 font-extrabold text-lg">Best Sellers</Text>
            <TouchableOpacity>
              <Text className="text-green-700 font-bold text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4 pb-2">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollView>
        </View>
        
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
