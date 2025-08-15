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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const StorageDataScreen = () => {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    downloadPhotos: 'wifi',
    downloadVideos: 'wifi',
    downloadAudio: 'wifi',
    downloadDocuments: 'never',
    imageCompression: true,
    deleteMediaAfter: '1year',
    autoDownloadPhotos: false,
    autoDownloadVideos: false,
    autoDownloadAudio: false,
    autoDownloadDocuments: false,
    downloadOnWiFiOnly: false,
    compressImages: false,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const storageData = {
    totalUsed: '2.4 GB',
    photos: '1.2 GB',
    videos: '800 MB',
    audio: '300 MB',
    documents: '100 MB',
    cache: '50 MB',
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear temporary files and may improve app performance. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => console.log('Cache cleared') }
      ]
    );
  };

  const handleManageStorage = () => {
    Alert.alert(
      'Manage Storage',
      'Choose what to delete',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Old Photos', onPress: () => console.log('Delete old photos') },
        { text: 'Old Videos', onPress: () => console.log('Delete old videos') },
        { text: 'All Media', style: 'destructive', onPress: () => console.log('Delete all media') }
      ]
    );
  };

  const handleDeleteMediaAfter = () => {
    setShowDeleteModal(true);
  };

  const deleteOptions = [
    { key: '3months', label: '3 Months', description: 'Delete media after 3 months' },
    { key: '6months', label: '6 Months', description: 'Delete media after 6 months' },
    { key: '1year', label: '1 Year', description: 'Delete media after 1 year' },
    { key: 'never', label: 'Never', description: 'Keep all media files' },
  ];

  const handleSelectDeleteOption = (option: string) => {
    setSettings({...settings, deleteMediaAfter: option});
    setShowDeleteModal(false);
  };

  const DeleteMediaModal = () => (
    <Modal
      visible={showDeleteModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowDeleteModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Delete Media After</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowDeleteModal(false)}
            >
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalDescription}>
            Choose when to automatically delete media files from your device
          </Text>

          <View style={styles.modalOptions}>
            {deleteOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={styles.modalOption}
                onPress={() => handleSelectDeleteOption(option.key)}
              >
                <View style={styles.modalOptionContent}>
                  <Text style={styles.modalOptionLabel}>{option.label}</Text>
                  <Text style={styles.modalOptionDescription}>{option.description}</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  settings.deleteMediaAfter === option.key && styles.radioButtonSelected
                ]}>
                  {settings.deleteMediaAfter === option.key && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Storage & Data</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Storage Usage */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage Usage</Text>
            
            <View style={styles.storageOverview}>
              <View style={styles.storageHeader}>
                <Text style={styles.totalUsage}>Total Used: {storageData.totalUsed}</Text>
                <TouchableOpacity onPress={handleManageStorage}>
                  <Text style={styles.manageLink}>Manage</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.storageBar}>
                <View style={[styles.storageSegment, { flex: 5, backgroundColor: '#007AFF' }]} />
                <View style={[styles.storageSegment, { flex: 3, backgroundColor: '#34C759' }]} />
                <View style={[styles.storageSegment, { flex: 1.5, backgroundColor: '#FF9500' }]} />
                <View style={[styles.storageSegment, { flex: 0.5, backgroundColor: '#FF3B30' }]} />
              </View>
              
              <View style={styles.storageBreakdown}>
                <View style={styles.storageItem}>
                  <View style={[styles.storageColor, { backgroundColor: '#007AFF' }]} />
                  <Text style={styles.storageLabel}>Photos</Text>
                  <Text style={styles.storageValue}>{storageData.photos}</Text>
                </View>
                <View style={styles.storageItem}>
                  <View style={[styles.storageColor, { backgroundColor: '#34C759' }]} />
                  <Text style={styles.storageLabel}>Videos</Text>
                  <Text style={styles.storageValue}>{storageData.videos}</Text>
                </View>
                <View style={styles.storageItem}>
                  <View style={[styles.storageColor, { backgroundColor: '#FF9500' }]} />
                  <Text style={styles.storageLabel}>Audio</Text>
                  <Text style={styles.storageValue}>{storageData.audio}</Text>
                </View>
                <View style={styles.storageItem}>
                  <View style={[styles.storageColor, { backgroundColor: '#FF3B30' }]} />
                  <Text style={styles.storageLabel}>Documents</Text>
                  <Text style={styles.storageValue}>{storageData.documents}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Clear Cache</Text>
                <Text style={styles.settingSubtitle}>Free up {storageData.cache} of temporary files</Text>
              </View>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          {/* Auto-Download Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Auto-Download Media</Text>
            <Text style={styles.sectionSubtitle}>Choose which media types to download automatically</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Photos</Text>
                <Text style={styles.settingSubtitle}>Automatically download photos</Text>
              </View>
              <Switch
                value={settings.autoDownloadPhotos}
                onValueChange={(value) => setSettings({...settings, autoDownloadPhotos: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Videos</Text>
                <Text style={styles.settingSubtitle}>Automatically download videos</Text>
              </View>
              <Switch
                value={settings.autoDownloadVideos}
                onValueChange={(value) => setSettings({...settings, autoDownloadVideos: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Audio</Text>
                <Text style={styles.settingSubtitle}>Automatically download voice messages</Text>
              </View>
              <Switch
                value={settings.autoDownloadAudio}
                onValueChange={(value) => setSettings({...settings, autoDownloadAudio: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Documents</Text>
                <Text style={styles.settingSubtitle}>Automatically download documents</Text>
              </View>
              <Switch
                value={settings.autoDownloadDocuments}
                onValueChange={(value) => setSettings({...settings, autoDownloadDocuments: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Data Usage Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Usage</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Download on Wi-Fi Only</Text>
                <Text style={styles.settingSubtitle}>Use Wi-Fi for auto-downloads to save mobile data</Text>
              </View>
              <Switch
                value={settings.downloadOnWiFiOnly}
                onValueChange={(value) => setSettings({...settings, downloadOnWiFiOnly: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Compress Images</Text>
                <Text style={styles.settingSubtitle}>Reduce image size to save data</Text>
              </View>
              <Switch
                value={settings.compressImages}
                onValueChange={(value) => setSettings({...settings, compressImages: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Data Usage</Text>
                <Text style={styles.settingSubtitle}>View detailed data usage statistics</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Cleanup Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Automatic Cleanup</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleDeleteMediaAfter}
            >
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Delete Media After</Text>
                <Text style={styles.settingSubtitle}>
                  {settings.deleteMediaAfter === '3months' ? '3 Months' :
                   settings.deleteMediaAfter === '6months' ? '6 Months' : 
                   settings.deleteMediaAfter === '1year' ? '1 Year' : 
                   settings.deleteMediaAfter === 'never' ? 'Never' : '1 Year'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('../../backup-settings/')}
            >
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Backup Settings</Text>
                <Text style={styles.settingSubtitle}>Configure automatic backups</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <DeleteMediaModal />
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
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 18,
  },
  storageOverview: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalUsage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  manageLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  storageBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5EA',
    marginBottom: 16,
    overflow: 'hidden',
  },
  storageSegment: {
    height: '100%',
  },
  storageBreakdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  storageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  storageColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  storageLabel: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  storageValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
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
  managementCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  managementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
    lineHeight: 18,
  },
  modalOptions: {
    gap: 12,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  modalOptionContent: {
    flex: 1,
  },
  modalOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  modalOptionDescription: {
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
});

export default StorageDataScreen;