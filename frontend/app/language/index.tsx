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

const LanguageScreen = () => {
  const router = useRouter();
  
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
    { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    const selectedLang = languages.find(lang => lang.code === languageCode);
    
    Alert.alert(
      'Change Language',
      `Change app language to ${selectedLang?.name}? The app will restart to apply changes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Change', 
          onPress: () => {
            console.log(`Language changed to: ${selectedLang?.name}`);
            // Here you would implement the actual language change logic
            router.back();
          }
        }
      ]
    );
  };

  const getLanguageFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      'en': '🇺🇸',
      'ta': '🇮🇳',
      'si': '🇱🇰',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇧🇷',
      'ru': '🇷🇺',
      'ja': '🇯🇵',
      'ko': '🇰🇷',
      'zh': '🇨🇳',
      'ar': '🇸🇦',
      'hi': '🇮🇳',
      'th': '🇹🇭',
      'vi': '🇻🇳',
      'id': '🇮🇩',
      'ms': '🇲🇾',
      'tl': '🇵🇭',
      'tr': '🇹🇷',
    };
    return flags[code] || '🌐';
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
          <Text style={styles.headerTitle}>Language</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Language</Text>
            <Text style={styles.sectionSubtitle}>
              Select your preferred language for the app interface
            </Text>

            {/* Popular Languages */}
            <View style={styles.popularSection}>
              <Text style={styles.popularTitle}>Popular</Text>
              {languages.slice(0, 3).map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    selectedLanguage === language.code && styles.selectedLanguageItem
                  ]}
                  onPress={() => handleLanguageChange(language.code)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageFlag}>{getLanguageFlag(language.code)}</Text>
                    <View style={styles.languageTexts}>
                      <Text style={[
                        styles.languageName,
                        selectedLanguage === language.code && styles.selectedLanguageName
                      ]}>
                        {language.name}
                      </Text>
                      <Text style={styles.languageNative}>{language.nativeName}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedLanguage === language.code && styles.radioButtonSelected
                  ]}>
                    {selectedLanguage === language.code && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* All Languages */}
            <View style={styles.allLanguagesSection}>
              <Text style={styles.allLanguagesTitle}>All Languages</Text>
              {languages.slice(3).map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    selectedLanguage === language.code && styles.selectedLanguageItem
                  ]}
                  onPress={() => handleLanguageChange(language.code)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageFlag}>{getLanguageFlag(language.code)}</Text>
                    <View style={styles.languageTexts}>
                      <Text style={[
                        styles.languageName,
                        selectedLanguage === language.code && styles.selectedLanguageName
                      ]}>
                        {language.name}
                      </Text>
                      <Text style={styles.languageNative}>{language.nativeName}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedLanguage === language.code && styles.radioButtonSelected
                  ]}>
                    {selectedLanguage === language.code && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Translation Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                <View style={styles.infoText}>
                  <Text style={styles.infoTitle}>Help Translate</Text>
                  <Text style={styles.infoSubtitle}>
                    Help us improve translations for your language. Contribute to make ChatMate better for everyone.
                  </Text>
                </View>
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
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 32,
    lineHeight: 22,
  },
  popularSection: {
    marginBottom: 32,
  },
  popularTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  allLanguagesSection: {
    marginBottom: 32,
  },
  allLanguagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F9F9F9',
  },
  selectedLanguageItem: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageTexts: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: '#007AFF',
  },
  languageNative: {
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
    marginTop: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 18,
  },
});

export default LanguageScreen;