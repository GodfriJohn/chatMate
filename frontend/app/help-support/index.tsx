import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HelpSupportScreen = () => {
  const router = useRouter();

  const faqData = [
    {
      id: 1,
      question: 'How do I backup my chats?',
      answer: 'Go to Settings > Storage & Data > Backup Settings to configure automatic backups of your chats.',
      expanded: false,
    },
    {
      id: 2,
      question: 'How do I change my profile picture?',
      answer: 'Tap on your profile picture in the Profile section, then select "Edit Profile" and tap on your avatar to change it.',
      expanded: false,
    },
    {
      id: 3,
      question: 'How do I block someone?',
      answer: 'Open the chat with the person you want to block, tap on their name at the top, and select "Block Contact".',
      expanded: false,
    },
    {
      id: 4,
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to Settings > Privacy & Security > Two-Step Verification and follow the setup instructions.',
      expanded: false,
    },
    {
      id: 5,
      question: 'How do I delete my account?',
      answer: 'Contact our support team through the app or email us at support@chatmate.com for account deletion requests.',
      expanded: false,
    },
  ];

  const [faqs, setFaqs] = useState(faqData);

  const toggleFAQ = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
    ));
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you\'d like to contact us',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email', onPress: () => Linking.openURL('mailto:support@chatmate.com') },
        { text: 'Live Chat', onPress: () => console.log('Opening live chat') },
      ]
    );
  };

  const handleReportBug = () => {
    Alert.alert(
      'Report a Bug',
      'Help us improve ChatMate by reporting any issues you encounter.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', onPress: () => console.log('Opening bug report form') },
      ]
    );
  };

  const handleFeatureRequest = () => {
    Alert.alert(
      'Feature Request',
      'Have an idea for a new feature? We\'d love to hear from you!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: () => console.log('Opening feature request form') },
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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get Help</Text>
            
            <TouchableOpacity style={styles.actionItem} onPress={handleContactSupport}>
              <View style={styles.actionIcon}>
                <Ionicons name="headset-outline" size={24} color="#007AFF" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Contact Support</Text>
                <Text style={styles.actionSubtitle}>Get help from our support team</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleReportBug}>
              <View style={styles.actionIcon}>
                <Ionicons name="bug-outline" size={24} color="#FF9500" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Report a Bug</Text>
                <Text style={styles.actionSubtitle}>Tell us about any issues you're experiencing</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleFeatureRequest}>
              <View style={styles.actionIcon}>
                <Ionicons name="bulb-outline" size={24} color="#34C759" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Feature Request</Text>
                <Text style={styles.actionSubtitle}>Suggest new features or improvements</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => Linking.openURL('https://chatmate.com/help')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="document-text-outline" size={24} color="#5856D6" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>User Guide</Text>
                <Text style={styles.actionSubtitle}>Learn how to use ChatMate features</Text>
              </View>
              <Ionicons name="open-outline" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Frequently Asked Questions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            
            {faqs.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Ionicons 
                    name={faq.expanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#8E8E93" 
                  />
                </TouchableOpacity>
                {faq.expanded && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.contactCard}>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={20} color="#007AFF" />
                <Text style={styles.contactText}>support@chatmate.com</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="time-outline" size={20} color="#007AFF" />
                <Text style={styles.contactText}>24/7 Support Available</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="globe-outline" size={20} color="#007AFF" />
                <Text style={styles.contactText}>www.chatmate.com/help</Text>
              </View>
            </View>
          </View>

          {/* App Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Information</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Build</Text>
                <Text style={styles.infoValue}>2024.01.001</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Last Updated</Text>
                <Text style={styles.infoValue}>January 15, 2024</Text>
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
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  faqItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingBottom: 16,
    paddingRight: 32,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  infoCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
});

export default HelpSupportScreen;