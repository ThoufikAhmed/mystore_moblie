export type NotificationType = 'order' | 'offer' | 'delivery' | 'stock';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: NotificationType;
  read: boolean;
}
