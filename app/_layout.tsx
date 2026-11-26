import '../src/global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartProvider, AuthProvider, WishlistProvider } from '../src/context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="cart" options={{ presentation: 'card' }} />
            <Stack.Screen name="orders" options={{ presentation: 'card' }} />
            <Stack.Screen name="search" options={{ presentation: 'card' }} />
            <Stack.Screen name="wishlist" options={{ presentation: 'card' }} />
            <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
            <Stack.Screen name="help" options={{ presentation: 'card' }} />
            <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="checkout" options={{ presentation: 'card' }} />
            <Stack.Screen name="order-success" options={{ presentation: 'card', gestureEnabled: false }} />
            <Stack.Screen name="return" options={{ presentation: 'card' }} />
            <Stack.Screen name="order-details/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="category/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="addresses" options={{ presentation: 'card' }} />
            <Stack.Screen name="track-location" options={{ presentation: 'card' }} />
          </Stack>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
