import React from 'react';
import { View, Text } from 'react-native';
import { formatPrice } from '../../utils';

export interface PriceTagProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  discount,
  size = 'md',
}) => {
  const getPriceSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm font-bold';
      case 'lg':
        return 'text-2xl font-black';
      case 'md':
      default:
        return 'text-base font-extrabold';
    }
  };

  const getOriginalPriceSize = () => {
    switch (size) {
      case 'sm':
        return 'text-[10px]';
      case 'lg':
        return 'text-sm';
      case 'md':
      default:
        return 'text-xs';
    }
  };

  return (
    <View className="flex-row items-center gap-2">
      <Text className={`text-gray-900 ${getPriceSize()}`}>
        {formatPrice(price)}
      </Text>
      {originalPrice && originalPrice > price && (
        <Text
          className={`text-gray-400 line-through ${getOriginalPriceSize()}`}
        >
          {formatPrice(originalPrice)}
        </Text>
      )}
      {discount && discount > 0 ? (
        <View className="bg-red-500 rounded px-1.5 py-0.5">
          <Text className="text-white text-[9px] font-extrabold">
            {discount}% OFF
          </Text>
        </View>
      ) : null}
    </View>
  );
};
