import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Product } from '../../types';
import { useCart, useWishlist } from '../../context';
import { formatPrice } from '../../utils';

export interface ProductCardProps {
  product: Product;
  width?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  showHotBadge?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  width = 160,
  isSelected,
  onSelect,
  showHotBadge = false,
  className,
}) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const isWished = isInWishlist(product.id);
  // Lit as HOT if it's in wishlist or explicitly marked as selected / hot
  const isHot = isSelected !== undefined ? isSelected : (isWished || showHotBadge);

  const handleCardPress = () => {
    router.push(`/product/${product.id}`);
  };

  const handleHotPress = () => {
    if (onSelect) {
      onSelect();
    }
    toggleWishlist(product);
  };

  return (
    <TouchableOpacity
      className={`bg-white rounded-2xl overflow-hidden shadow-sm ${className !== undefined ? className : 'mr-4'}`}
      style={{
        width,
        borderWidth: 0,
        borderColor: 'transparent',
      }}
      onPress={handleCardPress}
      activeOpacity={0.85}
    >
      <View className="relative">
        <Image
          source={{ uri: product.image }}
          style={{ width: '100%', height: 140, borderTopLeftRadius: 14, borderTopRightRadius: 14 }}
          resizeMode="cover"
        />

        {/* Discount Badge on Top Left */}
        {product.discount ? (
          <View
            style={{ borderWidth: 0, borderColor: 'transparent' }}
            className="absolute top-2 left-2 bg-red-500 rounded-full px-2 py-0.5 shadow-sm"
          >
            <Text className="text-white text-[10px] font-bold">
              {product.discount}% OFF
            </Text>
          </View>
        ) : null}

        {/* Empty Hot / Lit Hot Flame Button on Top Right (Adds to Wishlist) */}
        <TouchableOpacity
          onPress={handleHotPress}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[
            {
              position: 'absolute',
              top: 8,
              right: 8,
              borderRadius: 9999,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              borderWidth: 0,
              borderColor: 'transparent',
            },
            isHot
              ? {
                  backgroundColor: '#ea580c',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }
              : {
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  width: 30,
                  height: 30,
                },
          ]}
        >
          <Ionicons
            name={isHot ? 'flame' : 'flame-outline'}
            size={isHot ? 13 : 16}
            color="#ffffff"
          />
          {isHot && (
            <Text
              style={{
                color: '#ffffff',
                fontSize: 10,
                fontWeight: '900',
                letterSpacing: 0.5,
                marginLeft: 4,
              }}
            >
              HOT
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <Text
          className="text-gray-900 font-semibold text-sm mb-1"
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <Text className="text-gray-500 text-xs mb-2">{product.unit}</Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-1">
            <Text className="text-gray-900 font-extrabold text-base">
              {formatPrice(product.price)}
            </Text>
            {product.originalPrice && (
              <Text className="text-gray-400 text-xs line-through">
                {formatPrice(product.originalPrice)}
              </Text>
            )}
          </View>

          <View className="items-center justify-center">
            {quantity > 0 ? (
              <View
                className="flex-row items-center bg-green-600 rounded-full px-1 shadow-sm"
                style={{ height: 32 }}
              >
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, quantity - 1);
                  }}
                  activeOpacity={0.7}
                  className="w-7 h-7 items-center justify-center"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={quantity === 1 ? 'trash-outline' : 'remove'}
                    size={14}
                    color="white"
                  />
                </TouchableOpacity>

                <Text className="text-white font-extrabold text-xs px-1 min-w-[18px] text-center">
                  {quantity}
                </Text>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, quantity + 1);
                  }}
                  activeOpacity={0.7}
                  className="w-7 h-7 items-center justify-center"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="add" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={{ borderWidth: 0, borderColor: 'transparent' }}
                className="bg-green-600 rounded-full w-8 h-8 items-center justify-center shadow-sm"
                onPress={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
