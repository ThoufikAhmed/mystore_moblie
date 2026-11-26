import { useState, useEffect, useCallback } from 'react';
import { OrderItem } from '../types';
import { orderService } from '../services';

export function useOrders() {
  const [orders, setOrders] = useState<OrderItem[]>(() => orderService.getOrdersSync());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = orderService.subscribe((newOrders) => {
      setOrders(newOrders);
    });
    return unsubscribe;
  }, []);

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    return await orderService.cancelOrder(orderId);
  };

  return {
    orders,
    loading,
    error,
    refreshOrders: fetchOrders,
    cancelOrder,
  };
}
