import { DeliveryOption, PaymentMethod } from '../types';

export const APP_CONFIG = {
  name: 'MyStore',
  tagline: 'Fresh Groceries Delivered in Minutes',
  currencySymbol: '₹',
  freeDeliveryThreshold: 500,
  standardDeliveryFee: 40,
  expressDeliveryFee: 49,
  supportPhone: '+91 800 123 4567',
  supportEmail: 'support@mystore.in',
  returnWindowDays: 7,
};

export const RETURN_REASONS = [
  'Wrong product delivered',
  'Product is damaged',
  'Product is expired',
  'Product not as described',
  'I changed my mind',
  'Other',
];

export const DEFAULT_DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: 'd1', label: 'Standard Delivery', sub: 'Tomorrow, 10 AM – 2 PM', price: 0, icon: 'cube-outline' },
  { id: 'd2', label: 'Express Delivery', sub: 'Today, 6 PM – 8 PM', price: 49, icon: 'flash-outline' },
];

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'upi', label: 'UPI', sub: 'Google Pay, PhonePe, Paytm', icon: 'phone-portrait-outline', color: '#7c3aed' },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: 'card-outline', color: '#2563eb' },
  { id: 'netbanking', label: 'Net Banking', sub: 'All major banks supported', icon: 'business-outline', color: '#0891b2' },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay at the door', icon: 'cash-outline', color: '#16a34a' },
];

export const HELP_FAQ = [
  { q: 'How do I track my order?', a: 'Go to My Orders, select your order and tap "Track Order" to see real-time delivery updates.' },
  { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for eligible products. Go to the order and tap "Return Product".' },
  { q: 'How long does delivery take?', a: 'Standard delivery arrives the next day. Express delivery is available for same-day delivery for an additional fee.' },
  { q: 'How do I cancel my order?', a: 'You can cancel an order before it is "Picked Up" by going to Order Details and tapping Cancel Order.' },
  { q: 'When will my refund be processed?', a: 'Refunds are credited within 5–7 business days to your original payment method after we receive and verify the returned product.' },
];
