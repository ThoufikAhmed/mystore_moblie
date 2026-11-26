import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useCart } from '../src/context';
import {
  CartItemCard,
  BillSummaryCard,
  EmptyState,
  Button,
  Header,
} from '../src/components';
import { formatPrice } from '../src/utils';

export default function CartScreen() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    discountTotal,
    deliveryCharge,
    grandTotal,
  } = useCart();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/(tabs)/profile');
    }
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <Header
          title="My Cart"
          showBack={true}
          onBackPress={handleBack}
        />
        <View className="flex-1 items-center justify-center">
          <EmptyState
            icon="bag-outline"
            title="Your Cart is Empty"
            description="Looks like you haven't added anything yet. Browse our fresh products and start filling your bag!"
            actionTitle="Continue Shopping"
            onAction={() => router.navigate('/(tabs)')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      {/* Header with Back Button */}
      <Header
        title="My Cart"
        subtitle={`${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
        showBack={true}
        onBackPress={handleBack}
        rightAction={
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-extrabold text-xs">
              {cartCount} Items
            </Text>
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-3">
          {cart.map((item) => (
            <CartItemCard
              key={item.product.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}

          <View className="mt-2">
            <BillSummaryCard
              itemTotal={cartTotal}
              deliveryCharge={deliveryCharge}
              discount={discountTotal}
              grandTotal={grandTotal}
            />
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Floating Checkout Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 pb-6 flex-row items-center shadow-lg">
        <View className="flex-1">
          <Text className="text-gray-400 text-xs font-semibold">Total Price</Text>
          <Text className="text-gray-900 font-black text-xl">
            {formatPrice(grandTotal)}
          </Text>
        </View>

        <Button
          title="Proceed to Checkout"
          rightIcon="arrow-forward"
          onPress={() => router.push('/checkout')}
          size="lg"
          className="flex-1"
        />
      </View>
    </SafeAreaView>
  );
}

