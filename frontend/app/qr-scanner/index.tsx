import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../../src/api/firebase';
import { createOrGetChat } from '../../src/api/chatService';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const QRScannerScreen = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const processedQRCodes = useRef(new Set<string>());
  const lastScanTime = useRef(0);

  useEffect(() => {
    console.log("📷 QRScannerScreen: Component mounted");
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("📷 Camera permission status:", status);
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    const currentTime = Date.now();
    
    // Prevent processing if already processing or scanned recently (within 2 seconds)
    if (isProcessing || scanned || (currentTime - lastScanTime.current < 2000)) {
      console.log("⏸️ Scan ignored - already processing or too recent");
      return;
    }

    // Check if this QR code was already processed in this session
    if (processedQRCodes.current.has(data)) {
      console.log("⏸️ QR code already processed in this session");
      return;
    }

    console.log("🔍 QR Code Scanned!");
    console.log("📄 Raw QR data:", data);
    
    // Immediately set processing state to prevent multiple scans
    setIsProcessing(true);
    setScanned(true);
    lastScanTime.current = currentTime;
    processedQRCodes.current.add(data);
    
    try {
      // Parse the QR code data
      const parsed = JSON.parse(data);
      console.log("✅ Parsed QR data:", parsed);

      // Validate the QR code structure
      if (!parsed.uid) {
        console.error("❌ QR code missing 'uid' field");
        throw new Error('Invalid QR format: missing uid');
      }

      // Get current user
      const currentUser = auth.currentUser;
      console.log("👤 Current user:", currentUser?.uid);

      if (!currentUser) {
        console.error("❌ No authenticated user");
        throw new Error('Not logged in');
      }

      if (parsed.uid === currentUser.uid) {
        console.warn("⚠️ User tried to scan their own QR code");
        throw new Error('You cannot add yourself as a contact');
      }

      console.log("💬 Creating chat between:", currentUser.uid, "and", parsed.uid);
      
      // Create or get existing chat
      const chatId = await createOrGetChat(parsed.uid);
      console.log("✅ Chat created/found with ID:", chatId);

      // Show success message
      const userName = parsed.name || `User ${parsed.uid.slice(-4)}`;
      Alert.alert(
        "Contact Added Successfully!",
        `You can now chat with ${userName}`,
        [
          {
            text: "Start Chatting",
            onPress: () => {
              console.log("➡️ Navigating to chat:", chatId);
              router.replace({
                pathname: "/chat/[id]",
                params: { 
                  id: chatId,
                  chatName: userName,
                },
              });
            },
          },
          {
            text: "Later",
            style: "cancel",
            onPress: () => {
              console.log("📱 User chose to go back to dashboard");
              router.replace("/dashboard");
            },
          },
        ]
      );

    } catch (error: any) {
      console.error("❌ QR Scan error:", error);
      
      // Show user-friendly error message
      let errorMessage = 'Invalid QR code';
      if (error.message.includes('Not logged in')) {
        errorMessage = 'Please log in first';
      } else if (error.message.includes('add yourself')) {
        errorMessage = 'You cannot add yourself as a contact';
      } else if (error.message.includes('Invalid QR format')) {
        errorMessage = 'This QR code is not from this app';
      }

      Alert.alert(
        'Scan Failed',
        errorMessage,
        [
          {
            text: "Try Again",
            onPress: () => {
              console.log("🔄 User chose to try scanning again");
              resetScanState();
            },
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              console.log("❌ User cancelled scanning");
              router.back();
            },
          },
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanState = () => {
    setScanned(false);
    setIsProcessing(false);
    // Don't clear processedQRCodes to prevent re-scanning the same code
    // processedQRCodes.current.clear(); // Only clear this if you want to allow re-scanning
  };

  const handleBackPress = () => {
    console.log("🔙 Back button pressed from QR scanner");
    router.back();
  };

  if (hasPermission === null) {
    console.log("⏳ Waiting for camera permission...");
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    console.log("❌ Camera permission denied");
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log("📷 Rendering camera view");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={handleBackPress}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <View style={styles.headerRight} />
        </View>

        {/* QR Scanner */}
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={(scanned || isProcessing) ? undefined : handleBarCodeScanned}
          />

          {/* Overlay */}
          <View style={styles.overlay}>
            <View style={styles.overlayTop} />

            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              <View style={styles.scanningFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                
                {/* Processing indicator */}
                {isProcessing && (
                  <View style={styles.processingOverlay}>
                    <Text style={styles.processingText}>Processing...</Text>
                  </View>
                )}
              </View>
              <View style={styles.overlaySide} />
            </View>

            <View style={styles.overlayBottom}>
              <Text style={styles.instructionText}>
                {isProcessing 
                  ? "Processing QR code..." 
                  : scanned 
                    ? "QR code scanned successfully!"
                    : "Position the QR code within the frame"
                }
              </Text>
              {(scanned && !isProcessing) && (
                <TouchableOpacity
                  style={styles.scanAgainButton}
                  onPress={() => {
                    console.log("🔄 Scan again button pressed");
                    resetScanState();
                  }}
                >
                  <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
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
  permissionText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 100,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
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
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  headerBackButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 44,
  },

  // Scanner
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
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 250,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanningFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  // Processing overlay
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 123, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Corners
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  topRight: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },

  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  scanAgainButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QRScannerScreen;