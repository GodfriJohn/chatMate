import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Platform, 
  Modal, 
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Alert,
  Image,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

interface BottomNavigationProps {
  onNewChatPress?: () => void;
  onNewContactPress?: () => void;
  onNewCommunityPress?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  onNewChatPress, 
  onNewContactPress, 
  onNewCommunityPress 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [contactSlideAnim] = useState(new Animated.Value(screenHeight));
  const [qrScaleAnim] = useState(new Animated.Value(0));

  // User data for QR generation
  const userData = {
    name: 'John Doe',
    username: '@johndoe',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    // Generate QR code with user data
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      username: '@johndoe',
      app: 'eX-Chat'
    }))}&bgcolor=FFFFFF&color=000000&qzone=1&format=png`,
  };

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  // Helper function to generate avatar color
  const getAvatarColor = (name: string) => {
    const colors = [
      '#007AFF', '#FF9500', '#FF2D92', '#30D158', '#5856D6',
      '#FF6482', '#FF9F0A', '#32D74B', '#007AFF', '#5AC8FA'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Handle home button press
  const handleHomePress = () => {
    router.push('/dashboard');
  };

  // Handle profile button press
  const handleProfilePress = () => {
    router.push('/profile');
  };

  // Handle new chat button press - show modal
  const handleNewChatPress = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close main modal
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  // Show contact modal
  const showContactModal = () => {
    setContactModalVisible(true);
    Animated.timing(contactSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close contact modal
  const closeContactModal = () => {
    Animated.timing(contactSlideAnim, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setContactModalVisible(false);
    });
  };

  // Show QR modal
  const showQrModal = () => {
    setQrModalVisible(true);
    Animated.spring(qrScaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  // Close QR modal
  const closeQrModal = () => {
    Animated.timing(qrScaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setQrModalVisible(false);
    });
  };

  // Handle new chat navigation
  const handleNewChatNavigation = () => {
    closeModal();
    setTimeout(() => {
      router.push('/contacts');
    }, 100);
  };

  // Handle new contact navigation - show contact options modal
  const handleNewContactNavigation = () => {
    closeModal();
    setTimeout(() => {
      showContactModal();
    }, 300);
  };

  // Handle QR scan option - show QR modal
  const handleQRScan = () => {
    closeContactModal();
    setTimeout(() => {
      showQrModal();
    }, 300);
  };

  // Handle actual QR scanning
  const handleStartQRScan = () => {
  closeQrModal();
  setTimeout(() => {
    router.push('/qr-scanner'); // this loads your QR scanner screen
  }, 100);
};

  // Handle phone number entry - Open native contacts app directly
  const handlePhoneNumberEntry = async () => {
    closeContactModal();
    
    try {
      if (Platform.OS === 'ios') {
        // For iOS, try multiple contact app URLs
        const iosUrls = [
          'contacts://',           // Native Contacts app
          'addressbook://',        // Alternative contacts URL
        ];
        
        for (const url of iosUrls) {
          try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
              await Linking.openURL(url);
              return; // Exit if successful
            }
          } catch (error) {
            console.log(`Failed to open ${url}:`, error);
          }
        }
        
        // If contacts app fails, try Phone app
        try {
          await Linking.openURL('tel:');
        } catch (error) {
          console.log('Failed to open Phone app:', error);
        }
        
      } else if (Platform.OS === 'android') {
        // For Android, try multiple contact-related intents
        const androidUrls = [
          'content://contacts/people/',     // Direct contacts
          'content://com.android.contacts/contacts', // Alternative contacts
          'tel:',                          // Phone app (has contacts)
        ];
        
        for (const url of androidUrls) {
          try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
              await Linking.openURL(url);
              return; // Exit if successful
            }
          } catch (error) {
            console.log(`Failed to open ${url}:`, error);
          }
        }
      }
      
    } catch (error) {
      console.log('Error opening contacts app:', error);
      // Silently fail - no user notification
    }
  };

  // Handle new community navigation - Navigate to add-community page
  const handleNewCommunityNavigation = () => {
    closeModal();
    setTimeout(() => {
      router.push('/add-community');
    }, 100);
  };

  // Determine active tab based on current route
  const isHomeActive = pathname === '/dashboard' || pathname === '/dashboard/';
  const isProfileActive = pathname === '/profile' || pathname === '/profile/';

  return (
    <>
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={handleHomePress}
        >
          <Ionicons 
            name={isHomeActive ? "home" : "home-outline"} 
            size={24} 
            color={isHomeActive ? "#007AFF" : "#8E8E93"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.newChatButton}
          onPress={handleNewChatPress}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.newChatText}>New Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={handleProfilePress}
        >
          <Ionicons 
            name={isProfileActive ? "person" : "person-outline"} 
            size={24} 
            color={isProfileActive ? "#007AFF" : "#8E8E93"} 
          />
        </TouchableOpacity>
      </View>

      {/* Main New Chat Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.modalContent,
                  { transform: [{ translateY: slideAnim }] }
                ]}
              >
                <View style={styles.modalHandle} />
                
                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={handleNewChatNavigation}
                >
                  <View style={styles.modalOptionIcon}>
                    <Ionicons name="chatbubble-outline" size={24} color="#007AFF" />
                  </View>
                  <View style={styles.modalOptionContent}>
                    <Text style={styles.modalOptionTitle}>New Chat</Text>
                    <Text style={styles.modalOptionSubtitle}>Send a message to your contact</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={handleNewContactNavigation}
                >
                  <View style={styles.modalOptionIcon}>
                    <Ionicons name="person-add-outline" size={24} color="#007AFF" />
                  </View>
                  <View style={styles.modalOptionContent}>
                    <Text style={styles.modalOptionTitle}>New Contact</Text>
                    <Text style={styles.modalOptionSubtitle}>Add a contact to be able to send messages</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={handleNewCommunityNavigation}
                >
                  <View style={styles.modalOptionIcon}>
                    <Ionicons name="people-outline" size={24} color="#007AFF" />
                  </View>
                  <View style={styles.modalOptionContent}>
                    <Text style={styles.modalOptionTitle}>New Community</Text>
                    <Text style={styles.modalOptionSubtitle}>Create a group to chat with multiple people</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={closeModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* New Contact Options Modal */}
      <Modal
        visible={contactModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeContactModal}
      >
        <TouchableWithoutFeedback onPress={closeContactModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.contactModalContent,
                  { transform: [{ translateY: contactSlideAnim }] }
                ]}
              >
                <View style={styles.modalHandle} />
                
                <Text style={styles.contactModalTitle}>Add New Contact</Text>
                <Text style={styles.contactModalSubtitle}>Choose how you'd like to add a new contact</Text>
                
                <TouchableOpacity 
                  style={styles.contactModalOption}
                  onPress={handleQRScan}
                >
                  <View style={[styles.contactModalOptionIcon, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="qr-code-outline" size={28} color="#007AFF" />
                  </View>
                  <View style={styles.contactModalOptionContent}>
                    <Text style={styles.contactModalOptionTitle}>Connect with QR</Text>
                    <Text style={styles.contactModalOptionSubtitle}>Scan someone's QR code to add them</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.contactModalOption}
                  onPress={handlePhoneNumberEntry}
                >
                  <View style={[styles.contactModalOptionIcon, { backgroundColor: '#E8F5E8' }]}>
                    <Ionicons name="call-outline" size={28} color="#34C759" />
                  </View>
                  <View style={styles.contactModalOptionContent}>
                    <Text style={styles.contactModalOptionTitle}>Add Phone Number</Text>
                    <Text style={styles.contactModalOptionSubtitle}>Open native contacts app to add manually</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.contactCancelButton}
                  onPress={closeContactModal}
                >
                  <Text style={styles.contactCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* QR Scanner Modal - Centered */}
      <Modal
        visible={qrModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeQrModal}
      >
        <TouchableWithoutFeedback onPress={closeQrModal}>
          <View style={styles.qrModalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.qrModalContent,
                  { 
                    transform: [{ scale: qrScaleAnim }],
                    opacity: qrScaleAnim 
                  }
                ]}
              >
                {/* QR Code Display */}
                <View style={styles.qrDisplayContainer}>
                  <View style={styles.qrFrame}>
                    <Image 
                      source={{ uri: userData.qrCode }}
                      style={styles.qrCodeImage}
                      resizeMode="contain"
                      onError={() => console.log('QR Code loading failed')}
                    />
                  </View>
                  
                  {/* User Info */}
                  <View style={styles.qrUserInfo}>
                    <View style={[styles.qrAvatar, { backgroundColor: getAvatarColor(userData.name) }]}>
                      {userData.avatar ? (
                        <Image 
                          source={{ uri: userData.avatar }} 
                          style={styles.qrAvatarImage}
                        />
                      ) : (
                        <Text style={styles.qrAvatarText}>{getInitials(userData.name)}</Text>
                      )}
                    </View>
                    <Text style={styles.qrUserName}>{userData.name}</Text>
                    <Text style={styles.qrUserUsername}>{userData.username}</Text>
                  </View>
                  
                  <Text style={styles.qrTitle}>Share My Contact</Text>
                  <Text style={styles.qrSubtitle}>Show this QR code to others so they can add you</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.qrButtonContainer}>
                  <TouchableOpacity 
                    style={styles.qrScanButton}
                    onPress={handleStartQRScan}
                  >
                    <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.qrScanButtonText}>Scan QR</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.qrCancelButton}
                    onPress={closeQrModal}
                  >
                    <Text style={styles.qrCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    marginBottom: Platform.OS === 'ios' ? 10 : 8,
  },
  bottomNavItem: {
    padding: 12,
    borderRadius: 20,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  newChatText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: 0.3,
  },

  // Main Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 44 : 20,
    minHeight: 300,
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#C7C7CC',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  modalOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modalOptionContent: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  modalOptionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },

  // Contact Modal styles
  contactModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 44 : 20,
    minHeight: 280,
  },
  contactModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  contactModalSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  contactModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  contactModalOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactModalOptionContent: {
    flex: 1,
  },
  contactModalOptionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  contactModalOptionSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
  },
  contactCancelButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  contactCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  // QR Modal styles - Centered
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  qrModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  qrDisplayContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrFrame: {
    width: 180,
    height: 180,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeImage: {
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  qrUserInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  qrAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  qrAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  qrAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  qrUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  qrUserUsername: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  qrButtonContainer: {
    width: '100%',
    gap: 12,
  },
  qrScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  qrScanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  qrCancelButton: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  qrCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
});

export default BottomNavigation;