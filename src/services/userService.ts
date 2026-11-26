import { UserProfile, AppNotification } from '../types';
import { userProfile } from '../data/mockData';

let currentProfile = { ...userProfile };

let notifications: AppNotification[] = [
  { id: 'n1', title: 'Order Confirmed!', body: 'Your order #ORD10002 has been confirmed and is being prepared.', time: '2 min ago', type: 'order', read: false },
  { id: 'n2', title: 'Out for Delivery 🚴', body: 'Your order #ORD10002 is on the way. Arriving by 7:00 PM today.', time: '1 hr ago', type: 'delivery', read: false },
  { id: 'n3', title: '🎉 Weekend Offer!', body: 'Get 20% OFF on all fruits & vegetables this weekend. Use code FRESH20.', time: '3 hr ago', type: 'offer', read: true },
  { id: 'n4', title: 'Back in Stock!', body: 'India Gate Basmati Rice (10 KG) is back in stock. Order now!', time: 'Yesterday', type: 'stock', read: true },
  { id: 'n5', title: 'Order Delivered ✓', body: 'Your order #ORD10001 has been delivered. Rate your experience!', time: '2 days ago', type: 'order', read: true },
];

export const userService = {
  /**
   * Retrieves the current user's profile.
   */
  async getProfile(): Promise<UserProfile> {
    return currentProfile;
  },

  /**
   * Updates user profile fields.
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    currentProfile = { ...currentProfile, ...updates };
    return currentProfile;
  },

  /**
   * Retrieves notifications.
   */
  async getNotifications(): Promise<AppNotification[]> {
    return [...notifications];
  },

  /**
   * Marks a notification as read.
   */
  async markNotificationAsRead(id: string): Promise<void> {
    notifications = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
  },

  /**
   * Marks all notifications as read.
   */
  async markAllNotificationsAsRead(): Promise<void> {
    notifications = notifications.map((n) => ({ ...n, read: true }));
  },

  /**
   * Clears all notifications.
   */
  async clearAllNotifications(): Promise<void> {
    notifications = [];
  },
};
