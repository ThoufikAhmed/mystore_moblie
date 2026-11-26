import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart, useWishlist } from '../src/context';
import { Header, EmptyState, Button } from '../src/components';
import { formatPrice } from '../src/utils';

export default function WishlistScreen() {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      <Header
        title="My Wishlist"
        rightAction={
          wishlist.length > 0 ? (
            <View className="bg-orange-100 px-3 py-1 rounded-full flex-row items-center gap-1">
              <Ionicons name="flame" size={13} color="#ea580c" />
              <Text className="text-orange-700 font-extrabold text-xs">
                {wishlist.length} Hot Items
              </Text>
            </View>
          ) : undefined
        }
      />

      {wishlist.length === 0 ? (
        <EmptyState
          icon="flame-outline"
          iconColor="#ea580c"
          iconBgColor="#fff7ed"
          title="Wishlist is Empty"
          description="Click the 🔥 hot icon on any product to save it here so you can purchase it whenever you need."
          actionTitle="Browse Products"
          onAction={() => router.navigate('/')}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="p-4">
          <View className="gap-3">
            {wishlist.map((product) => (
              <View
                key={product.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-row items-center"
              >
                <TouchableOpacity
                  onPress={() => router.push(`/product/${product.id}`)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: product.image }}
                    className="w-20 h-20 rounded-xl bg-gray-100"
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <View className="flex-1 ml-3">
                  <Text
                    className="text-gray-900 font-bold text-sm"
                    numberOfLines={1}
                  >
                    {product.name}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5 mb-2">
                    {product.unit}
                  </Text>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-green-700 font-extrabold text-base">
                      {formatPrice(product.price)}
                    </Text>

                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => removeFromWishlist(product.id)}
                        className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                      >
                        <Ionicons name="trash-outline" size={16} color="#ef4444" />
                      </TouchableOpacity>

                      <Button
                        title="Move to Cart"
                        size="sm"
                        onPress={() => {
                          addToCart(product);
                          removeFromWishlist(product.id);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View className="h-10" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
