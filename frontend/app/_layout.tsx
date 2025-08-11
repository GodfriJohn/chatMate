import React, { useEffect, useState, createContext } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { supabase } from '../lib/supabase';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, View } from 'react-native';

export const AuthContext = createContext<{
  user: any | null;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
} | null>(null);

// Custom themes with proper dark backgrounds to eliminate white bars
const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#111B21', // Dark background for all screens
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
    background: '#111B21', // Consistent dark background
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

  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!loaded) {
    // Show dark loading screen instead of null
    return (
      <View style={{ flex: 1, backgroundColor: '#111B21' }}>
        <StatusBar style="light" backgroundColor="#111B21" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#111B21' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              statusBarStyle: 'light',
              statusBarBackgroundColor: '#075E54',
            }} 
          />
          <Stack.Screen 
            name="splash" 
            options={{ 
              headerShown: false,
              statusBarStyle: 'light',
              statusBarBackgroundColor: '#075E54',
            }} 
          />
          <Stack.Screen 
            name="home" 
            options={{ 
              headerShown: false,
              statusBarStyle: 'light',
              statusBarBackgroundColor: '#111B21',
            }} 
          />
          <Stack.Screen 
            name="login" 
            options={{ 
              headerShown: false,
              statusBarStyle: 'light',
              statusBarBackgroundColor: '#111B21',
            }} 
          />
          <Stack.Screen 
            name="dashboard" 
            options={{ 
              title: 'Chats',
              headerStyle: {
                backgroundColor: '#111B21',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              statusBarStyle: 'light',
              statusBarBackgroundColor: '#111B21',
            }} 
          />
          <Stack.Screen 
            name="chat/[id]" 
            options={{ 
              title: 'Chat',
              headerStyle: {
                backgroundColor: '#111B21',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              statusBarStyle: 'light',
              statusBarBackgroundColor: '#111B21',
            }} 
          />
        </Stack>
        {/* Global status bar configuration */}
        <StatusBar style="light" backgroundColor="#111B21" translucent={false} />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}