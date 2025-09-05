import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../../src/api/firebase';
import { getUserProfile, updateUserProfile, saveUserProfile } from '../../src/db/userRepo';

const EditProfileScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [userData, setUserData] = useState({
    username: '',
    displayName: '',
    phone: '',
    email: '',
  });

  const [originalData, setOriginalData] = useState({
    username: '',
    displayName: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'No authenticated user found');
        router.back();
        return;
      }

      setCurrentUser(user);
      console.log("Loading profile for user:", user.uid);

      // Try to get profile from SQLite first
      let profile = await getUserProfile(user.uid);
      
      if (!profile) {
        // Create default profile if none exists
        const defaultProfile = {
          uid: user.uid,
          username: user.displayName || `user${user.uid.slice(-6)}`,
          displayName: user.displayName || '',
          phone: '',
          email: user.email || '',
          photoURL: user.photoURL || '',
        };

        await saveUserProfile(defaultProfile);
        profile = defaultProfile;
      }

      const profileData = {
        username: profile.username || '',
        displayName: profile.displayName || '',
        phone: profile.phone || '',
        email: profile.email || '',
      };

      setUserData(profileData);
      setOriginalData(profileData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      Alert.alert('Error', 'Failed to load profile information');
      setLoading(false);
    }
  };

  const validateInput = () => {
    if (!userData.username.trim()) {
      Alert.alert('Validation Error', 'Username is required');
      return false;
    }

    if (userData.username.length < 3) {
      Alert.alert('Validation Error', 'Username must be at least 3 characters long');
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      Alert.alert('Validation Error', 'Username can only contain letters, numbers, and underscores');
      return false;
    }

    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const hasChanges = () => {
    return (
      userData.username !== originalData.username ||
      userData.displayName !== originalData.displayName ||
      userData.phone !== originalData.phone ||
      userData.email !== originalData.email
    );
  };

  const handleSave = async () => {
    if (!validateInput()) return;
    if (!hasChanges()) {
      Alert.alert('No Changes', 'No changes detected to save');
      return;
    }

    setSaving(true);

    try {
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      console.log("Saving profile updates:", userData);

      // Update profile in SQLite
      await updateUserProfile(currentUser.uid, {
        username: userData.username.trim(),
        displayName: userData.displayName.trim() || null,
        phone: userData.phone.trim() || null,
        email: userData.email.trim() || null,
      });

      // Update the original data to reflect saved state
      setOriginalData({ ...userData });

      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
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
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity 
            style={[styles.saveButton, !hasChanges() && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={saving || !hasChanges()}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Text style={[styles.saveText, !hasChanges() && styles.saveTextDisabled]}>
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.formSection}>
            {/* Username */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Username *</Text>
              <View style={styles.usernameContainer}>
                <Text style={styles.usernamePrefix}>@</Text>
                <TextInput
                  style={styles.usernameInput}
                  value={userData.username}
                  onChangeText={(text) => setUserData({ ...userData, username: text })}
                  placeholder="username"
                  placeholderTextColor="#8E8E93"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={30}
                />
              </View>
              <Text style={styles.fieldHint}>
                Your username is how others will find you
              </Text>
            </View>

            {/* Display Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Display Name</Text>
              <TextInput
                style={styles.textInput}
                value={userData.displayName}
                onChangeText={(text) => setUserData({ ...userData, displayName: text })}
                placeholder="Enter your display name"
                placeholderTextColor="#8E8E93"
                maxLength={50}
              />
              <Text style={styles.fieldHint}>
                This is the name that will be shown in chats
              </Text>
            </View>

            {/* Phone */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={userData.phone}
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor="#8E8E93"
                keyboardType="phone-pad"
                maxLength={20}
              />
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={userData.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                placeholder="Enter your email address"
                placeholderTextColor="#8E8E93"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={100}
              />
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                * Required fields. Your username will be used to generate your QR code for others to add you.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
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
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#1C1C1E' },
  saveButton: { padding: 8 },
  saveButtonDisabled: { opacity: 0.5 },
  saveText: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
  saveTextDisabled: { color: '#8E8E93' },

  // Content
  scrollView: { flex: 1 },
  formSection: { padding: 20 },
  fieldContainer: { marginBottom: 24 },
  fieldLabel: { fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 },
  fieldHint: { fontSize: 12, color: '#8E8E93', marginTop: 4, lineHeight: 16 },

  // Text inputs
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    backgroundColor: '#F9F9F9',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
  },
  usernamePrefix: { fontSize: 16, color: '#8E8E93', marginRight: 4 },
  usernameInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#1C1C1E' },

  // Info section
  infoSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
});

export default EditProfileScreen;