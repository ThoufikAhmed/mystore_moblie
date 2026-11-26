import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../src/context';
import { Address } from '../src/types';
import { Header, Button, Input, EmptyState } from '../src/components';

const LABELS = ['Home', 'Work', 'Other'];

export default function AddressesScreen() {
  const { user, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [label, setLabel] = useState('Home');
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [pin, setPin] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setLabel('Home');
    setName(user.name);
    setStreet('');
    setArea('');
    setCity('Bangalore');
    setState('Karnataka');
    setPin('');
    setIsDefault(user.addresses.length === 0);
    setError('');
    setModalVisible(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setLabel(addr.label);
    setName(addr.name);
    setStreet(addr.street);
    setArea(addr.area);
    setCity(addr.city);
    setState(addr.state);
    setPin(addr.pin);
    setIsDefault(addr.isDefault);
    setError('');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!name.trim() || !street.trim() || !area.trim() || !city.trim() || !pin.trim()) {
      setError('Please fill in all address fields');
      return;
    }

    if (pin.trim().length !== 6 || isNaN(Number(pin))) {
      setError('Please enter a valid 6-digit PIN code');
      return;
    }

    if (editingId) {
      updateAddress(editingId, {
        label,
        name: name.trim(),
        street: street.trim(),
        area: area.trim(),
        city: city.trim(),
        state: state.trim(),
        pin: pin.trim(),
        isDefault,
      });
    } else {
      addAddress({
        label,
        name: name.trim(),
        street: street.trim(),
        area: area.trim(),
        city: city.trim(),
        state: state.trim(),
        pin: pin.trim(),
        isDefault,
      });
    }

    setModalVisible(false);
  };

  const handleDelete = (addr: Address) => {
    if (user.addresses.length === 1) {
      Alert.alert('Cannot Delete', 'You must have at least one delivery address.');
      return;
    }

    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete "${addr.label}" address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAddress(addr.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      <Header
        title="Delivery Addresses"
        subtitle={`${user.addresses.length} Saved Addresses`}
        rightAction={
          <Button
            title="+ Add"
            size="sm"
            onPress={openAddModal}
          />
        }
      />

      {user.addresses.length === 0 ? (
        <EmptyState
          icon="location-outline"
          title="No Addresses Saved"
          description="Add a delivery address to easily checkout your fresh grocery orders."
          actionTitle="Add New Address"
          onAction={openAddModal}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="p-4 flex-1">
          {/* Live Map Tracking Banner */}
          <TouchableOpacity
            onPress={() => router.push('/track-location')}
            className="bg-green-50 border border-green-200 rounded-2xl p-3.5 mb-4 flex-row items-center justify-between shadow-sm"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-green-600 items-center justify-center">
                <Ionicons name="map-outline" size={18} color="#ffffff" />
              </View>
              <View>
                <Text className="text-green-900 font-extrabold text-sm">View Live Map & GPS</Text>
                <Text className="text-green-700 text-xs">Track real-time location on OpenStreetMap</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#15803d" />
          </TouchableOpacity>

          {user.addresses.map((addr) => (
            <View
              key={addr.id}
              className={`bg-white rounded-3xl p-5 mb-4 border ${
                addr.isDefault ? 'border-green-600' : 'border-gray-100'
              } shadow-sm`}
            >
              {/* Top Row: Label badge & Default indicator */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <View className="bg-gray-100 px-3 py-1 rounded-full flex-row items-center gap-1.5">
                    <Ionicons
                      name={
                        addr.label === 'Home'
                          ? 'home-outline'
                          : addr.label === 'Work'
                          ? 'business-outline'
                          : 'location-outline'
                      }
                      size={14}
                      color="#374151"
                    />
                    <Text className="text-gray-800 font-extrabold text-xs">
                      {addr.label}
                    </Text>
                  </View>

                  {addr.isDefault ? (
                    <View className="bg-green-100 px-2.5 py-0.5 rounded-full">
                      <Text className="text-green-700 font-extrabold text-[10px]">
                        DEFAULT
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Edit & Delete Action Icons */}
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => openEditModal(addr)}
                    className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center border border-gray-100"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="create-outline" size={16} color="#15803d" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(addr)}
                    className="w-8 h-8 rounded-full bg-red-50 items-center justify-center border border-red-100"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Recipient & Address Details */}
              <Text className="text-gray-900 font-extrabold text-base mb-1">
                {addr.name}
              </Text>
              <Text className="text-gray-600 text-sm leading-5">
                {addr.street}, {addr.area}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">
                {addr.city}, {addr.state} – {addr.pin}
              </Text>

              {/* Set as Default Button if not default */}
              {!addr.isDefault ? (
                <View className="mt-4 pt-3 border-t border-gray-100 flex-row justify-end">
                  <TouchableOpacity
                    onPress={() => setDefaultAddress(addr.id)}
                    className="flex-row items-center gap-1.5 py-1 px-3 bg-gray-50 rounded-xl border border-gray-200"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color="#4b5563" />
                    <Text className="text-gray-700 text-xs font-bold">
                      Set as Default
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ))}

          <View className="mt-2 mb-16">
            <Button
              title="+ Add Another Address"
              variant="outline"
              size="lg"
              onPress={openAddModal}
            />
          </View>
        </ScrollView>
      )}

      {/* Add / Edit Address Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
            <Text className="text-gray-900 font-black text-xl">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1"
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20 }}
            >
              {/* Address Label Selector */}
              <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">
                Save Address As
              </Text>
              <View className="flex-row gap-3 mb-5">
                {LABELS.map((item) => {
                  const isSelected = label === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setLabel(item)}
                      className={`flex-1 py-3 rounded-2xl items-center border ${
                        isSelected
                          ? 'bg-green-600 border-green-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text
                        className={`text-sm font-extrabold ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Form Inputs */}
              <Input
                label="Full Name"
                placeholder="Receiver's name"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  setError('');
                }}
                leftIcon="person-outline"
              />

              <Input
                label="House / Flat / Street"
                placeholder="House no., building name, street"
                value={street}
                onChangeText={(t) => {
                  setStreet(t);
                  setError('');
                }}
                leftIcon="home-outline"
              />

              <Input
                label="Area / Landmark"
                placeholder="e.g. Near Metro Station, BTM Phase 1"
                value={area}
                onChangeText={(t) => {
                  setArea(t);
                  setError('');
                }}
                leftIcon="navigate-outline"
              />

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    label="City"
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="PIN Code"
                    placeholder="6 digits"
                    value={pin}
                    onChangeText={(t) => {
                      setPin(t);
                      setError('');
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>
              </View>

              <Input
                label="State"
                placeholder="State"
                value={state}
                onChangeText={setState}
              />

              {/* Default Address Checkbox */}
              <TouchableOpacity
                className="flex-row items-center mt-2 mb-6"
                onPress={() => setIsDefault(!isDefault)}
                activeOpacity={0.7}
              >
                <View
                  className={`w-5 h-5 rounded-md border items-center justify-center mr-3 ${
                    isDefault
                      ? 'border-green-600 bg-green-600'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isDefault && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text className="text-gray-700 text-sm font-semibold">
                  Make this my default delivery address
                </Text>
              </TouchableOpacity>

              {error ? (
                <Text className="text-red-500 text-xs font-semibold mb-4 ml-1">
                  {error}
                </Text>
              ) : null}

              {/* Action Buttons */}
              <View className="gap-3 mt-2 mb-10">
                <Button
                  title={editingId ? 'Update Address' : 'Save Address'}
                  size="lg"
                  onPress={handleSave}
                />
                <Button
                  title="Cancel"
                  variant="ghost"
                  size="md"
                  onPress={() => setModalVisible(false)}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
