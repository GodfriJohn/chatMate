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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BackupSettingsScreen = () => {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    includeMedia: true,
    includeVoiceMessages: true,
    includeDocuments: false,
    backupOnWiFiOnly: true,
    encryptBackup: true,
  });

  const [lastBackup] = useState('2024-01-15 14:30');
  const [backupSize] = useState('2.4 GB');

  const frequencyOptions = [
    { key: 'daily', label: 'Daily', description: 'Backup every day at 2 AM' },
    { key: 'weekly', label: 'Weekly', description: 'Backup every Sunday' },
    { key: 'monthly', label: 'Monthly', description: 'Backup on the 1st of each month' },
    { key: 'manual', label: 'Manual Only', description: 'Backup only when requested' },
  ];

  const handleFrequencyChange = (frequency: string) => {
    setSettings({ ...settings, backupFrequency: frequency });
  };

  const handleBackupNow = () => {
    Alert.alert(
      'Backup Now',
      'Start backup immediately? This may take a few minutes depending on your data size.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Backup', 
          onPress: () => {
            Alert.alert('Backup Started', 'Your data is being backed up. You\'ll receive a notification when it\'s complete.');
          }
        }
      ]
    );
  };

  const handleRestoreBackup = () => {
    Alert.alert(
      'Restore Backup',
      'This will replace your current chat history with data from your last backup. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Restore Started', 'Your backup is being restored. This may take a few minutes.');
          }
        }
      ]
    );
  };

  const handleDeleteBackup = () => {
    Alert.alert(
      'Delete Backup',
      'This will permanently delete all your backup data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Backup Deleted', 'Your backup data has been permanently deleted.');
          }
        }
      ]
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
          <Text style={styles.headerTitle}>Backup Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Backup Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Backup Status</Text>
            
            <View style={styles.statusCard}>
              <View style={styles.statusBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={styles.statusBadgeText}>Active</Text>
              </View>
              
              <View style={styles.statusMain}>
                <View style={styles.statusIconContainer}>
                  <Ionicons name="cloud-done" size={40} color="#34C759" />
                </View>
                <View style={styles.statusDetails}>
                  <Text style={styles.statusMainTitle}>Your chats are backed up</Text>
                  <Text style={styles.statusMainSubtitle}>
                    All your messages and media are safely stored in the cloud
                  </Text>
                </View>
              </View>
              
              <View style={styles.statusInfo}>
                <View style={styles.statusInfoItem}>
                  <View style={styles.statusInfoIcon}>
                    <Ionicons name="time-outline" size={16} color="#8E8E93" />
                  </View>
                  <View style={styles.statusInfoText}>
                    <Text style={styles.statusInfoLabel}>Last Backup</Text>
                    <Text style={styles.statusInfoValue}>{lastBackup}</Text>
                  </View>
                </View>
                
                <View style={styles.statusInfoItem}>
                  <View style={styles.statusInfoIcon}>
                    <Ionicons name="folder-outline" size={16} color="#8E8E93" />
                  </View>
                  <View style={styles.statusInfoText}>
                    <Text style={styles.statusInfoLabel}>Backup Size</Text>
                    <Text style={styles.statusInfoValue}>{backupSize}</Text>
                  </View>
                </View>
                
                <View style={styles.statusInfoItem}>
                  <View style={styles.statusInfoIcon}>
                    <Ionicons name="sync-outline" size={16} color="#8E8E93" />
                  </View>
                  <View style={styles.statusInfoText}>
                    <Text style={styles.statusInfoLabel}>Frequency</Text>
                    <Text style={styles.statusInfoValue}>
                      {settings.backupFrequency === 'daily' ? 'Daily' : 
                       settings.backupFrequency === 'weekly' ? 'Weekly' : 
                       settings.backupFrequency === 'monthly' ? 'Monthly' : 'Manual'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.primaryActionButton} onPress={handleBackupNow}>
                <View style={styles.actionButtonIcon}>
                  <Ionicons name="cloud-upload" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.actionButtonContent}>
                  <Text style={styles.actionButtonTitle}>Backup Now</Text>
                  <Text style={styles.actionButtonSubtitle}>Start immediate backup</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryActionButton} onPress={handleRestoreBackup}>
                <View style={styles.actionButtonIcon}>
                  <Ionicons name="cloud-download" size={24} color="#007AFF" />
                </View>
                <View style={styles.actionButtonContent}>
                  <Text style={styles.secondaryActionButtonTitle}>Restore Backup</Text>
                  <Text style={styles.secondaryActionButtonSubtitle}>Restore from cloud</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Auto Backup Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Automatic Backup</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Auto Backup</Text>
                <Text style={styles.settingSubtitle}>Automatically backup your chats</Text>
              </View>
              <Switch
                value={settings.autoBackup}
                onValueChange={(value) => setSettings({...settings, autoBackup: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {settings.autoBackup && (
              <View style={styles.frequencySection}>
                <Text style={styles.frequencyTitle}>Backup Frequency</Text>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={styles.frequencyOption}
                    onPress={() => handleFrequencyChange(option.key)}
                  >
                    <View style={styles.frequencyInfo}>
                      <Text style={styles.frequencyLabel}>{option.label}</Text>
                      <Text style={styles.frequencyDescription}>{option.description}</Text>
                    </View>
                    <View style={[
                      styles.radioButton,
                      settings.backupFrequency === option.key && styles.radioButtonSelected
                    ]}>
                      {settings.backupFrequency === option.key && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Backup Content */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What to Backup</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Include Media</Text>
                <Text style={styles.settingSubtitle}>Backup photos and videos</Text>
              </View>
              <Switch
                value={settings.includeMedia}
                onValueChange={(value) => setSettings({...settings, includeMedia: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Include Voice Messages</Text>
                <Text style={styles.settingSubtitle}>Backup audio messages</Text>
              </View>
              <Switch
                value={settings.includeVoiceMessages}
                onValueChange={(value) => setSettings({...settings, includeVoiceMessages: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Include Documents</Text>
                <Text style={styles.settingSubtitle}>Backup shared files and documents</Text>
              </View>
              <Switch
                value={settings.includeDocuments}
                onValueChange={(value) => setSettings({...settings, includeDocuments: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Backup Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Backup Options</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Wi-Fi Only</Text>
                <Text style={styles.settingSubtitle}>Only backup when connected to Wi-Fi</Text>
              </View>
              <Switch
                value={settings.backupOnWiFiOnly}
                onValueChange={(value) => setSettings({...settings, backupOnWiFiOnly: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Encrypt Backup</Text>
                <Text style={styles.settingSubtitle}>Protect your backup with encryption</Text>
              </View>
              <Switch
                value={settings.encryptBackup}
                onValueChange={(value) => setSettings({...settings, encryptBackup: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Storage Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage Information</Text>
            
            <View style={styles.storageCard}>
              <View style={styles.storageItem}>
                <Text style={styles.storageLabel}>Cloud Storage Used</Text>
                <Text style={styles.storageValue}>2.4 GB / 15 GB</Text>
              </View>
              
              <View style={styles.storageBar}>
                <View style={[styles.storageProgress, { width: '16%' }]} />
              </View>
              
              <View style={styles.storageBreakdown}>
                <View style={styles.storageBreakdownItem}>
                  <Text style={styles.storageBreakdownLabel}>Chat Messages</Text>
                  <Text style={styles.storageBreakdownValue}>150 MB</Text>
                </View>
                <View style={styles.storageBreakdownItem}>
                  <Text style={styles.storageBreakdownLabel}>Media Files</Text>
                  <Text style={styles.storageBreakdownValue}>2.1 GB</Text>
                </View>
                <View style={styles.storageBreakdownItem}>
                  <Text style={styles.storageBreakdownLabel}>Documents</Text>
                  <Text style={styles.storageBreakdownValue}>150 MB</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            
            <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteBackup}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={styles.dangerButtonText}>Delete All Backup Data</Text>
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
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 6,
  },
  statusMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statusDetails: {
    flex: 1,
  },
  statusMainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statusMainSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
  },
  statusInfo: {
    gap: 12,
  },
  statusInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  statusInfoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusInfoText: {
    flex: 1,
  },
  statusInfoLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  statusInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 4,
  },
  actionButtonsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryActionButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 2,
  },
  secondaryActionButtonSubtitle: {
    fontSize: 14,
    color: '#007AFF',
    opacity: 0.8,
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
  frequencySection: {
    marginTop: 16,
  },
  frequencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 8,
  },
  frequencyInfo: {
    flex: 1,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  frequencyDescription: {
    fontSize: 14,
    color: '#8E8E93',
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
  storageCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  storageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  storageValue: {
    fontSize: 16,
    color: '#8E8E93',
  },
  storageBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  storageProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  storageBreakdown: {
    gap: 8,
  },
  storageBreakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storageBreakdownLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  storageBreakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
    marginBottom: 24,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
});

export default BackupSettingsScreen;