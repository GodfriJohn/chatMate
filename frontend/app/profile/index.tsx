import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Modal,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

const ProfileScreen = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // User data
  const userData = {
    name: 'John Doe',
    username: '@johndoe',
    bio: 'Coffee enthusiast ☕ | Tech lover 💻',
    joinDate: 'Joined March 2024',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://ex-chat.app/user/johndoe',
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
      '#007AFF', '#007AFF', '#007AFF', '#007AFF', '#007AFF',
      '#007AFF', '#007AFF', '#007AFF', '#007AFF', '#007AFF'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    router.replace('/home');
  };

  const handleSectionPress = (section: string) => {
    console.log('Section pressed:', section);
    switch (section) {
      case 'edit-profile':
        router.push('../../edit-profile/');
        break;
      case 'privacy':
        router.push('../../privacy-security/');
        break;
      case 'storage':
        router.push('../../storage-data/');
        break;
      case 'language':
        router.push('../../language/');
        break;
      case 'help':
        router.push('../../help-support/');
        break;
      case 'about':
        router.push('../../about/');
        break;
      case 'archived-chats':
        router.push('../../archived-chats/');
        break;
      default:
        break;
    }
  };

  const handleQRScan = () => {
    Alert.alert(
      'QR Scanner',
      'Opening camera to scan QR code...',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Camera', onPress: () => console.log('Opening camera for QR scan') }
      ]
    );
  };

  const handleShowMyQR = () => {
    setShowQRModal(true);
  };

  const handleShareQR = () => {
    Alert.alert(
      'Share QR Code',
      'Choose how to share your QR code',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save to Photos', onPress: () => console.log('Saving QR to photos') },
        { text: 'Share', onPress: () => console.log('Sharing QR code') }
      ]
    );
  };

  const handleNewChatPress = () => {
    console.log('New chat pressed from profile');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => handleSectionPress('edit-profile')}>
            <Ionicons name="create-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: getAvatarColor(userData.name) }]}>
                {userData.avatar ? (
                  <Image 
                    source={{ uri: userData.avatar }} 
                    style={styles.avatarImage}
                    onError={() => console.log('Avatar image failed to load')}
                  />
                ) : (
                  <Text style={styles.avatarText}>{getInitials(userData.name)}</Text>
                )}
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#34C759' : '#8E8E93' }]} />
            </View>

            {/* User Info */}
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userUsername}>{userData.username}</Text>
            <Text style={styles.userBio}>{userData.bio}</Text>
            <Text style={styles.userPhone}>{userData.phone}</Text>
            <Text style={styles.joinDate}>{userData.joinDate}</Text>

            {/* QR Code Actions */}
            <View style={styles.qrActionsContainer}>
              <TouchableOpacity style={styles.qrActionButton} onPress={handleQRScan}>
                <View style={styles.qrActionIcon}>
                  <Ionicons name="qr-code-outline" size={24} color="#007AFF" />
                </View>
                <Text style={styles.qrActionTitle}>Scan QR</Text>
                <Text style={styles.qrActionSubtitle}>Add contact</Text>
              </TouchableOpacity>

              <View style={styles.qrActionDivider} />

              <TouchableOpacity style={styles.qrActionButton} onPress={handleShowMyQR}>
                <View style={styles.qrActionIcon}>
                  <Ionicons name="qr-code" size={24} color="#007AFF" />
                </View>
                <Text style={styles.qrActionTitle}>My QR</Text>
                <Text style={styles.qrActionSubtitle}>Share profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            {/* Edit Profile */}
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('edit-profile')}>
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="person-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Edit Profile</Text>
                  <Text style={styles.settingSubtitle}>Update your personal information</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            {/* Privacy & Security */}
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('privacy')}>
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="shield-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Privacy & Security</Text>
                  <Text style={styles.settingSubtitle}>Control your privacy settings</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            {/* Storage & Data */}
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('storage')}>
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="folder-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Storage & Data</Text>
                  <Text style={styles.settingSubtitle}>Manage your storage usage</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            {/* Archived Chats */}
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => handleSectionPress('archived-chats')}
            >
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="archive-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Archived Chats</Text>
                  <Text style={styles.settingSubtitle}>View your archived conversations</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Preferences Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            {/* Notifications */}
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="notifications-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingSubtitle}>Manage your notification preferences</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Dark Mode */}
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="moon-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingSubtitle}>Switch to dark appearance</Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Online Status */}
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="radio-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Online Status</Text>
                  <Text style={styles.settingSubtitle}>Show when you're online</Text>
                </View>
              </View>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Language */}
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('language')}>
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="globe-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Language</Text>
                  <Text style={styles.settingSubtitle}>English</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Support Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            {/* Help & Support */}
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('help')}>
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Help & Support</Text>
                  <Text style={styles.settingSubtitle}>Get help and contact support</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            {/* About */}
            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('about')}>
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>About ChatMate</Text>
                  <Text style={styles.settingSubtitle}>Version 1.0.0</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavigation onNewChatPress={handleNewChatPress} />
      </SafeAreaView>

      {/* My QR Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRModal}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.qrModalOverlay}>
          <View style={styles.qrModalContent}>
            {/* Header */}
            <View style={styles.qrModalHeader}>
              <TouchableOpacity onPress={() => setShowQRModal(false)}>
                <Ionicons name="close" size={24} color="#1C1C1E" />
              </TouchableOpacity>
              <Text style={styles.qrModalTitle}>My QR Code</Text>
              <TouchableOpacity onPress={handleShareQR}>
                <Ionicons name="share-outline" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>

            {/* QR Code Display */}
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCodeWrapper}>
                <Image 
                  source={{ uri: userData.qrCode }}
                  style={styles.qrCodeImage}
                  resizeMode="contain"
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

              {/* Instructions */}
              <Text style={styles.qrInstructions}>
                Show this QR code to friends so they can add you to their contacts
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="log-out-outline" size={48} color="#FF3B30" />
            </View>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalSubtitle}>Are you sure you want to logout?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={confirmLogout}
              >
                <Text style={styles.modalConfirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 20,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: 0.5,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
  },

  // Content
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 8,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
    textAlign: 'center',
  },
  userUsername: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  userBio: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  userPhone: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 12,
    color: '#3A3A3C',
    marginBottom: 24,
  },

  // QR Actions Container
  qrActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  qrActionButton: {
    alignItems: 'center',
    flex: 1,
  },
  qrActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  qrActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  qrActionSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  qrActionDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#D1D1D6',
    marginHorizontal: 20,
  },

  // Settings Section
  settingsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
    minHeight: 72,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    color: '#1C1C1E',
    fontWeight: '600',
    marginBottom: 2,
    lineHeight: 20,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    marginTop: 32,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },

  // QR Modal Styles
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  qrModalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  qrModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  qrCodeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  qrCodeWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  qrCodeImage: {
    width: 200,
    height: 200,
  },
  qrUserInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  qrAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  qrAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  qrUserName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  qrUserUsername: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  qrInstructions: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;