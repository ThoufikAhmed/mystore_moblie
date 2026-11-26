import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '../../types';
import { QuantitySelector } from '../common/QuantitySelector';
import { formatPrice } from '../../utils';

export interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
      <View className="flex-row">
        <Image
          source={{ uri: item.product.image }}
          className="w-20 h-20 rounded-xl bg-gray-100"
          resizeMode="cover"
        />
        <View className="flex-1 ml-3">
          <View className="flex-row justify-between items-start">
            <Text
              className="text-gray-900 font-bold text-sm flex-1 pr-2"
              numberOfLines={2}
            >
              {item.product.name}
            </Text>
            <TouchableOpacity
              onPress={() => onRemove(item.product.id)}
              className="p-1"
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-400 text-xs mt-1 mb-3">
            {item.product.unit}
          </Text>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-green-700 font-extrabold text-lg">
                {formatPrice(item.product.price)}
              </Text>
              {item.product.originalPrice && (
                <Text className="text-gray-400 text-xs line-through">
                  {formatPrice(item.product.originalPrice)}
                </Text>
              )}
            </View>

            <QuantitySelector
              quantity={item.quantity}
              onIncrement={() =>
                onUpdateQuantity(item.product.id, item.quantity + 1)
              }
              onDecrement={() =>
                onUpdateQuantity(item.product.id, item.quantity - 1)
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};
