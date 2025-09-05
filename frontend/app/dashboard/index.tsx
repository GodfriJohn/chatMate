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
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../../src/api/firebase';
import { listenForMyChats } from '../../src/api/chatService';
import BottomNavigation from '../../components/BottomNavigation';

const ChatInterface = () => {
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = listenForMyChats((firebaseChats) => {
      const transformedChats = firebaseChats.map((chat) => {
        const otherParticipant = chat.participants?.find((uid: string) => uid !== currentUser.uid);
        let timeString = '';
        if (chat.lastMessage?.createdAt) {
          const lastMessageTime = chat.lastMessage.createdAt.toDate();
          const now = new Date();
          const diffMs = now.getTime() - lastMessageTime.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);
          if (diffHours < 24) {
            timeString = lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else {
            timeString = lastMessageTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
          }
        }
        return {
          id: chat.id,
          name: otherParticipant || 'Unknown User',
          message: chat.lastMessage?.text || 'No messages yet',
          time: timeString,
          avatar: null,
          hasNotification: chat.lastMessage?.from !== currentUser.uid && !!chat.lastMessage,
          unreadCount: 1,
          type: 'individual',
          lastUpdated: chat.lastUpdated,
          participants: chat.participants,
        };
      });
      setChats(transformedChats);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const getInitials = (name: string) => name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
  const getAvatarColor = (name: string) => {
    const colors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5AC8FA', '#FFCC00', '#FF2D92', '#5856D6', '#32D74B'];
    return colors[name.length % colors.length];
  };

  const filteredChats = chats.filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || chat.message.toLowerCase().includes(searchQuery.toLowerCase()));
  const getFilteredChats = () => {
    if (activeFilter === 'unread') return chats.filter(chat => chat.hasNotification && chat.unreadCount > 0);
    if (activeFilter === 'favourite') return chats.filter(chat => ['Angel Curtis', 'Kelas Malam', 'Chance Rhiel Madsen'].includes(chat.name));
    if (activeFilter === 'read_all') return chats.map(chat => ({ ...chat, hasNotification: false, unreadCount: 0 }));
    return chats;
  };

  const displayChats = isFilterActive ? getFilteredChats() : (isSearchActive ? filteredChats : chats);

  const ChatAvatar = ({ avatar, name }: { avatar: string | null, name: string }) => (
    avatar ? <Image source={{ uri: avatar }} style={styles.chatAvatar} /> : <View style={[styles.chatAvatar, styles.avatarFallback, { backgroundColor: getAvatarColor(name) }]}><Text style={styles.avatarInitials}>{getInitials(name)}</Text></View>
  );

  const handleSearchPress = () => {
    setIsSearchActive(true);
  };

  const handleSearchCancel = () => {
    setIsSearchActive(false);
    setSearchQuery('');
  };

  const handleChatPress = (chat: any) => {
    if (isSelectMode) {
      setSelectedChats(selectedChats.includes(chat.id) ? selectedChats.filter(id => id !== chat.id) : [...selectedChats, chat.id]);
      return;
    }
    router.push({ pathname: '/chat/[id]', params: { id: chat.id, chatName: chat.name, chatAvatar: chat.avatar || '', hasNotification: chat.hasNotification, unreadCount: chat.unreadCount } });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {isSearchActive ? (
            <View style={styles.searchHeader}>
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
            </View>
          ) : (
            <>
              <Text style={styles.headerTitle}>ChatMate</Text>
              <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
                <Ionicons name="search-outline" size={24} color="#1C1C1E" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Content */}
        {isSearchActive ? (
          /* Search Mode - Only show search results */
          <View style={styles.searchContainer}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsTitle}>
                {searchQuery.length === 0 
                  ? 'Start typing to search...' 
                  : `${filteredChats.length} result${filteredChats.length !== 1 ? 's' : ''} found`
                }
              </Text>
            </View>
            
            <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
              {searchQuery.length === 0 ? (
                <View style={styles.emptySearchState}>
                  <Ionicons name="search-outline" size={80} color="#C7C7CC" />
                  <Text style={styles.emptySearchText}>Search for chats and messages</Text>
                  <Text style={styles.emptySearchSubtext}>Type to start searching</Text>
                </View>
              ) : filteredChats.length === 0 ? (
                <View style={styles.emptySearchState}>
                  <Ionicons name="search-outline" size={80} color="#C7C7CC" />
                  <Text style={styles.emptySearchText}>No results found</Text>
                  <Text style={styles.emptySearchSubtext}>Try searching with different keywords</Text>
                </View>
              ) : (
                filteredChats.map((chat) => (
                  <TouchableOpacity key={chat.id} style={styles.chatItem} onPress={() => handleChatPress(chat)}>
                    <ChatAvatar avatar={chat.avatar} name={chat.name} />
                    <View style={styles.chatContent}>
                      <View style={styles.chatHeader}>
                        <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                        <Text style={styles.chatTime}>{chat.time}</Text>
                      </View>
                      <Text style={styles.chatMessage} numberOfLines={1}>{chat.message}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        ) : (
          /* Normal Mode */
          <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loadingContainer}><Text style={styles.loadingText}>Loading chats...</Text></View>
            ) : chats.length === 0 ? (
              <View style={styles.emptyChatsState}>
                <Ionicons name="chatbubbles-outline" size={80} color="#C7C7CC" />
                <Text style={styles.emptyChatsText}>No chats yet</Text>
                <Text style={styles.emptyChatsSubtext}>Start a conversation by scanning a QR code or adding a contact</Text>
              </View>
            ) : (
              displayChats.map((chat) => (
                <TouchableOpacity key={chat.id} style={styles.chatItem} onPress={() => handleChatPress(chat)}>
                  <ChatAvatar avatar={chat.avatar} name={chat.name} />
                  <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                      <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                      <Text style={styles.chatTime}>{chat.time}</Text>
                    </View>
                    <Text style={styles.chatMessage} numberOfLines={1}>{chat.message}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

        {!isSelectMode && <BottomNavigation />}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E5EA' 
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#1C1C1E' },
  searchButton: { padding: 8 },

  // Search Header Styles
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
    borderRadius: 25,
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
  },

  // Search Container
  searchContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Search Results Header
  searchResultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchResultsTitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Empty Search State
  emptySearchState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptySearchText: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySearchSubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 8,
    textAlign: 'center',
  },

  chatsList: { flex: 1 },
  chatItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderBottomColor: '#E5E5EA' },
  chatAvatar: { width: 52, height: 52, borderRadius: 26, marginRight: 16 },
  chatContent: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  chatName: { fontSize: 17, fontWeight: '600', color: '#1C1C1E' },
  chatTime: { fontSize: 13, color: '#8E8E93' },
  chatMessage: { fontSize: 15, color: '#8E8E93' },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#8E8E93' },
  emptyChatsState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyChatsText: { fontSize: 20, fontWeight: '600', color: '#1C1C1E', marginTop: 16 },
  emptyChatsSubtext: { fontSize: 16, color: '#8E8E93', textAlign: 'center', marginTop: 8 },
});

export default ChatInterface;