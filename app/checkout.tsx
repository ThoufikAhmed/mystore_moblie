import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../src/context/CartContext';
import { userProfile } from '../src/data/mockData';

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = 'address' | 'delivery' | 'payment' | 'review';

interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pin: string;
  isDefault: boolean;
}

interface DeliveryOption {
  id: string;
  label: string;
  sub: string;
  price: number;
  icon: string;
}

interface PaymentMethod {
  id: string;
  label: string;
  sub: string;
  icon: string;
  color: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const ADDRESSES: Address[] = userProfile.addresses;

const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: 'd1', label: 'Standard Delivery', sub: 'Tomorrow, 10 AM – 2 PM', price: 0, icon: 'cube-outline' },
  { id: 'd2', label: 'Express Delivery', sub: 'Today, 6 PM – 8 PM', price: 49, icon: 'flash-outline' },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'upi', label: 'UPI', sub: 'Google Pay, PhonePe, Paytm', icon: 'phone-portrait-outline', color: '#7c3aed' },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: 'card-outline', color: '#2563eb' },
  { id: 'netbanking', label: 'Net Banking', sub: 'All major banks supported', icon: 'business-outline', color: '#0891b2' },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay at the door', icon: 'cash-outline', color: '#16a34a' },
];

// ─── Step Indicator ──────────────────────────────────────────────────────────
const STEPS: { key: Step; label: string }[] = [
  { key: 'address', label: 'Address' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.key === current);
  return (
    <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.key}>
          <View className="items-center">
            <View className={`w-7 h-7 rounded-full items-center justify-center ${i <= idx ? 'bg-green-600' : 'bg-gray-200'}`}>
              {i < idx
                ? <Ionicons name="checkmark" size={14} color="white" />
                : <Text className={`text-xs font-extrabold ${i <= idx ? 'text-white' : 'text-gray-500'}`}>{i + 1}</Text>
              }
            </View>
            <Text className={`text-[10px] font-bold mt-1 ${i <= idx ? 'text-green-700' : 'text-gray-400'}`}>{step.label}</Text>
          </View>
          {i < STEPS.length - 1 && (
            <View className={`flex-1 h-0.5 mx-1 mb-4 ${i < idx ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ─── Step 1: Address ─────────────────────────────────────────────────────────
function AddressStep({
  selected, onSelect, onNext,
}: { selected: Address | null; onSelect: (a: Address) => void; onNext: () => void }) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-gray-900 font-extrabold text-lg mb-4">Select Delivery Address</Text>

          {ADDRESSES.map(addr => (
            <TouchableOpacity
              key={addr.id}
              className={`rounded-2xl p-4 mb-3 border-2 ${selected?.id === addr.id ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}
              onPress={() => onSelect(addr)}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-row items-start flex-1">
                  <View className={`w-5 h-5 rounded-full border-2 mt-0.5 mr-3 items-center justify-center ${selected?.id === addr.id ? 'border-green-500' : 'border-gray-300'}`}>
                    {selected?.id === addr.id && <View className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <View className={`px-2 py-0.5 rounded-full ${addr.label === 'Home' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                        <Text className={`text-[10px] font-extrabold ${addr.label === 'Home' ? 'text-blue-700' : 'text-orange-700'}`}>{addr.label}</Text>
                      </View>
                      {addr.isDefault && (
                        <View className="bg-green-100 px-2 py-0.5 rounded-full">
                          <Text className="text-[10px] font-extrabold text-green-700">Default</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-900 font-bold mb-0.5">{addr.name}</Text>
                    <Text className="text-gray-500 text-sm leading-5">{addr.street}, {addr.area}</Text>
                    <Text className="text-gray-500 text-sm">{addr.city}, {addr.state} - {addr.pin}</Text>
                  </View>
                </View>
                <TouchableOpacity className="p-1 ml-2">
                  <Ionicons name="create-outline" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity className="flex-row items-center border-2 border-dashed border-green-300 rounded-2xl p-4 mb-6 bg-green-50/50">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="add" size={22} color="#16a34a" />
            </View>
            <Text className="text-green-700 font-bold text-base">Add New Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View className="p-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          className={`h-14 rounded-2xl items-center justify-center ${selected ? 'bg-green-600' : 'bg-gray-200'}`}
          disabled={!selected}
          onPress={onNext}
        >
          <Text className={`font-extrabold text-base ${selected ? 'text-white' : 'text-gray-400'}`}>
            Continue to Delivery
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Step 2: Delivery ────────────────────────────────────────────────────────
function DeliveryStep({
  selected, onSelect, onNext,
}: { selected: DeliveryOption | null; onSelect: (d: DeliveryOption) => void; onNext: () => void }) {
  return (
    <>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-gray-900 font-extrabold text-lg mb-4">Choose Delivery Option</Text>
          {DELIVERY_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.id}
              className={`rounded-2xl p-4 mb-3 border-2 flex-row items-center ${selected?.id === opt.id ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}
              onPress={() => onSelect(opt)}
            >
              <View className={`w-5 h-5 rounded-full border-2 mr-4 items-center justify-center ${selected?.id === opt.id ? 'border-green-500' : 'border-gray-300'}`}>
                {selected?.id === opt.id && <View className="w-2.5 h-2.5 rounded-full bg-green-500" />}
              </View>
              <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${selected?.id === opt.id ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Ionicons name={opt.icon as any} size={20} color={selected?.id === opt.id ? '#16a34a' : '#6b7280'} />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-extrabold">{opt.label}</Text>
                <Text className="text-gray-500 text-sm mt-0.5">{opt.sub}</Text>
              </View>
              {opt.price === 0
                ? <Text className="text-green-600 font-extrabold">FREE</Text>
                : <Text className="text-gray-900 font-extrabold">₹{opt.price}</Text>
              }
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View className="p-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          className={`h-14 rounded-2xl items-center justify-center ${selected ? 'bg-green-600' : 'bg-gray-200'}`}
          disabled={!selected}
          onPress={onNext}
        >
          <Text className={`font-extrabold text-base ${selected ? 'text-white' : 'text-gray-400'}`}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// ─── Step 3: Payment ─────────────────────────────────────────────────────────
function PaymentStep({
  selected, onSelect, onNext,
}: { selected: PaymentMethod | null; onSelect: (p: PaymentMethod) => void; onNext: () => void }) {
  const [upiId, setUpiId] = useState('');
  return (
    <>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-gray-900 font-extrabold text-lg mb-4">Select Payment Method</Text>

          {PAYMENT_METHODS.map(method => (
            <View key={method.id}>
              <TouchableOpacity
                className={`rounded-2xl p-4 mb-3 border-2 flex-row items-center ${selected?.id === method.id ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}
                onPress={() => onSelect(method)}
              >
                <View className={`w-5 h-5 rounded-full border-2 mr-4 items-center justify-center ${selected?.id === method.id ? 'border-green-500' : 'border-gray-300'}`}>
                  {selected?.id === method.id && <View className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                </View>
                <View className="w-10 h-10 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: method.color + '20' }}>
                  <Ionicons name={method.icon as any} size={20} color={method.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-extrabold">{method.label}</Text>
                  <Text className="text-gray-500 text-sm mt-0.5">{method.sub}</Text>
                </View>
              </TouchableOpacity>

              {/* UPI sub-form */}
              {selected?.id === 'upi' && method.id === 'upi' && (
                <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 -mt-1">
                  <Text className="text-gray-700 font-bold mb-2">Enter UPI ID</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 h-12">
                    <TextInput
                      className="flex-1 text-gray-900 font-medium"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChangeText={setUpiId}
                      autoCapitalize="none"
                    />
                    <Text className="text-green-600 font-bold text-sm">Verify</Text>
                  </View>
                  <Text className="text-gray-400 text-xs mt-2">Or pay with: Google Pay · PhonePe · Paytm</Text>
                </View>
              )}

              {/* Card sub-form */}
              {selected?.id === 'card' && method.id === 'card' && (
                <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 -mt-1 gap-3">
                  <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 justify-center">
                    <TextInput className="text-gray-900 font-medium" placeholder="Card Number" keyboardType="numeric" maxLength={19} />
                  </View>
                  <View className="flex-row gap-3">
                    <View className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 justify-center">
                      <TextInput className="text-gray-900 font-medium" placeholder="MM / YY" keyboardType="numeric" maxLength={5} />
                    </View>
                    <View className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 justify-center">
                      <TextInput className="text-gray-900 font-medium" placeholder="CVV" keyboardType="numeric" maxLength={3} secureTextEntry />
                    </View>
                  </View>
                  <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 justify-center">
                    <TextInput className="text-gray-900 font-medium" placeholder="Cardholder Name" />
                  </View>
                </View>
              )}
            </View>
          ))}

          {/* Security badge */}
          <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-2 mb-4">
            <Ionicons name="shield-checkmark" size={22} color="#16a34a" style={{ marginRight: 10 }} />
            <View>
              <Text className="text-gray-800 font-bold text-sm">100% Secure Payment</Text>
              <Text className="text-gray-500 text-xs mt-0.5">Your payment information is encrypted and secure.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="p-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          className={`h-14 rounded-2xl items-center justify-center ${selected ? 'bg-green-600' : 'bg-gray-200'}`}
          disabled={!selected}
          onPress={onNext}
        >
          <Text className={`font-extrabold text-base ${selected ? 'text-white' : 'text-gray-400'}`}>Review Order</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// ─── Step 4: Review ──────────────────────────────────────────────────────────
function ReviewStep({
  address, delivery, payment, onPlace,
}: {
  address: Address;
  delivery: DeliveryOption;
  payment: PaymentMethod;
  onPlace: () => void;
}) {
  const { cart, cartTotal, clearCart } = useCart();
  const deliveryCharge = delivery.price;
  const discount = Math.round(cart.reduce((s, i) => s + ((i.product.originalPrice ?? i.product.price) - i.product.price) * i.quantity, 0));
  const total = cartTotal + deliveryCharge - 0;

  return (
    <>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-4">

          {/* Delivery Address */}
          <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-900 font-extrabold">Delivery Address</Text>
              <Ionicons name="location-outline" size={18} color="#16a34a" />
            </View>
            <Text className="text-gray-900 font-bold">{address.name}</Text>
            <Text className="text-gray-500 text-sm mt-0.5">{address.street}, {address.area}</Text>
            <Text className="text-gray-500 text-sm">{address.city}, {address.state} - {address.pin}</Text>
          </View>

          {/* Products */}
          <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-gray-900 font-extrabold mb-3">Items ({cart.length})</Text>
            {cart.map(item => (
              <View key={item.product.id} className="flex-row justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <View className="flex-1 pr-4">
                  <Text className="text-gray-800 font-semibold text-sm" numberOfLines={1}>{item.product.name}</Text>
                  <Text className="text-gray-400 text-xs">{item.product.unit} × {item.quantity}</Text>
                </View>
                <Text className="text-gray-900 font-extrabold">₹{(item.product.price * item.quantity).toLocaleString()}</Text>
              </View>
            ))}
          </View>

          {/* Delivery */}
          <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-900 font-extrabold">Delivery</Text>
                <Text className="text-gray-500 text-sm mt-0.5">{delivery.label}</Text>
                <Text className="text-gray-400 text-xs">{delivery.sub}</Text>
              </View>
              {deliveryCharge === 0
                ? <Text className="text-green-600 font-extrabold text-base">FREE</Text>
                : <Text className="text-gray-900 font-extrabold text-base">₹{deliveryCharge}</Text>
              }
            </View>
          </View>

          {/* Payment */}
          <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-900 font-extrabold">Payment</Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name={payment.icon as any} size={16} color={payment.color} />
                <Text className="text-gray-700 font-semibold text-sm">{payment.label}</Text>
              </View>
            </View>
          </View>

          {/* Price Summary */}
          <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-gray-900 font-extrabold mb-4">Price Details</Text>
            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">MRP Total</Text>
                <Text className="text-gray-700 font-semibold">₹{(cartTotal + discount).toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Discount</Text>
                <Text className="text-green-600 font-bold">-₹{discount.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Delivery Charges</Text>
                {deliveryCharge === 0
                  ? <Text className="text-green-600 font-bold">FREE</Text>
                  : <Text className="text-gray-700 font-semibold">₹{deliveryCharge}</Text>
                }
              </View>
              <View className="border-t border-dashed border-gray-200 my-1" />
              <View className="flex-row justify-between">
                <Text className="text-gray-900 font-extrabold text-base">Total Amount</Text>
                <Text className="text-gray-900 font-extrabold text-base">₹{total.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="h-6" />
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          className="h-14 rounded-2xl items-center justify-center bg-green-600 shadow-sm"
          onPress={onPlace}
        >
          <Text className="text-white font-extrabold text-base">Place Order · ₹{total.toLocaleString()}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// ─── Main Checkout Screen ────────────────────────────────────────────────────
export default function CheckoutScreen() {
  const { clearCart } = useCart();
  const [step, setStep] = useState<Step>('address');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(ADDRESSES[0] ?? null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption | null>(DELIVERY_OPTIONS[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  const handlePlaceOrder = () => {
    clearCart();
    router.replace('/order-success');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      {/* Header */}
      <View className="flex-row items-center bg-white px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3"
          onPress={() => {
            if (step === 'address') router.back();
            else if (step === 'delivery') setStep('address');
            else if (step === 'payment') setStep('delivery');
            else setStep('payment');
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-gray-900 font-extrabold text-lg">Checkout</Text>
      </View>

      <StepIndicator current={step} />

      {step === 'address' && (
        <AddressStep
          selected={selectedAddress}
          onSelect={setSelectedAddress}
          onNext={() => setStep('delivery')}
        />
      )}
      {step === 'delivery' && (
        <DeliveryStep
          selected={selectedDelivery}
          onSelect={setSelectedDelivery}
          onNext={() => setStep('payment')}
        />
      )}
      {step === 'payment' && (
        <PaymentStep
          selected={selectedPayment}
          onSelect={setSelectedPayment}
          onNext={() => setStep('review')}
        />
      )}
      {step === 'review' && selectedAddress && selectedDelivery && selectedPayment && (
        <ReviewStep
          address={selectedAddress}
          delivery={selectedDelivery}
          payment={selectedPayment}
          onPlace={handlePlaceOrder}
        />
      )}
    </SafeAreaView>
  );
}
