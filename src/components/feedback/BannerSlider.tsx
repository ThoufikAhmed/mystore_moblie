import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Banner } from '../../types';

const { width } = Dimensions.get('window');

export interface BannerSliderProps {
  banners: Banner[];
  onBannerPress?: (banner: Banner) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  banners,
  onBannerPress,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="pl-4 mt-6"
    >
      {banners.map((banner) => (
        <TouchableOpacity
          key={banner.id}
          className="mr-4 relative overflow-hidden rounded-3xl"
          style={{
            width: width * 0.8,
            height: 160,
            backgroundColor: banner.color,
          }}
          onPress={() => onBannerPress && onBannerPress(banner)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: banner.image }}
            style={{ width: '100%', height: '100%', opacity: 0.8 }}
            resizeMode="cover"
          />
          <View className="absolute inset-0 p-5 justify-center">
            <Text className="text-white font-extrabold text-2xl w-2/3 leading-tight shadow-sm">
              {banner.title}
            </Text>
            <Text className="text-white font-medium text-sm mt-1">
              {banner.subtitle}
            </Text>
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderColor: 'rgba(255, 255, 255, 0.35)',
              }}
              className="self-start px-3 py-1.5 rounded-full mt-3 border"
            >
              <Text className="text-white font-bold text-xs">Shop Now</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
