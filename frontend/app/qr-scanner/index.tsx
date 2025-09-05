import React, { useState, useEffect, useRef, useCallback } from 'react';
import { auth } from '../../src/api/firebase';
import { createOrGetChat } from '../../src/api/chatService';
import { parseQrPayload } from '../../src/utils/qr';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Vibration,
  Animated,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const QRScannerScreen = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  
  // Animation and scan management
  const scanLineAnimation = useRef(new Animated.Value(0)).current;
  const processedQRCodes = useRef(new Set<string>());
  const lastScanTime = useRef(0);
  const scanCooldown = 3000; // 3 seconds between scans

  useEffect(() => {
    initializeCamera();
    startScanLineAnimation();
    
    return () => {
      stopScanLineAnimation();
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
    }
  };

  const startScanLineAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scanLineAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const stopScanLineAnimation = () => {
    scanLineAnimation.stopAnimation();
  };

  const handleBarCodeScanned = useCallback(async ({ data }: { data: string }) => {
    const currentTime = Date.now();
    
    // Prevent multiple scans within cooldown period
    if (!isScanning || isProcessing || (currentTime - lastScanTime.current < scanCooldown)) {
      return;
    }

    // Check if this QR code was already processed
    if (processedQRCodes.current.has(data)) {
      showTemporaryMessage('QR code already processed');
      return;
    }

    console.log('QR Code detected:', data);
    
    // Stop scanning and start processing
    setIsScanning(false);
    setIsProcessing(true);
    setScanResult(data);
    lastScanTime.current = currentTime;
    processedQRCodes.current.add(data);
    
    // Provide haptic feedback
    Vibration.vibrate(100);
    
    try {
      await processQRCode(data);
    } catch (error) {
      console.error('QR processing error:', error);
      handleQRError(error);
    } finally {
      setIsProcessing(false);
    }
  }, [isScanning, isProcessing]);

  const processQRCode = async (qrData: string) => {
    // Parse the QR code data
    const parsed = parseQrPayload(qrData);
console.log("Decoded QR payload:", parsed);

    // Get current user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    // Validate user is not scanning their own QR
    if (parsed.uid === currentUser.uid) {
      throw new Error('Cannot add yourself as contact');
    }

    console.log('Creating chat between users:', currentUser.uid, 'and', parsed.uid);
    
    // Create or get existing chat with user info
    const chatId = await createOrGetChat(
      parsed.uid, 
      parsed.username, 
      parsed.name
    );
    console.log('Chat created/retrieved:', chatId);

    // Show success and navigate
    const displayName = parsed.name || parsed.username || `User ${parsed.uid.slice(-4)}`;
    showSuccessDialog(chatId, displayName);
  };

  const handleQRError = (error: any) => {
    let title = 'Scan Failed';
    let message = 'Unable to process QR code';
    
    const errorMsg = error?.message || '';
    
    if (errorMsg.includes('Authentication required')) {
      title = 'Login Required';
      message = 'Please log in to add contacts';
    } else if (errorMsg.includes('add yourself')) {
      title = 'Invalid QR Code';
      message = 'You cannot add yourself as a contact';
    } else if (errorMsg.includes('Invalid QR')) {
      title = 'Invalid QR Code';
      message = 'This QR code is not compatible with this app';
    } else if (errorMsg.includes('malformed JSON')) {
      title = 'Corrupted QR Code';
      message = 'The QR code appears to be damaged';
    } else if (errorMsg.includes('unsupported version')) {
      title = 'Incompatible Version';
      message = 'This QR code is from an incompatible app version';
    }

    Alert.alert(title, message, [
      {
        text: 'Try Again',
        onPress: () => resetScanner(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => router.back(),
      },
    ]);
  };

  const showSuccessDialog = (chatId: string, displayName: string) => {
    Alert.alert(
      'Contact Added Successfully!',
      `You can now chat with ${displayName}`,
      [
        {
          text: 'Start Chatting',
          onPress: () => {
            router.replace({
              pathname: '/chat/[id]',
              params: { 
                id: chatId,
                chatName: displayName,
              },
            });
          },
        },
        {
          text: 'Later',
          style: 'cancel',
          onPress: () => router.replace('/dashboard'),
        },
      ]
    );
  };

  const showTemporaryMessage = (message: string) => {
    Alert.alert('Notice', message, [
      { text: 'OK', onPress: () => resetScanner() }
    ]);
  };

  const resetScanner = () => {
    setIsScanning(true);
    setIsProcessing(false);
    setScanResult(null);
    // Allow re-scanning after reset
    processedQRCodes.current.clear();
  };

  const handleBackPress = () => {
    console.log('Exiting QR scanner');
    router.back();
  };

  // Permission states
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <Ionicons name="camera-outline" size={64} color="#666" />
            <Text style={styles.permissionText}>Requesting camera access...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <Ionicons name="camera-off-outline" size={64} color="#FF3B30" />
            <Text style={styles.permissionText}>Camera access denied</Text>
            <Text style={styles.permissionSubtext}>
              Please enable camera permission in your device settings to scan QR codes
            </Text>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={resetScanner}
            disabled={isProcessing}
          >
            <Ionicons 
              name="refresh" 
              size={24} 
              color={isProcessing ? "#666" : "#FFFFFF"} 
            />
          </TouchableOpacity>
        </View>

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
          />

          {/* Scanner Overlay */}
          <View style={styles.overlay}>
            {/* Top overlay */}
            <View style={styles.overlaySection} />

            {/* Middle section with scanning frame */}
            <View style={styles.scanningSection}>
              <View style={styles.overlaySection} />
              
              <View style={styles.scanningFrame}>
                {/* Corner markers */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                
                {/* Animated scan line */}
                {isScanning && !isProcessing && (
                  <Animated.View
                    style={[
                      styles.scanLine,
                      {
                        top: scanLineAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, 240],
                        }),
                      },
                    ]}
                  />
                )}
                
                {/* Processing indicator */}
                {isProcessing && (
                  <View style={styles.processingOverlay}>
                    <Ionicons name="checkmark-circle" size={64} color="#34C759" />
                    <Text style={styles.processingText}>Processing QR Code...</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.overlaySection} />
            </View>

            {/* Bottom overlay with instructions */}
            <View style={[styles.overlaySection, styles.instructionArea]}>
              <Text style={styles.instructionText}>
                {isProcessing 
                  ? 'Processing QR code...'
                  : isScanning 
                    ? 'Position the QR code within the frame'
                    : 'QR code detected!'
                }
              </Text>
              
              {scanResult && !isProcessing && (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={resetScanner}
                >
                  <Ionicons name="refresh" size={20} color="#FFFFFF" />
                  <Text style={styles.retryButtonText}>Scan Again</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 24,
    fontWeight: '600',
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 32,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    minWidth: 44,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Camera
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },

  // Overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlaySection: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanningSection: {
    flexDirection: 'row',
    height: 280,
  },
  scanningFrame: {
    width: 280,
    height: 280,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  instructionArea: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  // Scanning elements
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  topLeft: { 
    top: 0, 
    left: 0, 
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: { 
    top: 0, 
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: { 
    bottom: 0, 
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: { 
    bottom: 0, 
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  
  scanLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: '#00FF00',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  // Processing
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },

  // Instructions
  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default QRScannerScreen;