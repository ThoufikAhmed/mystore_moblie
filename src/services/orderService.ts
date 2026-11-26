import { OrderItem, ReturnRequest } from '../types';

let mockOrders: OrderItem[] = [
  { id: 'ORD10001', date: 'Oct 5, 2026', items: 3, total: 1240, status: 'Delivered' },
  { id: 'ORD10002', date: 'Oct 7, 2026', items: 2, total: 780, status: 'Out for Delivery' },
];

type OrderListener = (orders: OrderItem[]) => void;
const listeners: Set<OrderListener> = new Set();

function notifyListeners() {
  const currentOrders = [...mockOrders];
  listeners.forEach((listener) => {
    try {
      listener(currentOrders);
    } catch (e) {
      console.error('Error notifying order listener', e);
    }
  });
}

export const orderService = {
  /**
   * Subscribes to order changes.
   */
  subscribe(listener: OrderListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /**
   * Synchronously gets orders from in-memory store.
   */
  getOrdersSync(): OrderItem[] {
    return [...mockOrders];
  },

  /**
   * Fetches all user orders.
   */
  async getOrders(): Promise<OrderItem[]> {
    return [...mockOrders];
  },

  /**
   * Fetches an order by its ID.
   */
  async getOrderById(id: string): Promise<OrderItem | undefined> {
    return mockOrders.find((o) => o.id === id);
  },

  /**
   * Creates a new order.
   */
  async createOrder(order: Omit<OrderItem, 'date'>): Promise<OrderItem> {
    const newOrder: OrderItem = {
      ...order,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    mockOrders = [newOrder, ...mockOrders];
    notifyListeners();
    return newOrder;
  },

  /**
   * Cancels an order.
   */
  async cancelOrder(id: string): Promise<boolean> {
    const index = mockOrders.findIndex((o) => o.id === id);
    if (index === -1) return false;
    mockOrders = mockOrders.map((o) =>
      o.id === id ? { ...o, status: 'Cancelled' as const } : o
    );
    notifyListeners();
    return true;
  },

  /**
   * Submits a return request.
   */
  async submitReturn(req: ReturnRequest): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Return request for order #${req.orderId} submitted successfully.`,
    };
  },
};
