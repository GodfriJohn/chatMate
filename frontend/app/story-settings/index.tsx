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

const StorySettingsScreen = () => {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    allowReplies: true,
    showViewers: true,
    autoSave: false,
    highQuality: true,
    whoCanView: 'contacts',
    whoCanReply: 'contacts',
    hideStoryFrom: [] as string[],
  });

  const privacyOptions = [
    { key: 'everyone', label: 'Everyone', description: 'All users can see your stories' },
    { key: 'contacts', label: 'My Contacts', description: 'Only your contacts can see your stories' },
    { key: 'selected', label: 'Selected Contacts', description: 'Choose specific contacts' },
  ];

  const handlePrivacyChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value });
    if (value === 'selected') {
      // Navigate to contact selection
      console.log('Navigate to contact selection');
    }
  };

  const handleHideStoryFrom = () => {
    // Navigate to contact selection for hiding
    Alert.alert(
      'Hide Story From',
      'Select contacts to hide your stories from',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Select Contacts', onPress: () => console.log('Select contacts to hide from') }
      ]
    );
  };

  const handleStoryArchive = () => {
    router.push('../../story-archive/');
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
            <View style={styles.privacyOptionContent}>
              <Text style={styles.privacyOptionText}>{option.label}</Text>
              <Text style={styles.privacyOptionDescription}>{option.description}</Text>
            </View>
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
          <Text style={styles.headerTitle}>Story Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Privacy Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy</Text>
            
            {renderPrivacySelector('whoCanView', 'Who can see my story', 'Choose who can view your stories')}
            {renderPrivacySelector('whoCanReply', 'Who can reply to my story', 'Choose who can reply to your stories')}

            <TouchableOpacity style={styles.settingItem} onPress={handleHideStoryFrom}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Hide Story From</Text>
                <Text style={styles.settingSubtitle}>
                  {settings.hideStoryFrom.length > 0 
                    ? `${settings.hideStoryFrom.length} contact(s) selected`
                    : 'Select contacts to hide your story from'
                  }
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Interaction Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interactions</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Allow Replies</Text>
                <Text style={styles.settingSubtitle}>Let people reply to your stories</Text>
              </View>
              <Switch
                value={settings.allowReplies}
                onValueChange={(value) => setSettings({...settings, allowReplies: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Show Viewers</Text>
                <Text style={styles.settingSubtitle}>See who viewed your stories</Text>
              </View>
              <Switch
                value={settings.showViewers}
                onValueChange={(value) => setSettings({...settings, showViewers: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Quality & Storage */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quality & Storage</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>High Quality Upload</Text>
                <Text style={styles.settingSubtitle}>Upload stories in better quality (uses more data)</Text>
              </View>
              <Switch
                value={settings.highQuality}
                onValueChange={(value) => setSettings({...settings, highQuality: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Auto-Save to Gallery</Text>
                <Text style={styles.settingSubtitle}>Automatically save your stories to device gallery</Text>
              </View>
              <Switch
                value={settings.autoSave}
                onValueChange={(value) => setSettings({...settings, autoSave: value})}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Archive & History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Archive & History</Text>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleStoryArchive}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Story Archive</Text>
                <Text style={styles.settingSubtitle}>View your old stories and highlights</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingTitle}>Download All Stories</Text>
                <Text style={styles.settingSubtitle}>Download all your stories to device</Text>
              </View>
              <Ionicons name="download-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Help Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>About Story Privacy</Text>
                <Text style={styles.infoText}>
                  Your stories are visible for 24 hours and can be viewed by contacts based on your privacy settings. You can always see who viewed your stories.
                </Text>
              </View>
            </View>
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
  privacyOptionContent: {
    flex: 1,
  },
  privacyOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  privacyOptionDescription: {
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
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 18,
  },
});

export default StorySettingsScreen;