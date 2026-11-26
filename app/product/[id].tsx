import React, { useState } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { products } from '../../src/data/mockData';
import { useCart, useWishlist } from '../../src/context';
import {
  Header,
  Button,
  QuantitySelector,
  PriceTag,
  Badge,
} from '../../src/components';
import { formatPrice } from '../../src/utils';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id) ?? products[0];
  const { addToCart, cartCount } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [pincode, setPincode] = useState('');
  const isHot = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Top Header */}
      <Header
        title="Product Details"
        rightAction={
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
              onPress={() => toggleWishlist(product)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isHot ? 'flame' : 'flame-outline'}
                size={22}
                color={isHot ? '#ea580c' : '#111827'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center relative border border-gray-100"
              onPress={() => router.navigate('/cart')}
              activeOpacity={0.7}
            >
              <Ionicons name="bag-outline" size={20} color="#111827" />
              {cartCount > 0 && (
                <View className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-600 rounded-full items-center justify-center">
                  <Text className="text-white text-[9px] font-bold">
                    {cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image Stage */}
        <View className="bg-gray-50 mx-4 mt-4 rounded-3xl items-center justify-center py-8 border border-gray-100">
          <Image
            source={{ uri: product.image }}
            style={{ width: width - 64, height: 220 }}
            resizeMode="contain"
          />
        </View>

        <View className="px-4 mt-5">
          {/* Name & Unit */}
          <Text className="text-gray-900 font-extrabold text-2xl leading-tight mb-1">
            {product.name}
          </Text>
          <Text className="text-gray-400 font-medium mb-3">
            Unit: {product.unit}
          </Text>

          {/* Rating & Stock Badges */}
          <View className="flex-row items-center gap-3 mb-5">
            <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-lg gap-1 border border-green-100">
              <Ionicons name="star" size={13} color="#16a34a" />
              <Text className="text-green-700 font-extrabold text-xs">
                {product.rating}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm font-medium">
              {product.reviews.toLocaleString()} reviews
            </Text>
            {product.inStock ? (
              <Badge label="In Stock" variant="success" size="sm" />
            ) : (
              <Badge label="Out of Stock" variant="error" size="sm" />
            )}
          </View>

          {/* Price Tag with Discounts */}
          <View className="bg-gray-50 p-4 rounded-2xl mb-5 border border-gray-100">
            <Text className="text-gray-400 text-xs font-semibold mb-1">
              Special Price
            </Text>
            <PriceTag
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              size="lg"
            />
          </View>

          {/* Description */}
          <Text className="text-gray-900 font-bold text-base mb-2">
            Description
          </Text>
          <Text className="text-gray-600 leading-6 mb-5">
            {product.description}
          </Text>

          {/* Features bullet list */}
          {product.features && product.features.length > 0 && (
            <View className="mb-6">
              <Text className="text-gray-900 font-bold text-base mb-3">
                Highlights
              </Text>
              <View className="gap-2">
                {product.features.map((feature, i) => (
                  <View key={i} className="flex-row items-center gap-2">
                    <View className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    <Text className="text-gray-700 font-medium text-sm">
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Delivery Pincode Checker */}
          <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
            <Text className="text-gray-900 font-bold text-sm mb-2">
              Delivery Options
            </Text>
            <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-12">
              <Ionicons name="location-outline" size={18} color="#6b7280" />
              <TextInput
                className="flex-1 ml-2 text-sm text-gray-900 font-medium"
                placeholder="Enter pincode"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
              />
              <TouchableOpacity>
                <Text className="text-green-700 font-extrabold text-sm">
                  Check
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-400 text-xs mt-2">
              Standard delivery in 1-2 days
            </Text>
          </View>
        </View>

        <View className="h-28" />
      </ScrollView>

      {/* Floating Add to Cart Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex-row items-center gap-4 shadow-lg">
        <QuantitySelector
          quantity={quantity}
          onIncrement={() => setQuantity((q) => q + 1)}
          onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
        />

        <Button
          title={addedToCart ? 'Added to Bag ✓' : `Add to Bag · ${formatPrice(product.price * quantity)}`}
          variant={addedToCart ? 'secondary' : 'primary'}
          onPress={handleAddToCart}
          size="lg"
          className="flex-1"
        />
      </View>
    </SafeAreaView>
  );
}
