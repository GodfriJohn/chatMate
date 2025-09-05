// dashboard/index.tsx - Enhanced version with modern design
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../../src/api/firebase';
import { listenForMyChats, syncPendingData } from '../../src/api/chatService';
import { getContact } from '../../src/db/contactRepo';
import { getUserProfile } from '../../src/db/userRepo';
import BottomNavigation from '../../components/BottomNavigation';

const { width: screenWidth } = Dimensions.get('window');

const ChatInterface = () => {
  const router = useRouter();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [searchAnimation] = useState(new Animated.Value(0));

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      console.warn("⚠️ No authenticated user found");
      setLoading(false);
      return;
    }

    console.log("🚀 Setting up chat listener for user:", currentUser.uid);

    // Set up the enhanced listener that handles offline-first loading
    const unsubscribe = listenForMyChats(async (firebaseChats) => {
      console.log("📱 Received chats update:", firebaseChats.length, "chats");
      
      const transformedChats = [];
      
      for (const chat of firebaseChats) {
        const otherParticipant = chat.participants?.find((uid: string) => uid !== currentUser.uid);
        let displayName = 'Unknown User';
        let lastSeen = null;
        
        if (otherParticipant) {
          // Try to get display name from multiple sources
          if (chat.participantName) {
            displayName = chat.participantName;
          } else {
            try {
              const contact = await getContact(currentUser.uid, otherParticipant);
              if (contact?.contactDisplayName) {
                displayName = contact.contactDisplayName;
              } else if (contact?.contactUsername) {
                displayName = contact.contactUsername;
              } else {
                const userProfile = await getUserProfile(otherParticipant);
                if (userProfile?.displayName) {
                  displayName = userProfile.displayName;
                } else if (userProfile?.username) {
                  displayName = userProfile.username;
                } else {
                  displayName = `User ${otherParticipant.slice(-4)}`;
                }
              }
            } catch (error) {
              console.error('Error getting contact/user info:', error);
              displayName = `User ${otherParticipant.slice(-4)}`;
            }
          }
        }
        
        let timeString = '';
        let isToday = false;
        
        if (chat.lastMessage?.createdAt) {
          const lastMessageTime = chat.lastMessage.createdAt.toDate();
          const now = new Date();
          const diffMs = now.getTime() - lastMessageTime.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          
          if (diffHours < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            timeString = diffMinutes < 1 ? 'now' : `${diffMinutes}m`;
            isToday = true;
          } else if (diffHours < 24) {
            timeString = lastMessageTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            isToday = true;
          } else if (diffDays < 7) {
            timeString = lastMessageTime.toLocaleDateString([], { 
              weekday: 'short' 
            });
          } else {
            timeString = lastMessageTime.toLocaleDateString([], { 
              month: 'short', 
              day: 'numeric' 
            });
          }
        }
        
        transformedChats.push({
          id: chat.id,
          name: displayName,
          message: chat.lastMessage?.text || 'No messages yet',
          time: timeString,
          isToday,
          avatar: null,
          hasNotification: chat.lastMessage?.from !== currentUser.uid && !!chat.lastMessage,
          unreadCount: chat.lastMessage?.from !== currentUser.uid ? 1 : 0,
          type: 'individual',
          lastUpdated: chat.lastUpdated,
          participants: chat.participants,
          otherParticipant,
          isOnline: Math.random() > 0.5, // Mock online status
        });
      }
      
      // Sort by last updated
      transformedChats.sort((a, b) => b.lastUpdated?.toMillis() - a.lastUpdated?.toMillis());
      
      setChats(transformedChats);
      setLoading(false);
      setIsRefreshing(false);
      
      // Check if we're in offline mode
      setIsOffline(firebaseChats.length === 0 && transformedChats.length > 0);
    });

    // Trigger background sync on app start
    syncPendingData().catch(err => 
      console.error("❌ Initial sync failed:", err)
    );

    return unsubscribe;
  }, [currentUser]);

  const handleRefresh = async () => {
    if (!currentUser) return;
    
    console.log("🔄 Manual refresh triggered");
    setIsRefreshing(true);
    
    try {
      await syncPendingData();
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    } catch (err) {
      console.error("❌ Refresh failed:", err);
      setIsRefreshing(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', 
      '#5AC8FA', '#FFCC00', '#FF2D92', '#5856D6', '#32D74B'
    ];
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ChatAvatar = ({ avatar, name, isOnline }: { avatar: string | null, name: string, isOnline?: boolean }) => (
    <View style={styles.avatarContainer}>
      {avatar ? 
        <Image source={{ uri: avatar }} style={styles.chatAvatar} /> : 
        <View style={[styles.chatAvatar, styles.avatarFallback, { backgroundColor: getAvatarColor(name) }]}>
          <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
        </View>
      }
      {isOnline && <View style={styles.onlineIndicator} />}
    </View>
  );

  const handleSearchPress = () => {
    setIsSearchActive(true);
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSearchCancel = () => {
    setIsSearchActive(false);
    setSearchQuery('');
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleChatPress = (chat: any) => {
    console.log("💬 Opening chat:", chat.id, "with:", chat.name);
    router.push({ 
      pathname: '/chat/[id]', 
      params: { 
        id: chat.id, 
        chatName: chat.name, 
        chatAvatar: chat.avatar || '', 
        hasNotification: chat.hasNotification, 
        unreadCount: chat.unreadCount 
      } 
    });
  };

  const MessagePreview = ({ message, isFromMe }: { message: string, isFromMe: boolean }) => {
    const prefix = isFromMe ? 'You: ' : '';
    return (
      <Text style={styles.chatMessage} numberOfLines={1}>
        {prefix}{message}
      </Text>
    );
  };

  const TimeDisplay = ({ time, isToday, hasNotification }: { time: string, isToday: boolean, hasNotification: boolean }) => (
    <View style={styles.timeContainer}>
      <Text style={[
        styles.chatTime,
        isToday && styles.chatTimeToday,
        hasNotification && styles.chatTimeUnread
      ]}>
        {time}
      </Text>
      {hasNotification && <View style={styles.unreadDot} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {isSearchActive ? (
            <Animated.View style={[
              styles.searchHeader,
              {
                width: searchAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                opacity: searchAnimation,
              }
            ]}>
              <TouchableOpacity style={styles.searchBackButton} onPress={handleSearchCancel}>
                <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
              </TouchableOpacity>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#007AFF" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search chats..."
                  placeholderTextColor="#8E8E93"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          ) : (
            <>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>ChatMate</Text>
                <Text style={styles.headerSubtitle}>
                  {chats.length} chat{chats.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.headerRight}>
                {isOffline && (
                  <View style={styles.offlineIndicator}>
                    <Ionicons name="cloud-offline-outline" size={16} color="#FF9500" />
                  </View>
                )}
                <TouchableOpacity style={styles.headerButton} onPress={handleSearchPress}>
                  <Ionicons name="search-outline" size={24} color="#1C1C1E" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Content */}
        {isSearchActive ? (
          /* Search Mode */
          <View style={styles.searchContainer}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsTitle}>
                {searchQuery.length === 0 
                  ? 'Start typing to search...' 
                  : `${filteredChats.length} result${filteredChats.length !== 1 ? 's' : ''} found`
                }
              </Text>
            </View>
            
            <ScrollView 
              style={styles.chatsList} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chatsListContent}
            >
              {searchQuery.length === 0 ? (
                <View style={styles.emptySearchState}>
                  <View style={styles.emptySearchIcon}>
                    <Ionicons name="search-outline" size={64} color="#C7C7CC" />
                  </View>
                  <Text style={styles.emptySearchText}>Search for chats and messages</Text>
                  <Text style={styles.emptySearchSubtext}>Type to start searching</Text>
                </View>
              ) : filteredChats.length === 0 ? (
                <View style={styles.emptySearchState}>
                  <View style={styles.emptySearchIcon}>
                    <Ionicons name="document-text-outline" size={64} color="#C7C7CC" />
                  </View>
                  <Text style={styles.emptySearchText}>No results found</Text>
                  <Text style={styles.emptySearchSubtext}>Try searching with different keywords</Text>
                </View>
              ) : (
                filteredChats.map((chat, index) => (
                  <TouchableOpacity 
                    key={chat.id} 
                    style={[
                      styles.chatItem,
                      index === filteredChats.length - 1 && styles.chatItemLast
                    ]} 
                    onPress={() => handleChatPress(chat)}
                    activeOpacity={0.7}
                  >
                    <ChatAvatar avatar={chat.avatar} name={chat.name} isOnline={chat.isOnline} />
                    <View style={styles.chatContent}>
                      <View style={styles.chatHeader}>
                        <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                        <TimeDisplay 
                          time={chat.time} 
                          isToday={chat.isToday} 
                          hasNotification={chat.hasNotification} 
                        />
                      </View>
                      <MessagePreview 
                        message={chat.message} 
                        isFromMe={chat.lastMessage?.from === currentUser?.uid} 
                      />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        ) : (
          /* Normal Mode */
          <ScrollView 
            style={styles.chatsList} 
            contentContainerStyle={styles.chatsListContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={['#007AFF']}
                tintColor="#007AFF"
                title="Pull to refresh"
                titleColor="#8E8E93"
              />
            }
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingSpinner}>
                  <Ionicons name="chatbubbles-outline" size={64} color="#C7C7CC" />
                </View>
                <Text style={styles.loadingText}>Loading chats...</Text>
              </View>
            ) : chats.length === 0 ? (
              <View style={styles.emptyChatsState}>
                <View style={styles.emptyStateIcon}>
                  <Ionicons name="chatbubbles-outline" size={80} color="#C7C7CC" />
                </View>
                <Text style={styles.emptyChatsText}>Welcome to ChatMate!</Text>
                <Text style={styles.emptyChatsSubtext}>
                  Start a conversation by scanning a QR code or adding a contact below
                </Text>
                {isOffline && (
                  <View style={styles.offlineMessage}>
                    <Ionicons name="wifi-outline" size={20} color="#FF9500" />
                    <Text style={styles.offlineMessageText}>
                      Connect to internet to sync your chats
                    </Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.getStartedButton}
                  onPress={() => router.push('/contacts')}
                >
                  <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.getStartedButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            ) : (
              chats.map((chat, index) => (
                <TouchableOpacity 
                  key={chat.id} 
                  style={[
                    styles.chatItem,
                    chat.hasNotification && styles.chatItemUnread,
                    index === chats.length - 1 && styles.chatItemLast
                  ]} 
                  onPress={() => handleChatPress(chat)}
                  activeOpacity={0.7}
                >
                  <ChatAvatar avatar={chat.avatar} name={chat.name} isOnline={chat.isOnline} />
                  <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                      <Text 
                        style={[
                          styles.chatName,
                          chat.hasNotification && styles.chatNameUnread
                        ]} 
                        numberOfLines={1}
                      >
                        {chat.name}
                      </Text>
                      <TimeDisplay 
                        time={chat.time} 
                        isToday={chat.isToday} 
                        hasNotification={chat.hasNotification} 
                      />
                    </View>
                    <MessagePreview 
                      message={chat.message} 
                      isFromMe={chat.lastMessage?.from === currentUser?.uid} 
                    />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

        <BottomNavigation />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
  },
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  
  // Header
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: { 
    padding: 8,
    marginLeft: 8,
  },
  offlineIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  // Search Header
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchBackButton: {
    padding: 8,
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '400',
  },

  // Search Container
  searchContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchResultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  searchResultsTitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Empty States
  emptySearchState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptySearchIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptySearchText: {
    fontSize: 20,
    color: '#1C1C1E',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySearchSubtext: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },

  emptyChatsState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyStateIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  emptyChatsText: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#1C1C1E', 
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyChatsSubtext: { 
    fontSize: 17, 
    color: '#8E8E93', 
    textAlign: 'center', 
    lineHeight: 24,
    marginBottom: 32,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingSpinner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loadingText: { 
    fontSize: 18, 
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Chat List
  chatsList: { 
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  chatsListContent: {
    paddingTop: 8,
  },
  chatItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5, 
    borderBottomColor: '#E5E5EA',
  },
  chatItemUnread: {
    backgroundColor: '#F8F9FF',
  },
  chatItemLast: {
    borderBottomWidth: 0,
  },

  // Avatar
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  chatAvatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 28,
  },
  avatarFallback: { 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarInitials: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#FFFFFF' 
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Chat Content
  chatContent: { 
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#1C1C1E',
    flex: 1,
    marginRight: 8,
  },
  chatNameUnread: {
    fontWeight: '700',
  },
  chatMessage: { 
    fontSize: 15, 
    color: '#8E8E93',
    fontWeight: '400',
    lineHeight: 20,
  },
  
  // Time and Status
  timeContainer: {
    alignItems: 'flex-end',
  },
  chatTime: { 
    fontSize: 13, 
    color: '#8E8E93',
    fontWeight: '400',
  },
  chatTimeToday: {
    color: '#007AFF',
    fontWeight: '500',
  },
  chatTimeUnread: {
    color: '#007AFF',
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginTop: 4,
  },

  // Offline Message
  offlineMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  offlineMessageText: {
    fontSize: 14,
    color: '#FF9500',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default ChatInterface;