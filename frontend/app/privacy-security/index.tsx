import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PrivacySecurityScreen = () => {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    lastSeen: true,
    profilePhoto: 'everyone',
    about: 'everyone',
    phoneNumber: 'contacts',
    readReceipts: true,
    onlineStatus: true,
    twoStepVerification: false,
    screenLock: false,
    fingerprintLock: true,
    backupMessages: true,
  });

  const privacyOptions = [
    { key: 'everyone', label: 'Everyone' },
    { key: 'contacts', label: 'My Contacts' },
    { key: 'nobody', label: 'Nobody' },
  ];

  const handlePrivacyChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  const renderPrivacySelector = (field: string, title: string, subtitle: string) => {
    return (
      <View style={styles.privacySection}>
        <Text style={styles.privacyTitle}>{title}</Text>
        <Text style={styles.privacySubtitle}>{subtitle}</Text>
        {privacyOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={styles.privacyOption}
            onPress={() => handlePrivacyChange(field, option.key)}
          >
            <Text style={styles.privacyOptionText}>{option.label}</Text>
            <View style={[
              styles.radioButton,
              settings[field as keyof typeof settings] === option.key && styles.radioButtonSelected
            ]}>
              {settings[field as keyof typeof settings] === option.key && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Privacy Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who can see my personal info</Text>
            
            {renderPrivacySelector('profilePhoto', 'Profile Photo', 'Who can see your profile photo')}
            {renderPrivacySelector('about', 'About', 'Who can see your about info')}
            {renderPrivacySelector('phoneNumber', 'Phone Number', 'Who can see your phone number')}
          </View>

          {/* Activity Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Last Seen</Text>
                <Text style={styles.settingSubtitle}>Show when you were last seen</Text>
              </View>
              <Switch
                value={settings.lastSeen}
                onValueChange={(value) => setSettings({...settings, lastSeen: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Read Receipts</Text>
                <Text style={styles.settingSubtitle}>Show blue checkmarks when messages are read</Text>
              </View>
              <Switch
                value={settings.readReceipts}
                onValueChange={(value) => setSettings({...settings, readReceipts: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Online Status</Text>
                <Text style={styles.settingSubtitle}>Show when you're online</Text>
              </View>
              <Switch
                value={settings.onlineStatus}
                onValueChange={(value) => setSettings({...settings, onlineStatus: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Security Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('../../two-step-verification/')}
            >
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Two-Step Verification</Text>
                <Text style={styles.settingSubtitle}>
                  {settings.twoStepVerification ? 'Enabled' : 'Add extra security to your account'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Screen Lock</Text>
                <Text style={styles.settingSubtitle}>Require authentication to open app</Text>
              </View>
              <Switch
                value={settings.screenLock}
                onValueChange={(value) => setSettings({...settings, screenLock: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Fingerprint Lock</Text>
                <Text style={styles.settingSubtitle}>Use fingerprint to unlock app</Text>
              </View>
              <Switch
                value={settings.fingerprintLock}
                onValueChange={(value) => setSettings({...settings, fingerprintLock: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('../../blocked-contacts/')}
            >
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Blocked Contacts</Text>
                <Text style={styles.settingSubtitle}>Manage blocked contacts</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Backup */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Backup</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Chat Backup</Text>
                <Text style={styles.settingSubtitle}>Automatically backup your chats</Text>
              </View>
              <Switch
                value={settings.backupMessages}
                onValueChange={(value) => setSettings({...settings, backupMessages: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('../../backup-settings/')}
            >
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Backup Settings</Text>
                <Text style={styles.settingSubtitle}>Configure backup frequency and storage</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  settingItemLeft: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  privacySection: {
    marginBottom: 24,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  privacySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 8,
  },
  privacyOptionText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});

export default PrivacySecurityScreen;