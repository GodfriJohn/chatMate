import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Switch,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../../src/api/firebase';
import { getUserProfile } from '../../src/db/userRepo';
import BottomNavigation from '../../components/BottomNavigation';

const ProfileScreen = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({
    username: '@unknown',
    displayName: 'Unknown User',
    phone: 'Not available',
    email: 'Not available',
    uid: 'unknown',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Listen for focus events to refresh data when returning from edit
  useEffect(() => {
    const unsubscribe = router.addListener?.('focus', () => {
      console.log('Profile screen focused, refreshing data...');
      loadUserProfile();
    });

    return unsubscribe;
  }, [router]);

  const loadUserProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("No authenticated user found");
        setDefaultUserData();
        setLoading(false);
        return;
      }

      console.log("Loading profile for user:", user.uid);
      const profile = await getUserProfile(user.uid);
      
      if (profile) {
        setUserData({
          username: `@${profile.username}`,
          displayName: profile.displayName || profile.username || 'Unknown User',
          phone: profile.phone || 'Not available',
          email: profile.email || 'Not available',
          uid: profile.uid,
        });
        console.log("Profile loaded successfully:", profile.username);
      } else {
        // Fallback to Firebase user data
        setUserData({
          username: `@user${user.uid.slice(-6)}`,
          displayName: user.displayName || `User ${user.uid.slice(-4)}`,
          phone: 'Not available',
          email: user.email || 'Not available',
          uid: user.uid,
        });
        console.log("Using fallback Firebase user data");
      }
      
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setDefaultUserData();
      setLoading(false);
      setRefreshing(false);
    }
  };

  const setDefaultUserData = () => {
    setUserData({
      username: '@unknown',
      displayName: 'Unknown User',
      phone: 'Not available',
      email: 'Not available',
      uid: 'unknown',
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserProfile();
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleSectionPress = (section: string) => {
    console.log('Section pressed:', section);
    switch (section) {
      case 'edit-profile':
        router.push('/edit-profile/');
        break;
      case 'privacy':
        router.push('/privacy-security/');
        break;
      case 'storage':
        router.push('/storage-data/');
        break;
      case 'language':
        router.push('/language/');
        break;
      case 'help':
        router.push('/help-support/');
        break;
      case 'about':
        router.push('/about/');
        break;
      case 'archived-chats':
        router.push('/archived-chats/');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    console.log('Logout pressed');
    // TODO: Add proper logout logic
    router.replace('/home');
  };

  const handleNewChatPress = () => {
    console.log('New chat pressed from profile');
  };

  const ProfileAvatar = () => {
    const initials = userData.displayName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
    
    const avatarColor = '#007AFF'; // You can make this dynamic based on user ID
    
    return (
      <View style={[styles.profileAvatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.profileAvatarText}>{initials}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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
          <View style={{ width: 24 }} /> {/* Empty placeholder for balance */}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <ProfileAvatar />
            <Text style={styles.userDisplayName}>{userData.displayName}</Text>
            <Text style={styles.userUsername}>{userData.username}</Text>
            
            <View style={styles.userInfoContainer}>
              <View style={styles.userInfoRow}>
                <Ionicons name="call-outline" size={16} color="#8E8E93" />
                <Text style={styles.userInfo}>{userData.phone}</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Ionicons name="mail-outline" size={16} color="#8E8E93" />
                <Text style={styles.userInfo}>{userData.email}</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Ionicons name="finger-print-outline" size={16} color="#8E8E93" />
                <Text style={styles.userInfo}>ID: {userData.uid.slice(-8)}</Text>
              </View>
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Account</Text>

            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('edit-profile')}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
                  <Ionicons name="person-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Edit Profile</Text>
                  <Text style={styles.settingSubtitle}>Update your personal information</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('privacy')}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                  <Ionicons name="shield-outline" size={20} color="#34C759" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Privacy & Security</Text>
                  <Text style={styles.settingSubtitle}>Control your privacy settings</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('storage')}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(255, 149, 0, 0.1)' }]}>
                  <Ionicons name="folder-outline" size={20} color="#FF9500" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Storage & Data</Text>
                  <Text style={styles.settingSubtitle}>Manage your storage usage</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('archived-chats')}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(142, 142, 147, 0.1)' }]}>
                  <Ionicons name="archive-outline" size={20} color="#8E8E93" />
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

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(255, 45, 146, 0.1)' }]}>
                  <Ionicons name="notifications-outline" size={20} color="#FF2D92" />
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
                ios_backgroundColor="#E5E5EA"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(88, 86, 214, 0.1)' }]}>
                  <Ionicons name="moon-outline" size={20} color="#5856D6" />
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
                ios_backgroundColor="#E5E5EA"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(90, 200, 250, 0.1)' }]}>
                  <Ionicons name="radio-outline" size={20} color="#5AC8FA" />
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
                ios_backgroundColor="#E5E5EA"
              />
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('language')}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(255, 204, 0, 0.1)' }]}>
                  <Ionicons name="globe-outline" size={20} color="#FFCC00" />
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

            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('help')}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(175, 82, 222, 0.1)' }]}>
                  <Ionicons name="help-circle-outline" size={20} color="#AF52DE" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Help & Support</Text>
                  <Text style={styles.settingSubtitle}>Get help and contact support</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => handleSectionPress('about')}>
              <View style={styles.settingItemLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(50, 215, 75, 0.1)' }]}>
                  <Ionicons name="information-circle-outline" size={20} color="#32D74B" />
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

          {/* Bottom spacing for navigation */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavigation onNewChatPress={handleNewChatPress} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
  },
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
    fontWeight: '500',
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
    borderRadius: 20 
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#1C1C1E' 
  },

  // Content
  scrollView: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
  },
  scrollContent: { 
    paddingBottom: 20 
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  profileAvatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userDisplayName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
    textAlign: 'center',
  },
  userUsername: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 20,
  },
  userInfoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    minWidth: '70%',
  },
  userInfo: {
    fontSize: 14,
    color: '#5A5A5A',
    marginLeft: 8,
    fontWeight: '500',
  },

  // Settings Section
  settingsSection: { 
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1C1C1E', 
    marginBottom: 4,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#F8F9FA',
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
    flex: 1 
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: { 
    flex: 1 
  },
  settingTitle: { 
    fontSize: 17, 
    color: '#1C1C1E', 
    fontWeight: '600', 
    marginBottom: 3, 
    lineHeight: 20 
  },
  settingSubtitle: { 
    fontSize: 14, 
    color: '#8E8E93', 
    lineHeight: 18,
    fontWeight: '400',
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#FF3B30', 
    marginLeft: 8 
  },

  // Bottom spacing
  bottomSpacing: {
    height: 20,
  },
});

export default ProfileScreen;