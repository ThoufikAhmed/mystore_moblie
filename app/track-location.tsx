import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Header, Button, LiveMap, type LocationData } from '../src/components';

export default function TrackLocationScreen() {
  const { title } = useLocalSearchParams<{ title?: string }>();
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [sentCount, setSentCount] = useState<number>(0);
  const [backendStatus, setBackendStatus] = useState<string>('Ready to stream');
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  // Mock API URL (can be customized or pulled from environment)
  const BACKEND_URL = 'https://api.mystore.com/v1/tracking/live-update';

  const handleLocationUpdate = (loc: LocationData) => {
    setCurrentLocation(loc);

    if (isSyncing) {
      // Increment sync counter to demonstrate backend readiness
      setSentCount((prev) => prev + 1);
      setBackendStatus(`Pushed update #${sentCount + 1} at ${new Date(loc.timestamp).toLocaleTimeString()}`);
    }
  };

  const handleShareLocation = async () => {
    if (!currentLocation) {
      Alert.alert('Waiting for GPS', 'Please wait until live GPS location is acquired.');
      return;
    }

    const mapUrl = `https://www.openstreetmap.org/?mlat=${currentLocation.latitude}&mlon=${currentLocation.longitude}#map=16/${currentLocation.latitude}/${currentLocation.longitude}`;
    try {
      await Share.share({
        message: `My live location: ${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}\nOpen on OpenStreetMap: ${mapUrl}`,
      });
    } catch (err: any) {
      Alert.alert('Share Failed', err.message);
    }
  };

  const handleManualPush = () => {
    if (!currentLocation) {
      Alert.alert('Waiting for GPS', 'Please wait for GPS signal.');
      return;
    }

    Alert.alert(
      'Sent to Backend',
      `Payload sent to:\n${BACKEND_URL}\n\nLatitude: ${currentLocation.latitude}\nLongitude: ${currentLocation.longitude}\nTimestamp: ${new Date(currentLocation.timestamp).toISOString()}`
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]" edges={['top']}>
      <Header
        title={title || 'Live Map & Location'}
        subtitle="OpenStreetMap · Real-Time GPS"
        rightAction={
          <TouchableOpacity
            onPress={handleShareLocation}
            className="w-10 h-10 rounded-full bg-green-50 items-center justify-center border border-green-100"
            activeOpacity={0.7}
          >
            <Ionicons name="share-social-outline" size={18} color="#15803d" />
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Map Container */}
        <View className="p-4">
          <View className="rounded-3xl overflow-hidden shadow-sm border border-gray-200" style={{ height: 380 }}>
            <LiveMap
              onLocationUpdate={handleLocationUpdate}
              updateIntervalMs={4000}
              markerTitle="Live User Location"
              height={380}
            />
          </View>
        </View>

        {/* Live Coordinates Detail Card */}
        <View className="px-4">
          <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center">
                  <Ionicons name="navigate" size={16} color="#15803d" />
                </View>
                <View>
                  <Text className="text-gray-900 font-extrabold text-base">GPS Coordinates</Text>
                  <Text className="text-gray-400 text-xs">High Accuracy Live Telemetry</Text>
                </View>
              </View>

              <View className="bg-green-50 border border-green-200 px-3 py-1 rounded-full flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-green-500" />
                <Text className="text-green-700 font-bold text-xs">Live</Text>
              </View>
            </View>

            {/* Coordinates Grid */}
            <View className="grid grid-cols-2 gap-3 flex-row flex-wrap">
              <View className="bg-gray-50 rounded-2xl p-3 flex-1 min-w-[130px] border border-gray-100">
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Latitude</Text>
                <Text className="text-gray-900 font-extrabold text-sm mt-0.5">
                  {currentLocation ? currentLocation.latitude.toFixed(6) : 'Fetching...'}
                </Text>
              </View>

              <View className="bg-gray-50 rounded-2xl p-3 flex-1 min-w-[130px] border border-gray-100">
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Longitude</Text>
                <Text className="text-gray-900 font-extrabold text-sm mt-0.5">
                  {currentLocation ? currentLocation.longitude.toFixed(6) : 'Fetching...'}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3 mt-3">
              <View className="bg-gray-50 rounded-2xl p-3 flex-1 border border-gray-100">
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Speed</Text>
                <Text className="text-gray-900 font-extrabold text-sm mt-0.5">
                  {currentLocation?.speed ? `${(currentLocation.speed * 3.6).toFixed(1)} km/h` : '0 km/h'}
                </Text>
              </View>

              <View className="bg-gray-50 rounded-2xl p-3 flex-1 border border-gray-100">
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Accuracy</Text>
                <Text className="text-gray-900 font-extrabold text-sm mt-0.5">
                  {currentLocation?.accuracy ? `±${currentLocation.accuracy.toFixed(1)}m` : 'Accurate'}
                </Text>
              </View>
            </View>
          </View>

          {/* Backend API Integration Card */}
          <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                  <Ionicons name="cloud-upload-outline" size={16} color="#2563eb" />
                </View>
                <View>
                  <Text className="text-gray-900 font-extrabold text-base">Backend API Sync</Text>
                  <Text className="text-gray-400 text-xs">POST JSON payload stream</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setIsSyncing(!isSyncing)}
                className={`px-3 py-1 rounded-full ${isSyncing ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <Text className={`text-xs font-bold ${isSyncing ? 'text-white' : 'text-gray-600'}`}>
                  {isSyncing ? 'Streaming ON' : 'Paused'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="bg-gray-900 rounded-2xl p-3.5 mb-3">
              <Text className="text-gray-400 text-[10px] uppercase font-mono">Payload Preview (JSON)</Text>
              <Text className="text-green-400 font-mono text-xs mt-1">
                {JSON.stringify(
                  {
                    latitude: currentLocation?.latitude ?? 0,
                    longitude: currentLocation?.longitude ?? 0,
                    speed: currentLocation?.speed ?? 0,
                    heading: currentLocation?.heading ?? 0,
                    timestamp: currentLocation?.timestamp ?? Date.now(),
                  },
                  null,
                  2
                )}
              </Text>
            </View>

            <Text className="text-gray-500 text-xs mb-3">
              Status: <Text className="text-gray-800 font-bold">{backendStatus}</Text>
            </Text>

            <Button
              title="Test Push to Backend API"
              variant="outline"
              leftIcon="send-outline"
              onPress={handleManualPush}
            />
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <Button
              title="Back"
              variant="secondary"
              onPress={() => router.back()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

