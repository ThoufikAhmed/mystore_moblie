import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../../src/data/mockData';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 3;

export default function CategoriesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4 border-b border-gray-100 bg-white">
        <Text className="text-2xl font-extrabold text-gray-900">Categories</Text>
      </View>
      <ScrollView className="flex-1 bg-[#f8fafc]">
        <View className="flex-row flex-wrap p-4 gap-4">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              className="bg-white rounded-2xl items-center p-4 shadow-sm border border-gray-50"
              style={{ width: itemWidth }}
            >
              <View style={{ backgroundColor: cat.color }} className="w-14 h-14 rounded-full items-center justify-center mb-3">
                <Ionicons name={cat.icon as any} size={24} color="#16a34a" />
              </View>
              <Text className="text-gray-800 font-bold text-xs text-center">{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
