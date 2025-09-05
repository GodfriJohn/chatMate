import QRCode from 'react-native-qrcode-svg';
import { auth } from '../../src/api/firebase';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Mock contacts data
const mockContacts = [
  {
    id: '1',
    name: 'Alice Johnson',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    lastSeen: 'online',
  },
  {
    id: '2',
    name: 'Bob Smith',
    phone: '+1 (555) 987-6543',
    avatar: null,
    status: 'offline',
    lastSeen: '2 hours ago',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    lastSeen: 'online',
  },
  {
    id: '4',
    name: 'Diana Prince',
    phone: '+1 (555) 321-0987',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
    lastSeen: '1 day ago',
  },
  {
    id: '5',
    name: 'Edward Wilson',
    phone: '+1 (555) 654-3210',
    avatar: null,
    status: 'online',
    lastSeen: 'online',
  },
  {
    id: '6',
    name: 'Fiona Davis',
    phone: '+1 (555) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
    lastSeen: '30 minutes ago',
  },
  {
    id: '7',
    name: 'George Miller',
    phone: '+1 (555) 890-1234',
    avatar: null,
    status: 'online',
    lastSeen: 'online',
  },
  {
    id: '8',
    name: 'Hannah Taylor',
    phone: '+1 (555) 012-3456',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
    lastSeen: '5 hours ago',
  },
];

const ContactsScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [contactScaleAnim] = useState(new Animated.Value(0));
  const [qrScaleAnim] = useState(new Animated.Value(0));

  // User data for QR generation
  const userData = {
    name: 'John Doe',
    username: '@johndoe',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    
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
      '#FF6482', '#FF9F0A', '#32D74B', '#007AFF', '#5AC8FA',
      '#FFCC00', '#FF3B30', '#34C759', '#AF52DE', '#FF9500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockContacts;
    }
    
    return mockContacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
    );
  }, [searchQuery]);

  // Group contacts alphabetically
  const groupedContacts = useMemo(() => {
    const groups: { [key: string]: typeof mockContacts } = {};
    
    filteredContacts.forEach(contact => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
    });

    // Sort each group
    Object.keys(groups).forEach(letter => {
      groups[letter].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [filteredContacts]);

  const handleBackPress = () => {
    router.back();
  };

  const handleContactPress = (contact: typeof mockContacts[0]) => {
    // Navigate to chat with this contact
    router.push({
      pathname: '/chat',
      params: {
        contactId: contact.id,
        contactName: contact.name,
        contactAvatar: contact.avatar || '',
        contactStatus: contact.status,
      }
    });
  };

  // Show contact options modal
  const handleAddContact = () => {
    setContactModalVisible(true);
    Animated.spring(contactScaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  // Close contact modal
  const closeContactModal = () => {
    Animated.timing(contactScaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setContactModalVisible(false);
    });
  };

  // Show QR modal
  const showQrModal = () => {
    closeContactModal();
    setTimeout(() => {
      setQrModalVisible(true);
      Animated.spring(qrScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 300);
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

  // Handle QR scan option
  const handleQRScan = () => {
    showQrModal();
  };

  // Handle actual QR scanning
  const handleStartQRScan = async () => {
    closeQrModal();
    
    try {
      // Request camera permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      if (status === 'granted') {
        // Navigate to QR scanner screen
        router.push('/qr-scanner');
      } else {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to scan QR codes.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => Linking.openSettings()
            }
          ]
        );
      }
    } catch (error) {
      console.log('Error requesting camera permission:', error);
      Alert.alert('Error', 'Failed to access camera. Please try again.');
    }
  };

  // Handle phone number entry - Open native contacts app directly
  const handlePhoneNumberEntry = async () => {
    closeContactModal();
    
    try {
      if (Platform.OS === 'ios') {
        const iosUrls = [
          'contacts://',
          'addressbook://',
        ];
        
        for (const url of iosUrls) {
          try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
              await Linking.openURL(url);
              return;
            }
          } catch (error) {
            console.log(`Failed to open ${url}:`, error);
          }
        }
        
        try {
          await Linking.openURL('tel:');
        } catch (error) {
          console.log('Failed to open Phone app:', error);
        }
        
      } else if (Platform.OS === 'android') {
        const androidUrls = [
          'content://contacts/people/',
          'content://com.android.contacts/contacts',
          'tel:',
        ];
        
        for (const url of androidUrls) {
          try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
              await Linking.openURL(url);
              return;
            }
          } catch (error) {
            console.log(`Failed to open ${url}:`, error);
          }
        }
      }
      
    } catch (error) {
      console.log('Error opening contacts app:', error);
    }
  };

  const renderContactItem = ({ item }: { item: typeof mockContacts[0] }) => (
    <TouchableOpacity 
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.contactAvatar}>
        {item.avatar ? (
          <Image 
            source={{ uri: item.avatar }} 
            style={styles.avatarImage}
            onError={() => console.log('Avatar loading failed')}
          />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: getAvatarColor(item.name) }]}>
            <Text style={styles.avatarInitials}>{getInitials(item.name)}</Text>
          </View>
        )}
        {item.status === 'online' && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactStatus}>
          {item.status === 'online' ? 'Online' : `Last seen ${item.lastSeen}`}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.messageButton}>
        <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSectionHeader = (letter: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{letter}</Text>
    </View>
  );

  const renderGroupedContacts = () => {
    const sections = Object.keys(groupedContacts).sort();
    
    return sections.map(letter => (
      <View key={letter}>
        {renderSectionHeader(letter)}
        {groupedContacts[letter].map(contact => (
          <View key={contact.id}>
            {renderContactItem({ item: contact })}
          </View>
        ))}
      </View>
    ));
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Contact</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
              <Ionicons name="person-add-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search contacts..."
                placeholderTextColor="#8E8E93"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#8E8E93" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Contacts List */}
          <View style={styles.contactsContainer}>
            {filteredContacts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color="#C7C7CC" />
                <Text style={styles.emptyStateTitle}>
                  {searchQuery ? 'No contacts found' : 'No contacts yet'}
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  {searchQuery 
                    ? 'Try searching with a different name or phone number'
                    : 'Add contacts to start chatting with friends'
                  }
                </Text>
                {!searchQuery && (
                  <TouchableOpacity style={styles.addContactButton} onPress={handleAddContact}>
                    <Text style={styles.addContactButtonText}>Add Contact</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <FlatList
                data={[{ id: 'grouped' }]}
                keyExtractor={(item) => item.id}
                renderItem={() => <View>{renderGroupedContacts()}</View>}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        </SafeAreaView>
      </View>

      {/* Add Contact Options Modal */}
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
                  { 
                    transform: [{ scale: contactScaleAnim }],
                    opacity: contactScaleAnim 
                  }
                ]}
              >
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
                    <QRCode
  value={JSON.stringify({ uid: auth.currentUser?.uid })}
  size={160}
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
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  addButton: {
    padding: 8,
    borderRadius: 20,
  },

  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 8,
    marginRight: 8,
  },

  // Contacts
  contactsContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  contactAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#30D158',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: 14,
    color: '#8E8E93',
  },
  messageButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  addContactButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addContactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  contactModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
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
    width: '100%',
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
    width: '100%',
  },
  contactCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  // QR Modal styles
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

export default ContactsScreen;