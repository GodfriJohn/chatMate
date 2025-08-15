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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BlockedContactsScreen = () => {
  const router = useRouter();
  
  const [blockedContacts, setBlockedContacts] = useState([
    {
      id: 1,
      name: 'John Spam',
      phone: '+1 (555) 123-4567',
      avatar: null,
      blockedDate: '2024-01-10',
      reason: 'Spam messages',
    },
    {
      id: 2,
      name: 'Unknown Number',
      phone: '+1 (555) 987-6543',
      avatar: null,
      blockedDate: '2024-01-05',
      reason: 'Unknown contact',
    },
    {
      id: 3,
      name: 'Marketing Bot',
      phone: '+1 (555) 555-5555',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      blockedDate: '2023-12-20',
      reason: 'Unwanted marketing',
    },
  ]);

  const handleUnblock = (contact: any) => {
    Alert.alert(
      'Unblock Contact',
      `Unblock ${contact.name}? They will be able to send you messages again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unblock', 
          onPress: () => {
            setBlockedContacts(blockedContacts.filter(c => c.id !== contact.id));
            Alert.alert('Success', `${contact.name} has been unblocked.`);
          }
        }
      ]
    );
  };

  const handleBlockNew = () => {
    Alert.alert(
      'Block New Contact',
      'Enter phone number or select from contacts to block',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'From Contacts', onPress: () => console.log('Select from contacts') },
        { text: 'Enter Number', onPress: () => console.log('Enter phone number') }
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE',
      '#5AC8FA', '#FFCC00', '#FF2D92', '#5856D6', '#32D74B'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const ContactAvatar = ({ contact }: { contact: any }) => {
    if (contact.avatar) {
      return (
        <Image 
          source={{ uri: contact.avatar }} 
          style={styles.contactAvatar}
          onError={() => console.log('Avatar image failed to load')}
        />
      );
    }
    
    return (
      <View style={[styles.contactAvatar, styles.avatarFallback, { backgroundColor: getAvatarColor(contact.name) }]}>
        <Text style={styles.avatarInitials}>{getInitials(contact.name)}</Text>
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
          <Text style={styles.headerTitle}>Blocked Contacts</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleBlockNew}>
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {blockedContacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ban-outline" size={80} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>No Blocked Contacts</Text>
            <Text style={styles.emptySubtitle}>
              Contacts you block will appear here. They won't be able to send you messages or see your online status.
            </Text>
            <TouchableOpacity style={styles.blockButton} onPress={handleBlockNew}>
              <Text style={styles.blockButtonText}>Block a Contact</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <Ionicons name="information-circle-outline" size={20} color="#FF9500" />
              <Text style={styles.infoBannerText}>
                Blocked contacts can't send you messages or see your online status
              </Text>
            </View>

            {/* Blocked Contacts List */}
            <View style={styles.contactsList}>
              <Text style={styles.sectionTitle}>
                {blockedContacts.length} blocked contact{blockedContacts.length !== 1 ? 's' : ''}
              </Text>
              
              {blockedContacts.map((contact) => (
                <View key={contact.id} style={styles.contactItem}>
                  <ContactAvatar contact={contact} />
                  
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                    <View style={styles.blockInfo}>
                      <Ionicons name="ban" size={12} color="#FF3B30" />
                      <Text style={styles.blockDate}>
                        Blocked on {new Date(contact.blockedDate).toLocaleDateString()}
                      </Text>
                    </View>
                    {contact.reason && (
                      <Text style={styles.blockReason}>Reason: {contact.reason}</Text>
                    )}
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.unblockButton}
                    onPress={() => handleUnblock(contact)}
                  >
                    <Text style={styles.unblockButtonText}>Unblock</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Help Section */}
            <View style={styles.helpSection}>
              <Text style={styles.helpTitle}>About Blocking</Text>
              <View style={styles.helpItem}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                <Text style={styles.helpText}>Blocked contacts can't send you messages</Text>
              </View>
              <View style={styles.helpItem}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                <Text style={styles.helpText}>They won't see your online status or last seen</Text>
              </View>
              <View style={styles.helpItem}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                <Text style={styles.helpText}>Existing chat history remains intact</Text>
              </View>
              <View style={styles.helpItem}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                <Text style={styles.helpText}>You can unblock them anytime</Text>
              </View>
            </View>
          </ScrollView>
        )}
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
  addButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  blockButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  blockButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
  },
  infoBannerText: {
    fontSize: 14,
    color: '#FF9500',
    marginLeft: 8,
    flex: 1,
  },
  contactsList: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarFallback: {
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  blockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  blockDate: {
    fontSize: 12,
    color: '#FF3B30',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  blockReason: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  unblockButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  unblockButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  helpSection: {
    padding: 16,
    backgroundColor: '#F9F9F9',
    margin: 16,
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 12,
    flex: 1,
  },
});

export default BlockedContactsScreen;