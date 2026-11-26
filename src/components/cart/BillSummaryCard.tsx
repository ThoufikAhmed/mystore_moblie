import React from 'react';
import { View, Text } from 'react-native';
import { formatPrice } from '../../utils';
import { APP_CONFIG } from '../../constants';

export interface BillSummaryCardProps {
  itemTotal: number;
  deliveryCharge: number;
  discount?: number;
  grandTotal: number;
}

export const BillSummaryCard: React.FC<BillSummaryCardProps> = ({
  itemTotal,
  deliveryCharge,
  discount = 0,
  grandTotal,
}) => {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
      <Text className="text-gray-900 font-extrabold text-base mb-3">
        Bill Details
      </Text>

      <View className="gap-2.5">
        <View className="flex-row justify-between">
          <Text className="text-gray-500 text-sm">Items Total</Text>
          <Text className="text-gray-900 font-bold text-sm">
            {formatPrice(itemTotal)}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-gray-500 text-sm">Delivery Fee</Text>
          {deliveryCharge === 0 ? (
            <Text className="text-green-700 font-extrabold text-sm">FREE</Text>
          ) : (
            <Text className="text-gray-900 font-bold text-sm">
              {formatPrice(deliveryCharge)}
            </Text>
          )}
        </View>

        {discount > 0 && (
          <View className="flex-row justify-between">
            <Text className="text-green-700 text-sm font-semibold">
              Total Discount
            </Text>
            <Text className="text-green-700 font-extrabold text-sm">
              -{formatPrice(discount)}
            </Text>
          </View>
        )}

        <View className="border-t border-dashed border-gray-200 pt-3 mt-1 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-900 font-extrabold text-base">To Pay</Text>
            <Text className="text-gray-400 text-xs font-medium">
              Inclusive of all taxes
            </Text>
          </View>
          <Text className="text-gray-900 font-black text-xl">
            {formatPrice(grandTotal)}
          </Text>
        </View>
      </View>

      {itemTotal < APP_CONFIG.freeDeliveryThreshold && (
        <View className="mt-4 bg-green-50 p-2.5 rounded-xl flex-row items-center">
          <Text className="text-green-800 text-xs font-semibold">
            Add items worth {formatPrice(APP_CONFIG.freeDeliveryThreshold - itemTotal)} more for FREE delivery!
          </Text>
        </View>
      )}
    </View>
  );
};
