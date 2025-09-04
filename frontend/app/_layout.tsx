import React, { useEffect, useState, createContext } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ensureAnonLogin } from "../src/api/authService";
import { useColorScheme } from '@/hooks/useColorScheme';
import { View } from 'react-native';

// Context now only needs uid
export const AuthContext = createContext<{ uid: string | null }>({ uid: null });

// Custom themes
const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#111B21',
    card: '#111B21',
    text: '#FFFFFF',
    border: '#374151',
    notification: '#00A884',
    primary: '#00A884',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#111B21',
    card: '#1F2937',
    text: '#FFFFFF',
    border: '#374151',
    notification: '#00A884',
    primary: '#00A884',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const id = await ensureAnonLogin();
        console.log("✅ Firebase logged in as:", id);
        setUid(id);
      } catch (e) {
        console.error("Firebase Auth error:", e);
      }
    })();
  }, []);

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#111B21' }}>
        <StatusBar style="light" backgroundColor="#111B21" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ uid }}>
      <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#111B21' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#075E54' }} />
          <Stack.Screen name="splash" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#075E54' }} />
          <Stack.Screen name="home" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#111B21' }} />
          <Stack.Screen name="login" options={{ headerShown: false, statusBarStyle: 'light', statusBarBackgroundColor: '#111B21' }} />
          <Stack.Screen name="dashboard" options={{ title: 'Chats', headerStyle: { backgroundColor: '#111B21' }, headerTintColor: '#FFFFFF', headerTitleStyle: { fontWeight: 'bold' }, statusBarStyle: 'light', statusBarBackgroundColor: '#111B21' }} />
          <Stack.Screen name="chat/[id]" options={{ title: 'Chat', headerStyle: { backgroundColor: '#111B21' }, headerTintColor: '#FFFFFF', headerTitleStyle: { fontWeight: 'bold' }, statusBarStyle: 'light', statusBarBackgroundColor: '#111B21' }} />
        </Stack>
        <StatusBar style="light" backgroundColor="#111B21" translucent={false} />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
