import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../src/hooks';
import { Header, EmptyState, OrderCard } from '../src/components';

type OrderFilter = 'All' | 'Active' | 'Delivered' | 'Cancelled';

const FILTER_TABS: OrderFilter[] = ['All', 'Active', 'Delivered', 'Cancelled'];

export default function OrdersScreen() {
  const { orders, refreshOrders, cancelOrder } = useOrders();
  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshOrders();
    setRefreshing(false);
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel order #${orderId}?`,
      [
        { text: 'Keep Order', style: 'cancel' },
        {
          text: 'Yes, Cancel Order',
          style: 'destructive',
          onPress: async () => {
            const success = await cancelOrder(orderId);
            if (success) {
              Alert.alert(
                'Order Cancelled',
                `Order #${orderId} has been cancelled successfully. Any refund will be credited in 5-7 business days.`
              );
            } else {
              Alert.alert('Error', 'Unable to cancel this order.');
            }
          },
        },
      ]
    );
  };

  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'All') return orders;
    if (selectedFilter === 'Active') {
      return orders.filter(
        (o) => o.status === 'Processing' || o.status === 'Out for Delivery'
      );
    }
    return orders.filter((o) => o.status === selectedFilter);
  }, [orders, selectedFilter]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/(tabs)/profile');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      {/* Top Header with Back Button */}
      <Header
        title="My Orders"
        subtitle={
          orders.length > 0
            ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} placed`
            : undefined
        }
        showBack={true}
        onBackPress={handleBack}
        rightIcon="help-circle-outline"
        onRightPress={() => router.push('/help')}
      />

      {/* Filter Tabs */}
      {orders.length > 0 && (
        <View className="bg-white px-4 py-2.5 border-b border-gray-100 flex-row gap-2">
          {FILTER_TABS.map((tab) => {
            const isSelected = selectedFilter === tab;
            let count = orders.length;
            if (tab === 'Active') {
              count = orders.filter(
                (o) =>
                  o.status === 'Processing' || o.status === 'Out for Delivery'
              ).length;
            } else if (tab !== 'All') {
              count = orders.filter((o) => o.status === tab).length;
            }

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedFilter(tab)}
                activeOpacity={0.7}
                className={`px-3 py-1.5 rounded-full flex-row items-center gap-1.5 ${
                  isSelected
                    ? 'bg-green-700'
                    : 'bg-gray-100 border border-gray-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {tab}
                </Text>
                {count > 0 && (
                  <View
                    className={`rounded-full px-1.5 py-0.2 items-center justify-center ${
                      isSelected ? 'bg-green-800' : 'bg-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-extrabold ${
                        isSelected ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Orders List or Empty State */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          iconColor="#9ca3af"
          iconBgColor="#f3f4f6"
          title={
            selectedFilter === 'All'
              ? 'No Orders Yet'
              : `No ${selectedFilter} Orders`
          }
          description={
            selectedFilter === 'All'
              ? 'When you place an order, it will appear here for you to track and manage.'
              : `You don't have any orders currently categorized as ${selectedFilter.toLowerCase()}.`
          }
          actionTitle={selectedFilter === 'All' ? 'Start Shopping' : 'View All Orders'}
          onAction={() => {
            if (selectedFilter === 'All') {
              router.navigate('/(tabs)');
            } else {
              setSelectedFilter('All');
            }
          }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="p-4"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#15803d"
              colors={['#15803d']}
            />
          }
        >
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={handleCancelOrder}
            />
          ))}

          {/* Quick Help Card */}
          <TouchableOpacity
            className="mt-2 mb-6 bg-white rounded-2xl p-4 border border-gray-100 flex-row items-center justify-between shadow-sm"
            onPress={() => router.push('/help')}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-green-50 items-center justify-center">
                <Ionicons name="chatbubbles-outline" size={20} color="#15803d" />
              </View>
              <View>
                <Text className="text-gray-900 font-bold text-sm">Need Help with an Order?</Text>
                <Text className="text-gray-500 text-xs">Returns, refunds, delivery & payments</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <View className="h-24" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

