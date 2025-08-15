import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AboutScreen = () => {
  const router = useRouter();

  const teamMembers = [
    { name: 'John Smith', role: 'CEO & Founder', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    { name: 'Sarah Johnson', role: 'CTO', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    { name: 'Mike Chen', role: 'Lead Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { name: 'Emma Davis', role: 'UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  ];

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
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
          <Text style={styles.headerTitle}>About ChatMate</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* App Logo and Info */}
          <View style={styles.appSection}>
            <View style={styles.appLogo}>
              <Ionicons name="chatbubble-ellipses" size={80} color="#007AFF" />
            </View>
            <Text style={styles.appName}>ChatMate</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              A modern, secure, and feature-rich messaging app designed to keep you connected with friends, family, and colleagues around the world.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#34C759" />
                <Text style={styles.featureText}>End-to-end encryption</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="cloud-upload-outline" size={24} color="#007AFF" />
                <Text style={styles.featureText}>Cloud backup & sync</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="people-outline" size={24} color="#FF9500" />
                <Text style={styles.featureText}>Group chats & communities</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="videocam-outline" size={24} color="#5856D6" />
                <Text style={styles.featureText}>Voice & video calls</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="document-attach-outline" size={24} color="#FF3B30" />
                <Text style={styles.featureText}>File sharing</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="location-outline" size={24} color="#32D74B" />
                <Text style={styles.featureText}>Location sharing</Text>
              </View>
            </View>
          </View>

          {/* Team */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Team</Text>
            <View style={styles.teamGrid}>
              {teamMembers.map((member, index) => (
                <View key={index} style={styles.teamMember}>
                  <View style={styles.teamAvatar}>
                    <Image 
                      source={{ uri: member.avatar }} 
                      style={styles.teamAvatarImage}
                      onError={() => console.log('Team member image failed to load')}
                    />
                  </View>
                  <Text style={styles.teamName}>{member.name}</Text>
                  <Text style={styles.teamRole}>{member.role}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Company Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Company</Text>
            <View style={styles.companyInfo}>
              <Text style={styles.companyDescription}>
                ChatMate is developed by a passionate team of developers and designers who believe in creating meaningful connections through technology. Founded in 2024, we're committed to providing a secure, reliable, and user-friendly messaging experience.
              </Text>
              
              <View style={styles.companyStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1M+</Text>
                  <Text style={styles.statLabel}>Active Users</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50+</Text>
                  <Text style={styles.statLabel}>Countries</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>99.9%</Text>
                  <Text style={styles.statLabel}>Uptime</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Legal Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            
            <TouchableOpacity 
              style={styles.legalItem}
              onPress={() => openLink('https://chatmate.com/privacy')}
            >
              <Text style={styles.legalText}>Privacy Policy</Text>
              <Ionicons name="open-outline" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.legalItem}
              onPress={() => openLink('https://chatmate.com/terms')}
            >
              <Text style={styles.legalText}>Terms of Service</Text>
              <Ionicons name="open-outline" size={20} color="#8E8E93" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.legalItem}
              onPress={() => openLink('https://chatmate.com/licenses')}
            >
              <Text style={styles.legalText}>Open Source Licenses</Text>
              <Ionicons name="open-outline" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Social Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connect With Us</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openLink('https://twitter.com/chatmate')}
              >
                <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                <Text style={styles.socialText}>Twitter</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openLink('https://facebook.com/chatmate')}
              >
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openLink('https://instagram.com/chatmate')}
              >
                <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                <Text style={styles.socialText}>Instagram</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => openLink('https://github.com/chatmate')}
              >
                <Ionicons name="logo-github" size={24} color="#333" />
                <Text style={styles.socialText}>GitHub</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Copyright */}
          <View style={styles.copyrightSection}>
            <Text style={styles.copyrightText}>
              © 2024 ChatMate Technologies. All rights reserved.
            </Text>
            <Text style={styles.copyrightSubtext}>
              Made with ❤️ for connecting people worldwide
            </Text>
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
  appSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  appLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
  },
  appDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 20,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 16,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  teamMember: {
    alignItems: 'center',
    width: '45%',
  },
  teamAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  teamAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
    textAlign: 'center',
  },
  teamRole: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  companyInfo: {
    marginBottom: 20,
  },
  companyDescription: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
    marginBottom: 24,
  },
  companyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  legalText: {
    fontSize: 16,
    color: '#007AFF',
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    minWidth: '45%',
  },
  socialText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 8,
    fontWeight: '500',
  },
  copyrightSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  copyrightText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
  },
  copyrightSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default AboutScreen;