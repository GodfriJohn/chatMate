import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ArchivedChatsScreen = () => {
  const router = useRouter();

  // Mock archived chats data
  const archivedChats = [
    {
      id: 1,
      name: 'Old Group Chat',
      message: 'This chat was archived last month...',
      time: '12:30',
      avatar: null,
      hasNotification: false,
      unreadCount: 0,
      type: 'group',
      archivedDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'John Doe',
      message: 'Thanks for the help!',
      time: '09:45',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      hasNotification: false,
      unreadCount: 0,
      type: 'individual',
      archivedDate: '2024-01-10',
    },
    {
      id: 3,
      name: 'Work Team',
      message: 'Meeting notes from last week',
      time: '16:20',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      hasNotification: false,
      unreadCount: 0,
      type: 'group',
      archivedDate: '2024-01-08',
    },
  ];

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  // Helper function to generate avatar color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      '#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE',
      '#5AC8FA', '#FFCC00', '#FF2D92', '#5856D6', '#32D74B'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Component to render avatar with fallback
  type ChatAvatarProps = {
    avatar: string | null;
    name: string;
  };

  const ChatAvatar = ({ avatar, name }: ChatAvatarProps) => {
    if (avatar) {
      return (
        <Image 
          source={{ uri: avatar }} 
          style={styles.chatAvatar}
          onError={() => {
            console.log('Image failed to load for:', name);
          }}
        />
      );
    }
    
    return (
      <View style={[styles.chatAvatar, styles.avatarFallback, { backgroundColor: getAvatarColor(name) }]}>
        <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
      </View>
    );
  };

  // Handle chat press
  const handleChatPress = (chat: any) => {
    console.log('Opening archived chat with:', chat.name);
    router.push({
      pathname: '/chat',
      params: {
        id: chat.id,
        chatName: chat.name,
        chatAvatar: chat.avatar,
        isArchived: 'true',
      }
    });
  };

  // Handle unarchive
  const handleUnarchive = (chatId: number) => {
    console.log('Unarchiving chat:', chatId);
    // Add unarchive logic here
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF" 
        translucent={false}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Archived Chats</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        {archivedChats.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="archive-outline" size={80} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>No Archived Chats</Text>
            <Text style={styles.emptyStateSubtitle}>
              Chats you archive will appear here
            </Text>
          </View>
        ) : (
          <>
            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
              <Text style={styles.infoBannerText}>
                Archived chats are hidden from your main chat list
              </Text>
            </View>

            {/* Archived Chats List */}
            <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
              {archivedChats.map((chat) => (
                <View key={chat.id} style={styles.chatItemContainer}>
                  <TouchableOpacity 
                    style={styles.chatItem} 
                    activeOpacity={0.7}
                    onPress={() => handleChatPress(chat)}
                  >
                    <ChatAvatar avatar={chat.avatar} name={chat.name} />
                    <View style={styles.chatContent}>
                      <View style={styles.chatHeader}>
                        <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                        <Text style={styles.chatTime}>{chat.time}</Text>
                      </View>
                      <View style={styles.messageRow}>
                        <Text style={styles.chatMessage} numberOfLines={1}>
                          {chat.message}
                        </Text>
                      </View>
                      <View style={styles.archivedInfo}>
                        <Ionicons name="archive" size={12} color="#8E8E93" />
                        <Text style={styles.archivedDate}>
                          Archived on {new Date(chat.archivedDate).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.unarchiveButton}
                    onPress={() => handleUnarchive(chat.id)}
                  >
                    <Ionicons name="arrow-up-circle-outline" size={24} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
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

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Info Banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  infoBannerText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
    flex: 1,
  },

  // Chat List
  chatsList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarFallback: {
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  messageRow: {
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  archivedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  archivedDate: {
    fontSize: 11,
    color: '#8E8E93',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  unarchiveButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default ArchivedChatsScreen;