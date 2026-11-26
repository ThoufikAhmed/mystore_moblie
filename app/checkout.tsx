import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useCart, useAuth } from '../src/context';
import {
  Address,
  DeliveryOption,
  PaymentMethod,
} from '../src/types';
import {
  DEFAULT_DELIVERY_OPTIONS,
  DEFAULT_PAYMENT_METHODS,
} from '../src/constants';
import {
  Header,
  StepIndicator,
  CheckoutStep,
  AddressOptionCard,
  DeliveryOptionCard,
  PaymentOptionCard,
  BillSummaryCard,
  Button,
  Input,
} from '../src/components';
import { orderService } from '../src/services';
import { formatPrice } from '../src/utils';

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { cartTotal, discountTotal, cart, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [selectedAddress, setSelectedAddress] = useState<Address>(
    user.addresses.find((a) => a.isDefault) ?? user.addresses[0]
  );
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(
    DEFAULT_DELIVERY_OPTIONS[0]
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    DEFAULT_PAYMENT_METHODS[0]
  );
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const deliveryCharge = selectedDelivery.price;
  const grandTotal = cartTotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const newOrderId = `ORD${Math.floor(10000 + Math.random() * 90000)}`;
      await orderService.createOrder({
        id: newOrderId,
        items: cart.length > 0 ? cart.reduce((acc, item) => acc + item.quantity, 0) : 1,
        total: grandTotal,
        status: 'Out for Delivery',
      });
      clearCart();
      setTimeout(() => {
        setIsPlacingOrder(false);
        router.replace('/order-success');
      }, 1000);
    } catch {
      setIsPlacingOrder(false);
      router.replace('/order-success');
    }
  };

  const handleBack = () => {
    if (currentStep === 'review') setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('delivery');
    else if (currentStep === 'delivery') setCurrentStep('address');
    else router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      <Header title="Checkout" onBackPress={handleBack} />
      <StepIndicator current={currentStep} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        >
          {/* Step 1: Address Selection */}
          {currentStep === 'address' && (
            <View>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-900 font-extrabold text-lg">
                  Select Delivery Address
                </Text>
                <TouchableOpacity onPress={() => router.push('/addresses')}>
                  <Text className="text-green-700 font-bold text-sm">+ Add / Edit</Text>
                </TouchableOpacity>
              </View>

              {user.addresses.map((addr) => (
                <AddressOptionCard
                  key={addr.id}
                  address={addr}
                  isSelected={selectedAddress?.id === addr.id}
                  onSelect={setSelectedAddress}
                />
              ))}

              <View className="mt-4">
                <Button
                  title="Deliver to this Address"
                  rightIcon="arrow-forward"
                  size="lg"
                  onPress={() => setCurrentStep('delivery')}
                />
              </View>
            </View>
          )}

          {/* Step 2: Delivery Option */}
          {currentStep === 'delivery' && (
            <View>
              <Text className="text-gray-900 font-extrabold text-lg mb-3">
                Select Delivery Speed
              </Text>
              {DEFAULT_DELIVERY_OPTIONS.map((opt) => (
                <DeliveryOptionCard
                  key={opt.id}
                  option={opt}
                  isSelected={selectedDelivery.id === opt.id}
                  onSelect={setSelectedDelivery}
                />
              ))}

              <View className="mt-4">
                <Button
                  title="Continue to Payment"
                  rightIcon="arrow-forward"
                  size="lg"
                  onPress={() => setCurrentStep('payment')}
                />
              </View>
            </View>
          )}

          {/* Step 3: Payment Method */}
          {currentStep === 'payment' && (
            <View>
              <Text className="text-gray-900 font-extrabold text-lg mb-3">
                Choose Payment Method
              </Text>
              {DEFAULT_PAYMENT_METHODS.map((method) => (
                <PaymentOptionCard
                  key={method.id}
                  method={method}
                  isSelected={selectedPayment.id === method.id}
                  onSelect={setSelectedPayment}
                />
              ))}

              {selectedPayment.id === 'upi' && (
                <View className="bg-white p-4 rounded-2xl border border-gray-100 mb-4">
                  <Input
                    label="Enter UPI ID"
                    placeholder="e.g. mobile@upi"
                    value={upiId}
                    onChangeText={setUpiId}
                    leftIcon="phone-portrait-outline"
                    autoCapitalize="none"
                  />
                </View>
              )}

              {selectedPayment.id === 'card' && (
                <View className="bg-white p-4 rounded-2xl border border-gray-100 mb-4">
                  <Input
                    label="Card Number"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    leftIcon="card-outline"
                    keyboardType="numeric"
                  />
                </View>
              )}

              <View className="mt-4">
                <Button
                  title="Review Order"
                  rightIcon="arrow-forward"
                  size="lg"
                  onPress={() => setCurrentStep('review')}
                />
              </View>
            </View>
          )}

          {/* Step 4: Final Review */}
          {currentStep === 'review' && (
            <View className="gap-4">
              <Text className="text-gray-900 font-extrabold text-lg">
                Order Summary & Review
              </Text>

              {/* Address Review Card */}
              <View className="bg-white p-4 rounded-2xl border border-gray-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-400 text-xs font-bold uppercase">
                    Delivery Address
                  </Text>
                  <Button
                    title="Change"
                    variant="ghost"
                    size="sm"
                    onPress={() => setCurrentStep('address')}
                  />
                </View>
                <Text className="text-gray-900 font-extrabold text-sm">
                  {selectedAddress.name} ({selectedAddress.label})
                </Text>
                <Text className="text-gray-500 text-xs mt-0.5">
                  {selectedAddress.street}, {selectedAddress.area},{' '}
                  {selectedAddress.city} – {selectedAddress.pin}
                </Text>
              </View>

              {/* Delivery Speed Review */}
              <View className="bg-white p-4 rounded-2xl border border-gray-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-400 text-xs font-bold uppercase">
                    Delivery Speed
                  </Text>
                  <Button
                    title="Change"
                    variant="ghost"
                    size="sm"
                    onPress={() => setCurrentStep('delivery')}
                  />
                </View>
                <Text className="text-gray-900 font-extrabold text-sm">
                  {selectedDelivery.label}
                </Text>
                <Text className="text-gray-500 text-xs mt-0.5">
                  {selectedDelivery.sub}
                </Text>
              </View>

              {/* Payment Method Review */}
              <View className="bg-white p-4 rounded-2xl border border-gray-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-400 text-xs font-bold uppercase">
                    Payment Method
                  </Text>
                  <Button
                    title="Change"
                    variant="ghost"
                    size="sm"
                    onPress={() => setCurrentStep('payment')}
                  />
                </View>
                <Text className="text-gray-900 font-extrabold text-sm">
                  {selectedPayment.label}
                </Text>
                <Text className="text-gray-500 text-xs mt-0.5">
                  {selectedPayment.sub}
                </Text>
              </View>

              {/* Bill Details */}
              <BillSummaryCard
                itemTotal={cartTotal}
                deliveryCharge={deliveryCharge}
                discount={discountTotal}
                grandTotal={grandTotal}
              />

              <View className="mt-2 mb-6">
                <Button
                  title={`Pay ${formatPrice(grandTotal)} · Place Order`}
                  size="lg"
                  loading={isPlacingOrder}
                  onPress={handlePlaceOrder}
                />
              </View>
            </View>
          )}

          <View className="h-10" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
