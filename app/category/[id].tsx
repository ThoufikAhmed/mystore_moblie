import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { categories, products } from '../../src/data/mockData';
import { useCart } from '../../src/context';
import { Header, ProductCard, EmptyState } from '../../src/components';

const { width } = Dimensions.get('window');
const cardWidth = (width - 44) / 2;

type FilterType = 'all' | 'inStock' | 'discount' | 'priceLow';

export default function CategoryScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { cartCount } = useCart();

  // Find category by ID or name
  const categoryId = params.id || categories[0].id;
  const initialCategory = useMemo(() => {
    const foundById = categories.find((c) => c.id.toLowerCase() === categoryId.toLowerCase());
    if (foundById) return foundById;
    const foundByName = categories.find(
      (c) => c.name.toLowerCase().replace(/\s+/g, '-') === categoryId.toLowerCase()
    );
    return foundByName || categories[0];
  }, [categoryId]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const currentCategory = useMemo(() => {
    const activeId = selectedCategoryId || initialCategory.id;
    return categories.find((c) => c.id === activeId) || initialCategory;
  }, [selectedCategoryId, initialCategory]);

  // Filter and sort products
  const categoryProducts = useMemo(() => {
    let result = products.filter((p) => p.categoryId === currentCategory.id);

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'inStock') {
      result = result.filter((p) => p.inStock);
    } else if (activeFilter === 'discount') {
      result = result.filter((p) => (p.discount ?? 0) > 0);
    } else if (activeFilter === 'priceLow') {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    return result;
  }, [currentCategory.id, searchQuery, activeFilter]);

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      {/* Top Header */}
      <Header
        title={currentCategory.name}
        subtitle={`${categoryProducts.length} Products`}
        rightAction={
          <TouchableOpacity
            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center relative border border-gray-100"
            onPress={() => router.navigate('/cart')}
            activeOpacity={0.7}
          >
            <Ionicons name="bag-outline" size={20} color="#111827" />
            {cartCount > 0 && (
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full items-center justify-center">
                <Text className="text-white text-[9px] font-bold">
                  {cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Horizontal Category Pill Tabs */}
        <View className="bg-white py-3 border-b border-gray-100">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4"
          >
            {categories.map((cat) => {
              const isSelected = cat.id === currentCategory.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    setSelectedCategoryId(cat.id);
                    setSearchQuery('');
                  }}
                  className={`flex-row items-center px-3.5 py-2 rounded-full mr-2.5 border ${
                    isSelected
                      ? 'bg-green-600 border-green-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={16}
                    color={isSelected ? '#ffffff' : '#4b5563'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    className={`text-xs font-extrabold ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* In-Category Search Box */}
        <View className="p-4 bg-white border-b border-gray-100">
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-3.5 h-12">
            <Ionicons name="search" size={18} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-2.5 text-gray-900 font-medium text-sm"
              placeholder={`Search in ${currentCategory.name}...`}
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Chips Bar */}
        <View className="flex-row items-center px-4 py-3 bg-[#f8fafc] gap-2">
          {[
            { key: 'all', label: 'All Items' },
            { key: 'inStock', label: 'In Stock' },
            { key: 'discount', label: 'Offers' },
            { key: 'priceLow', label: 'Price: Low' },
          ].map((f) => {
            const isSelected = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key as FilterType)}
                className={`px-3 py-1.5 rounded-xl border ${
                  isSelected
                    ? 'bg-green-100 border-green-300'
                    : 'bg-white border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-xs ${
                    isSelected
                      ? 'text-green-800 font-extrabold'
                      : 'text-gray-600 font-medium'
                  }`}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Product Grid */}
        {categoryProducts.length === 0 ? (
          <View className="mt-8">
            <EmptyState
              icon="search-outline"
              iconColor="#9ca3af"
              iconBgColor="#f3f4f6"
              title="No Products Found"
              description={`No products found in ${currentCategory.name} matching your search or filters.`}
              actionTitle="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
            />
          </View>
        ) : (
          <View className="flex-row flex-wrap px-4 pt-1 pb-16 justify-between">
            {categoryProducts.map((product) => (
              <View key={product.id} className="mb-4" style={{ width: cardWidth }}>
                <ProductCard product={product} width={cardWidth} className="" />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
