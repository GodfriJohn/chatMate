import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DeleteMediaAfterScreen = () => {
  const router = useRouter();
  
  const [selectedOption, setSelectedOption] = useState('1year');

  const deleteOptions = [
    { 
      key: '3months', 
      label: '3 Months', 
      description: 'Media files will be automatically deleted after 3 months',
      storageInfo: 'Saves the most storage space'
    },
    { 
      key: '6months', 
      label: '6 Months', 
      description: 'Media files will be automatically deleted after 6 months',
      storageInfo: 'Balanced storage management'
    },
    { 
      key: '1year', 
      label: '1 Year', 
      description: 'Media files will be automatically deleted after 1 year',
      storageInfo: 'Recommended for most users'
    },
    { 
      key: 'never', 
      label: 'Never', 
      description: 'Media files will never be automatically deleted',
      storageInfo: 'Uses the most storage space'
    },
  ];

  const handleSave = () => {
    const selectedLabel = deleteOptions.find(option => option.key === selectedOption)?.label;
    Alert.alert(
      'Settings Saved',
      `Media files will be deleted after: ${selectedLabel}`,
      [{ text: 'OK', onPress: () => router.back() }]
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
          <Text style={styles.headerTitle}>Delete Media After</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Automatic Media Cleanup</Text>
            <Text style={styles.sectionDescription}>
              Choose when to automatically delete media files from your device to free up storage space. This only affects local storage - your media will still be available in chat backups.
            </Text>

            <View style={styles.optionsContainer}>
              {deleteOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionItem,
                    selectedOption === option.key && styles.selectedOptionItem
                  ]}
                  onPress={() => setSelectedOption(option.key)}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionHeader}>
                      <Text style={[
                        styles.optionLabel,
                        selectedOption === option.key && styles.selectedOptionLabel
                      ]}>
                        {option.label}
                      </Text>
                      <View style={[
                        styles.radioButton,
                        selectedOption === option.key && styles.radioButtonSelected
                      ]}>
                        {selectedOption === option.key && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    </View>
                    
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                    
                    <View style={styles.storageInfo}>
                      <Ionicons 
                        name={
                          option.key === '3months' ? 'leaf-outline' :
                          option.key === '6months' ? 'scale-outline' :
                          option.key === '1year' ? 'checkmark-circle-outline' :
                          'infinite-outline'
                        } 
                        size={16} 
                        color={
                          option.key === '3months' ? '#34C759' :
                          option.key === '6months' ? '#FF9500' :
                          option.key === '1year' ? '#007AFF' :
                          '#8E8E93'
                        } 
                      />
                      <Text style={[
                        styles.storageInfoText,
                        { color: 
                          option.key === '3months' ? '#34C759' :
                          option.key === '6months' ? '#FF9500' :
                          option.key === '1year' ? '#007AFF' :
                          '#8E8E93'
                        }
                      ]}>
                        {option.storageInfo}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Information Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                <Text style={styles.infoTitle}>Important Information</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoText}>
                  • Only media files on your device will be deleted
                </Text>
                <Text style={styles.infoText}>
                  • Your chat backups will still contain all media
                </Text>
                <Text style={styles.infoText}>
                  • You can always re-download media from backups
                </Text>
                <Text style={styles.infoText}>
                  • This helps keep your device storage optimized
                </Text>
              </View>
            </View>

            {/* Storage Impact */}
            <View style={styles.impactCard}>
              <Text style={styles.impactTitle}>Storage Impact</Text>
              <View style={styles.impactContent}>
                {selectedOption === '3months' && (
                  <Text style={styles.impactText}>
                    🟢 <Text style={styles.impactBold}>High storage savings</Text> - Media older than 3 months will be removed regularly
                  </Text>
                )}
                {selectedOption === '6months' && (
                  <Text style={styles.impactText}>
                    🟡 <Text style={styles.impactBold}>Moderate storage savings</Text> - Media older than 6 months will be removed
                  </Text>
                )}
                {selectedOption === '1year' && (
                  <Text style={styles.impactText}>
                    🔵 <Text style={styles.impactBold}>Balanced approach</Text> - Media older than 1 year will be removed
                  </Text>
                )}
                {selectedOption === 'never' && (
                  <Text style={styles.impactText}>
                    ⚪ <Text style={styles.impactBold}>No automatic cleanup</Text> - All media will be kept indefinitely
                  </Text>
                )}
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
  saveButton: {
    padding: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
    marginBottom: 32,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOptionItem: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  selectedOptionLabel: {
    color: '#007AFF',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  optionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
    marginBottom: 8,
  },
  storageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageInfoText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  infoContent: {
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 18,
  },
  impactCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  impactContent: {
    marginTop: 4,
  },
  impactText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  impactBold: {
    fontWeight: '600',
    color: '#1C1C1E',
  },
});

export default DeleteMediaAfterScreen;