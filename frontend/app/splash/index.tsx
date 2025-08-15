import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Splash() {
  const router = useRouter();
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(50)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const backgroundScale = useRef(new Animated.Value(1.2)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create pulse animation for logo
    const createPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Main animation sequence
    const startAnimations = () => {
      // Background zoom in
      Animated.timing(backgroundScale, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();

      // Logo animations
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(logoScale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Start pulse after logo appears
          createPulse();
        });
      }, 300);

      // Title animation
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(titleTranslateY, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      }, 800);

      // Subtitle animation
      setTimeout(() => {
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 1200);
    };

    startAnimations();

    // Navigate after 3.5 seconds
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Status bar matching home page */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#111B21" 
        translucent={true}
        hidden={false}
      />
      {/* Animated background overlay */}
      <Animated.View
        style={[
          styles.backgroundOverlay,
          {
            transform: [{ scale: backgroundScale }],
          },
        ]}
      />
      
      {/* Main content */}
      <View style={styles.content}>
        {/* Logo with animations */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { scale: Animated.multiply(logoScale, pulseValue) }
              ],
            },
          ]}
        >
          <Image
            source={{ uri: 'https://img.icons8.com/color/96/000000/chat--v1.png' }}
            style={styles.logo}
          />
          {/* Glow effect with teal accent */}
          <View style={styles.logoGlow} />
        </Animated.View>

        {/* Title with slide up animation */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <Text style={styles.title}>ChatMate</Text>
        </Animated.View>

        {/* Subtitle with fade in */}
        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              opacity: subtitleOpacity,
            },
          ]}
        >
          <Text style={styles.subtitle}>Connect. Chat. Repeat.</Text>
          <View style={styles.underline} />
        </Animated.View>
      </View>

      {/* Floating particles effect */}
      <View style={styles.particlesContainer}>
        {[...Array(6)].map((_, index) => (
          <FloatingParticle key={index} delay={index * 200} />
        ))}
      </View>
    </View>
  );
}

// Floating particle component
const FloatingParticle = ({ delay }: { delay: number }) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateParticle = () => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.4,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, delay);
    };

    animateParticle();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: Math.random() * width,
          opacity: opacity,
          transform: [{ translateY: translateY }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111B21', // Changed to match home page dark background
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    backgroundColor: 'rgba(17, 27, 33, 0.3)', // Updated to match new background with transparency
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: 'rgba(0, 168, 132, 0.2)', // Changed to teal accent with transparency
    borderRadius: 70,
    zIndex: -1,
  },
  titleContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF', // Changed to pure white to match home page
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Darker shadow for better contrast
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E8F', // Changed to match home page secondary text color
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: 8,
  },
  underline: {
    width: 60,
    height: 2,
    backgroundColor: '#00A884', // Changed to teal accent color
    borderRadius: 1,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(0, 168, 132, 0.6)', // Changed to teal accent particles
    borderRadius: 2,
  },
});