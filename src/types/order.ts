export type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Processing'
  | 'Preparing'
  | 'Packed'
  | 'Partner Assigned'
  | 'Picked Up'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  id: string;
  date: string;
  items: number;
  total: number;
  status: 'Delivered' | 'Processing' | 'Cancelled' | 'Out for Delivery';
}

export interface TimelineStep {
  label: OrderStatus;
  sub: string;
  icon: string;
  done: boolean;
  active: boolean;
}

export interface ReturnRequest {
  orderId: string;
  reason: string;
  description?: string;
}
