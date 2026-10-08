import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { products, Product } from '../src/data/mockData';
import { useCart } from '../src/context/CartContext';

const INITIAL_WISHLIST = [products[0], products[2], products[4]];

export default function WishlistScreen() {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<Product[]>(INITIAL_WISHLIST);

  const remove = (id: string) => setWishlist(prev => prev.filter(p => p.id !== id));

  if (wishlist.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3">
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>
          <Text className="text-gray-900 font-extrabold text-lg">My Wishlist</Text>
        </View>
        <View className="flex-1 items-center justify-center px-10">
          <View className="w-24 h-24 bg-red-50 rounded-full items-center justify-center mb-5">
            <Ionicons name="heart-outline" size={40} color="#ef4444" />
          </View>
          <Text className="text-gray-900 font-extrabold text-xl mb-2">Wishlist is Empty</Text>
          <Text className="text-gray-500 text-center font-medium leading-6 mb-8">
            Save your favourite products here so you can buy them later.
          </Text>
          <TouchableOpacity className="bg-green-600 px-10 py-4 rounded-2xl" onPress={() => router.replace('/(tabs)')}>
            <Text className="text-white font-extrabold">Browse Products</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3">
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-gray-900 font-extrabold text-lg flex-1">My Wishlist</Text>
        <View className="bg-red-100 px-3 py-1 rounded-full">
          <Text className="text-red-600 font-extrabold text-sm">{wishlist.length} Items</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="p-4">
        <View className="gap-3">
          {wishlist.map(product => (
            <View key={product.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-row items-center">
              <TouchableOpacity onPress={() => router.push(`/product/${product.id}`)}>
                <Image source={{ uri: product.image }} className="w-20 h-20 rounded-xl bg-gray-100" resizeMode="cover" />
              </TouchableOpacity>
              <View className="flex-1 ml-3">
                <TouchableOpacity onPress={() => router.push(`/product/${product.id}`)}>
                  <Text className="text-gray-900 font-bold text-sm mb-1" numberOfLines={2}>{product.name}</Text>
                </TouchableOpacity>
                <Text className="text-gray-400 text-xs mb-2">{product.unit}</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-green-700 font-extrabold text-base">₹{product.price}</Text>
                  {product.originalPrice && (
                    <Text className="text-gray-400 text-xs line-through">₹{product.originalPrice}</Text>
                  )}
                  {product.discount && (
                    <View className="bg-red-50 rounded-full px-1.5 py-0.5">
                      <Text className="text-red-500 font-bold text-[10px]">{product.discount}% OFF</Text>
                    </View>
                  )}
                </View>
              </View>
              <View className="gap-2 ml-2">
                <TouchableOpacity
                  className="w-9 h-9 bg-red-50 rounded-full items-center justify-center"
                  onPress={() => remove(product.id)}
                >
                  <Ionicons name="heart" size={18} color="#ef4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-9 h-9 bg-green-600 rounded-full items-center justify-center"
                  onPress={() => { addToCart(product); remove(product.id); }}
                >
                  <Ionicons name="cart-outline" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <View className="h-6" />
      </ScrollView>

      <View className="px-4 pb-4 pt-3 bg-white border-t border-gray-100">
        <TouchableOpacity
          className="bg-green-600 h-14 rounded-2xl items-center justify-center flex-row gap-2 shadow-sm"
          onPress={() => { wishlist.forEach(p => addToCart(p)); setWishlist([]); }}
        >
          <Ionicons name="cart-outline" size={20} color="white" />
          <Text className="text-white font-extrabold text-base">Add All to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
