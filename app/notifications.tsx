import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppNotification } from '../src/types';
import { userService } from '../src/services';
import {
  Header,
  EmptyState,
  NotificationItemCard,
  Button,
} from '../src/components';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    userService.getNotifications().then(setNotifications);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    userService.markAllNotificationsAsRead();
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    userService.markNotificationAsRead(id);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      <Header
        title="Notifications"
        badgeCount={unreadCount}
        rightAction={
          unreadCount > 0 ? (
            <Button
              title="Mark All Read"
              variant="ghost"
              size="sm"
              onPress={markAllRead}
            />
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon="notifications-outline"
          iconColor="#3b82f6"
          iconBgColor="#eff6ff"
          title="All Caught Up!"
          description="No notifications right now. We'll let you know about your orders and offers."
          actionTitle="Browse Products"
          onAction={() => router.navigate('/')}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="p-4">
          {notifications.map((item) => (
            <NotificationItemCard
              key={item.id}
              notification={item}
              onPress={() => markRead(item.id)}
            />
          ))}
          <View className="h-10" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
