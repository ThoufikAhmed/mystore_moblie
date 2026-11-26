import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export interface LocationData {
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
  accuracy?: number | null;
}

interface LiveMapProps {
  onLocationUpdate?: (location: LocationData) => void;
  backendEndpoint?: string;
  updateIntervalMs?: number; // How often to send to backend (throttling)
  minDistanceMeters?: number; // GPS threshold
  markerTitle?: string;
  markerDescription?: string;
  height?: number | string;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  onLocationUpdate,
  backendEndpoint,
  updateIntervalMs = 4000,
  minDistanceMeters = 3,
  markerTitle = 'My Live Location',
  markerDescription = 'Updating in real-time',
  height = '100%',
}) => {
  const [coords, setCoords] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(true);
  const [statusText, setStatusText] = useState('Acquiring GPS fix...');
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  const webViewRef = useRef<WebView>(null);
  const lastBackendPush = useRef<number>(0);

  // Send coordinates to backend API
  const pushLocationToBackend = async (data: LocationData) => {
    if (!backendEndpoint) return;

    const now = Date.now();
    if (now - lastBackendPush.current < updateIntervalMs) {
      return; // throttled
    }
    lastBackendPush.current = now;

    try {
      /* Example backend call:
      await fetch(backendEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      */
      const timeStr = new Date(data.timestamp).toLocaleTimeString();
      setLastSyncedTime(timeStr);
      console.log('[LiveMap] Pushed to backend:', backendEndpoint, data);
    } catch (err) {
      console.warn('[LiveMap] Failed to push to backend:', err);
    }
  };

  // Start continuous GPS tracking with expo-location
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let isMounted = true;

    const startWatching = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setErrorMsg('Location permission is required to track live location.');
          }
          return;
        }

        if (isMounted) setStatusText('Locating you on map...');

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: minDistanceMeters,
          },
          (loc) => {
            if (!isMounted) return;

            const locData: LocationData = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              heading: loc.coords.heading,
              speed: loc.coords.speed,
              timestamp: loc.timestamp,
              accuracy: loc.coords.accuracy,
            };

            setCoords(locData);
            setStatusText('Live Tracking Active');

            // Send to parent callback
            onLocationUpdate?.(locData);

            // Send to backend API
            pushLocationToBackend(locData);

            // Update OpenStreetMap marker inside WebView
            updateMap(locData.latitude, locData.longitude);
          }
        );
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err.message || 'Error fetching location');
        }
      }
    };

    if (isTracking) {
      startWatching();
    }

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [isTracking]);

  const updateMap = (lat: number, lng: number) => {
    const js = `
      if (window.setLivePosition) {
        window.setLivePosition(${lat}, ${lng}, "${markerTitle}");
      }
      true;
    `;
    webViewRef.current?.injectJavaScript(js);
  };

  const centerCurrentLocation = () => {
    if (coords) {
      updateMap(coords.latitude, coords.longitude);
    }
  };

  // Leaflet + OpenStreetMap HTML template
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: #f1f5f9;
          }
          /* Custom pulse icon for live user marker */
          .user-marker-pulse {
            width: 22px;
            height: 22px;
            background: #16a34a;
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(22, 163, 74, 0.6);
            position: relative;
          }
          .user-marker-pulse::after {
            content: '';
            width: 44px;
            height: 44px;
            background: rgba(22, 163, 74, 0.3);
            border-radius: 50%;
            position: absolute;
            top: -14px;
            left: -14px;
            animation: pulse 2s infinite ease-out;
          }
          @keyframes pulse {
            0% { transform: scale(0.6); opacity: 1; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {
            zoomControl: false,
            attributionControl: false
          }).setView([12.9716, 77.5946], 15);

          // OpenStreetMap tile layer (Free, No API Key needed)
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          var userIcon = L.divIcon({
            className: 'user-marker-pulse',
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });

          var marker = null;

          window.setLivePosition = function(lat, lng, title) {
            if (!marker) {
              marker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
              if (title) marker.bindPopup('<b>' + title + '</b>').openPopup();
              map.setView([lat, lng], 16);
            } else {
              marker.setLatLng([lat, lng]);
              map.panTo([lat, lng], { animate: true, duration: 0.8 });
            }
          };
        </script>
      </body>
    </html>
  `;

  if (errorMsg) {
    return (
      <View style={[styles.errorContainer, { height: height as any }]}>
        <Ionicons name="alert-circle" size={36} color="#ef4444" />
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setErrorMsg(null);
            setIsTracking(false);
            setTimeout(() => setIsTracking(true), 200);
          }}
        >
          <Text style={styles.retryButtonText}>Retry Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height: height as any }]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: leafletHtml }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={() => {
          if (coords) updateMap(coords.latitude, coords.longitude);
        }}
      />

      {/* Floating Status Card */}
      <View style={styles.statusBadge}>
        <View style={styles.statusDot} />
        <View style={{ flex: 1 }}>
          <Text style={styles.statusTitle}>
            {coords ? 'OpenStreetMap Live' : 'Connecting GPS...'}
          </Text>
          <Text style={styles.statusSubtitle}>
            {coords
              ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
              : statusText}
          </Text>
          {lastSyncedTime && (
            <Text style={styles.syncTime}>Last pushed to API: {lastSyncedTime}</Text>
          )}
        </View>
        {!coords && <ActivityIndicator size="small" color="#16a34a" />}
      </View>

      {/* Recenter Button */}
      {coords && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={centerCurrentLocation}
          activeOpacity={0.8}
        >
          <Ionicons name="locate" size={20} color="#16a34a" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#e2e8f0',
    borderRadius: 20,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  statusBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexRow: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16a34a',
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  statusSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  syncTime: {
    fontSize: 10,
    color: '#16a34a',
    marginTop: 2,
    fontWeight: '600',
  },
  recenterButton: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  errorContainer: {
    width: '100%',
    backgroundColor: '#fef2f2',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
});

