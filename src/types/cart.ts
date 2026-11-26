import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  itemTotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  itemCount: number;
}

export interface DeliveryOption {
  id: string;
  label: string;
  sub: string;
  price: number;
  icon: string;
}

export type PaymentMethodId = 'upi' | 'card' | 'netbanking' | 'cod';

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  sub: string;
  icon: string;
  color: string;
}
