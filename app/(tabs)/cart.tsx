import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../../src/context/CartContext';

function formatPrice(p: number) {
  return `₹${p.toLocaleString('en-IN')}`;
}

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const deliveryCharge = cartTotal > 500 ? 0 : 40;
  const discount = Math.round(cart.reduce((s, i) => s + ((i.product.originalPrice ?? i.product.price) - i.product.price) * i.quantity, 0));
  const total = cartTotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <View className="w-24 h-24 bg-green-50 rounded-full items-center justify-center mb-5">
          <Ionicons name="bag-outline" size={40} color="#16a34a" />
        </View>
        <Text className="text-gray-900 font-extrabold text-xl mb-2">Your Cart is Empty</Text>
        <Text className="text-gray-500 font-medium text-center mb-8">Looks like you haven't added anything yet. Browse our fresh products!</Text>
        <TouchableOpacity
          className="bg-green-600 px-10 py-4 rounded-2xl shadow-sm"
          onPress={() => router.push('/(tabs)')}
        >
          <Text className="text-white font-extrabold text-base">Continue Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
        <Text className="flex-1 text-gray-900 font-extrabold text-xl">My Cart</Text>
        <View className="bg-green-100 px-3 py-1.5 rounded-full">
          <Text className="text-green-700 font-extrabold">{cartCount} Items</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-3">
          {cart.map((item) => (
            <View key={item.product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <View className="flex-row">
                <Image
                  source={{ uri: item.product.image }}
                  className="w-20 h-20 rounded-xl bg-gray-100"
                  resizeMode="cover"
                />
                <View className="flex-1 ml-3">
                  <View className="flex-row justify-between items-start">
                    <Text className="text-gray-900 font-bold text-sm flex-1 pr-2" numberOfLines={2}>{item.product.name}</Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.product.id)} className="p-1">
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-gray-400 text-xs mt-1 mb-3">{item.product.unit}</Text>
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-green-700 font-extrabold text-lg">{formatPrice(item.product.price)}</Text>
                      {item.product.originalPrice && (
                        <Text className="text-gray-400 text-xs line-through">{formatPrice(item.product.originalPrice)}</Text>
                      )}
                    </View>
                    <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <TouchableOpacity className="px-3 py-2" onPress={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Ionicons name="remove" size={18} color="#374151" />
                      </TouchableOpacity>
                      <Text className="px-3 font-extrabold text-gray-900">{item.quantity}</Text>
                      <TouchableOpacity className="px-3 py-2 bg-green-600" onPress={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Ionicons name="add" size={18} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Price Summary */}
        <View className="mx-4 mb-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <Text className="text-gray-900 font-extrabold text-base mb-4">Price Details</Text>
          
          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-500 font-medium">MRP Total</Text>
              <Text className="text-gray-700 font-semibold">{formatPrice(cartTotal + discount)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 font-medium">Discount</Text>
              <Text className="text-green-600 font-bold">-{formatPrice(discount)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 font-medium">Delivery Charges</Text>
              {deliveryCharge === 0 ? (
                <Text className="text-green-600 font-bold">FREE</Text>
              ) : (
                <Text className="text-gray-700 font-semibold">{formatPrice(deliveryCharge)}</Text>
              )}
            </View>
            <View className="border-t border-dashed border-gray-200 my-1" />
            <View className="flex-row justify-between">
              <Text className="text-gray-900 font-extrabold text-base">Total Amount</Text>
              <Text className="text-gray-900 font-extrabold text-base">{formatPrice(total)}</Text>
            </View>
          </View>

          {discount > 0 && (
            <View className="bg-green-50 rounded-xl p-3 mt-4 border border-green-100 flex-row items-center gap-2">
              <Ionicons name="pricetag-outline" size={16} color="#16a34a" />
              <Text className="text-green-700 font-bold text-sm">You save {formatPrice(discount)} on this order!</Text>
            </View>
          )}
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Sticky Checkout Button */}
      <View className="px-4 pb-4 pt-3 bg-white border-t border-gray-100">
        <TouchableOpacity
          className="bg-green-600 h-14 rounded-2xl items-center justify-center flex-row gap-2 shadow-sm"
          onPress={() => router.push('/checkout')}
        >
          <Text className="text-white font-extrabold text-base">Proceed to Checkout</Text>
          <Text className="text-white/80 font-medium">· {formatPrice(total)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
