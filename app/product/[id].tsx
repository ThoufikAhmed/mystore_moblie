import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  Dimensions, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { products } from '../../src/data/mockData';
import { useCart } from '../../src/context/CartContext';

const { width } = Dimensions.get('window');

function formatPrice(p: number) {
  return `₹${p.toLocaleString('en-IN')}`;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id) ?? products[0];
  const { addToCart, cartCount } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [wished, setWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [pincode, setPincode] = useState('');

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-50">
        <TouchableOpacity className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-gray-900 font-extrabold text-base flex-1 text-center">Product Details</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center" onPress={() => setWished(!wished)}>
            <Ionicons name={wished ? 'heart' : 'heart-outline'} size={20} color={wished ? '#ef4444' : '#111827'} />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center relative" onPress={() => router.push('/(tabs)/cart')}>
            <Ionicons name="bag-outline" size={20} color="#111827" />
            {cartCount > 0 && (
              <View className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-600 rounded-full items-center justify-center">
                <Text className="text-white text-[9px] font-bold">{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View className="bg-gray-50 mx-4 mt-4 rounded-3xl items-center justify-center py-8">
          <Image
            source={{ uri: product.image }}
            style={{ width: width - 64, height: 220 }}
            resizeMode="contain"
          />
        </View>

        <View className="px-4 mt-5">
          {/* Name & Rating */}
          <Text className="text-gray-900 font-extrabold text-2xl leading-tight mb-2">{product.name}</Text>
          <Text className="text-gray-400 font-medium mb-3">Unit: {product.unit}</Text>

          <View className="flex-row items-center gap-3 mb-5">
            <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-lg gap-1">
              <Ionicons name="star" size={13} color="#16a34a" />
              <Text className="text-green-700 font-extrabold text-xs">{product.rating}</Text>
            </View>
            <Text className="text-gray-500 text-sm font-medium">{product.reviews.toLocaleString()} reviews</Text>
            {product.inStock ? (
              <View className="flex-row items-center gap-1">
                <View className="w-2 h-2 bg-green-500 rounded-full" />
                <Text className="text-green-600 font-bold text-xs">In Stock</Text>
              </View>
            ) : (
              <Text className="text-red-500 font-bold text-xs">Out of Stock</Text>
            )}
          </View>

          {/* Price */}
          <View className="flex-row items-center gap-3 mb-6 bg-gray-50 p-4 rounded-2xl">
            <Text className="text-green-700 font-extrabold text-3xl">{formatPrice(product.price)}</Text>
            {product.originalPrice && (
              <Text className="text-gray-400 font-semibold text-lg line-through">{formatPrice(product.originalPrice)}</Text>
            )}
            {product.discount && (
              <View className="bg-red-50 border border-red-100 rounded-full px-2 py-1">
                <Text className="text-red-500 font-extrabold text-xs">{product.discount}% OFF</Text>
              </View>
            )}
          </View>

          {/* Quantity Selector */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-gray-900 font-extrabold text-base">Quantity</Text>
            <View className="flex-row items-center border border-gray-200 rounded-2xl overflow-hidden">
              <TouchableOpacity className="px-4 py-3 bg-gray-50" onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <Ionicons name="remove" size={20} color="#374151" />
              </TouchableOpacity>
              <Text className="px-5 font-extrabold text-lg text-gray-900">{quantity}</Text>
              <TouchableOpacity className="px-4 py-3 bg-green-600" onPress={() => setQuantity(quantity + 1)}>
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Delivery Pincode Check */}
          <View className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
            <Text className="text-gray-900 font-extrabold mb-3">Check Delivery</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-12">
                <Ionicons name="location-outline" size={18} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-2 font-medium text-gray-700"
                  placeholder="Enter PIN code"
                  keyboardType="numeric"
                  maxLength={6}
                  value={pincode}
                  onChangeText={setPincode}
                />
              </View>
              <TouchableOpacity className="bg-green-600 px-4 rounded-xl items-center justify-center">
                <Text className="text-white font-bold">Check</Text>
              </TouchableOpacity>
            </View>
            {pincode.length === 6 && (
              <View className="flex-row items-center mt-3 gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-green-600 font-bold text-sm">Delivery available! Arrives by Tomorrow</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View className="mb-5">
            <Text className="text-gray-900 font-extrabold text-base mb-2">About this product</Text>
            <Text className="text-gray-500 font-medium leading-6">{product.description}</Text>
          </View>

          {/* Features */}
          {product.features && (
            <View className="bg-green-50 rounded-2xl p-4 mb-8 border border-green-100">
              <Text className="text-gray-900 font-extrabold mb-3">Highlights</Text>
              {product.features.map((f) => (
                <View key={f} className="flex-row items-center mb-2 gap-2">
                  <View className="w-5 h-5 bg-green-100 rounded-full items-center justify-center">
                    <Ionicons name="checkmark" size={12} color="#16a34a" />
                  </View>
                  <Text className="text-gray-700 font-semibold text-sm">{f}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky CTA */}
      <View className="px-4 py-4 bg-white border-t border-gray-100 flex-row gap-3">
        <TouchableOpacity
          className={`flex-1 rounded-2xl h-14 items-center justify-center border-2 ${addedToCart ? 'border-green-600 bg-green-50' : 'border-green-100 bg-white'}`}
          onPress={handleAddToCart}
        >
          <Text className={`font-extrabold text-base ${addedToCart ? 'text-green-600' : 'text-gray-900'}`}>
            {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-green-600 rounded-2xl h-14 items-center justify-center shadow-sm"
          onPress={() => {
            addToCart(product, quantity);
            router.push('/checkout');
          }}
        >
          <Text className="text-white font-extrabold text-base">Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
