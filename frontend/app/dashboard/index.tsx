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
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

const ChatInterface = () => {
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isNewChatActive, setIsNewChatActive] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const stories = [
    { id: 1, name: 'Terry', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face' },
    { id: 2, name: 'Craig', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face' },
    { id: 3, name: 'Roger', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face' },
    { id: 4, name: 'Nolan', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face' },
  ];

  const chats = [
    {
      id: 1,
      name: 'Angel Curtis',
      message: 'Please help me find a good monitor for t...',
      time: '02:11',
      avatar: null,
      hasNotification: true,
      unreadCount: 3,
      type: 'individual', // individual person
    },
    {
      id: 2,
      name: 'Zaire Dorwart',
      message: 'Gacor pisan kang',
      time: '02:11',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      hasNotification: false,
      unreadCount: 0,
      type: 'individual', // individual person
    },
    {
      id: 3,
      name: 'Kelas Malam',
      message: 'Bima : No one can come today?',
      time: '02:11',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      hasNotification: true,
      unreadCount: 7,
      type: 'group', // group/community chat
    },
    {
      id: 4,
      name: 'Jocelyn Gouse',
      message: "You're now an admin",
      time: '02:11',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
      hasNotification: false,
      unreadCount: 0,
      type: 'individual', // individual person
    },
    {
      id: 5,
      name: 'Jaylon Dias',
      message: '🎯 Buy back 10k gallons, top up credit, b...',
      time: '02:11',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      hasNotification: false,
      unreadCount: 0,
      type: 'individual', // individual person
    },
    {
      id: 6,
      name: 'Chance Rhiel Madsen',
      message: 'Thank you mate!',
      time: '02:11',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      hasNotification: true,
      unreadCount: 1,
      type: 'individual', // individual person
    },
    {
      id: 7,
      name: 'Livia Dias',
      message: 'Hey there! How are you doing today?',
      time: '02:11',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face',
      hasNotification: false,
      unreadCount: 0,
      type: 'individual', // individual person
    },
  ];

  // New Chat Options
  const newChatOptions = [
    {
      id: 'chat',
      icon: 'chatbubble-outline',
      title: 'New Chat',
      subtitle: 'Send a message to your contact',
      color: '#007AFF'
    },
    {
      id: 'group',
      icon: 'people-outline',
      title: 'New Group',
      subtitle: 'Create a group with multiple contacts',
      color: '#007AFF'
    },
    {
      id: 'contact',
      icon: 'person-add-outline',
      title: 'New Contact',
      subtitle: 'Add a contact to be able to send messages',
      color: '#007AFF'
    },
    {
      id: 'community',
      icon: 'globe-outline',
      title: 'New Community',
      subtitle: 'Join the community around you',
      color: '#007AFF'
    },
    {
      id: 'broadcast',
      icon: 'megaphone-outline',
      title: 'Broadcast List',
      subtitle: 'Send messages to multiple contacts',
      color: '#007AFF'
    },
    {
      id: 'business',
      icon: 'business-outline',
      title: 'Business Chat',
      subtitle: 'Connect with business accounts',
      color: '#007AFF'
    }
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

  // Filter chats based on search query
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter chats based on active filter
  const getFilteredChats = () => {
    let filtered = chats;
    
    if (activeFilter === 'unread') {
      filtered = chats.filter(chat => chat.hasNotification && chat.unreadCount > 0);
    } else if (activeFilter === 'favourite') {
      // For demo purposes, let's consider chats with certain names as favourites
      const favouriteNames = ['Angel Curtis', 'Kelas Malam', 'Chance Rhiel Madsen'];
      filtered = chats.filter(chat => favouriteNames.includes(chat.name));
    } else if (activeFilter === 'read_all') {
      // Mark all chats as read (remove all blue notification badges)
      filtered = chats.map(chat => ({ ...chat, hasNotification: false, unreadCount: 0 }));
    }
    
    return filtered;
  };

  const displayChats = isFilterActive ? getFilteredChats() : (isSearchActive ? filteredChats : chats);

  // Component to render story avatar with fallback
  type Story = {
    id: number;
    name: string;
    image?: string;
  };

  type StoryAvatarProps = {
    story: Story;
  };

  const StoryAvatar = ({ story }: StoryAvatarProps) => {
    if (story.image) {
      return (
        <Image 
          source={{ uri: story.image }} 
          style={styles.storyImage}
          onError={() => {
            console.log('Story image failed to load for:', story.name);
          }}
        />
      );
    }
    
    return (
      <View style={[styles.storyImage, styles.storyAvatarFallback, { backgroundColor: getAvatarColor(story.name) }]}>
        <Text style={styles.storyAvatarInitials}>{getInitials(story.name)}</Text>
      </View>
    );
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

  // Handle search button press
  const handleSearchPress = () => {
    setIsSearchActive(true);
    setIsNewChatActive(false);
    setIsFilterActive(false);
    setIsSelectMode(false);
    setShowMoreMenu(false);
  };

  // Handle search cancel
  const handleSearchCancel = () => {
    setIsSearchActive(false);
    setSearchQuery('');
  };

  // Handle filter cancel
  const handleFilterCancel = () => {
    setIsFilterActive(false);
    setActiveFilter('');
  };

  // Handle select mode toggle
  const handleSelectModeToggle = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedChats([]);
    setIsSearchActive(false);
    setIsFilterActive(false);
    setIsNewChatActive(false);
  };

  // Handle chat selection in select mode
  const handleChatSelection = (chatId: number) => {
    if (selectedChats.includes(chatId)) {
      setSelectedChats(selectedChats.filter(id => id !== chatId));
    } else {
      setSelectedChats([...selectedChats, chatId]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedChats.length === chats.length) {
      setSelectedChats([]);
    } else {
      setSelectedChats(chats.map(chat => chat.id));
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on chats:`, selectedChats);
    
    switch (action) {
      case 'delete':
        console.log('Deleting selected chats');
        // Add delete logic here
        break;
      case 'star':
        console.log('Starring selected chats');
        // Add star logic here
        break;
      case 'mark_read':
        console.log('Marking selected chats as read');
        // Add mark as read logic here
        break;
      case 'archive':
        console.log('Archiving selected chats');
        // Add archive logic here
        break;
    }
    
    // Exit select mode after action
    setIsSelectMode(false);
    setSelectedChats([]);
  };

  // Handle new chat button press
  const handleNewChatPress = () => {
    setIsNewChatActive(true);
    setIsSearchActive(false);
  };

  // Handle new chat cancel
  const handleNewChatCancel = () => {
    setIsNewChatActive(false);
  };

  // Handle chat item press
  const handleChatPress = (chat: any) => {
    if (isSelectMode) {
      handleChatSelection(chat.id);
      return;
    }
    
    console.log('Opening chat with:', chat.name);
    router.push({
      pathname: '/chat',
      params: {
        id: chat.id,
        chatName: chat.name,
        chatAvatar: chat.avatar,
        hasNotification: chat.hasNotification,
        unreadCount: chat.unreadCount
      }
    });
  };

  // Handle new chat option selection
  const handleNewChatOption = (option: string) => {
    console.log('Selected option:', option);
    setIsNewChatActive(false);
    
    // Handle different options
    switch (option) {
      case 'chat':
        console.log('Starting new chat');
        break;
      case 'group':
        console.log('Creating new group');
        break;
      case 'contact':
        console.log('Adding new contact');
        break;
      case 'community':
        console.log('Joining community');
        break;
      case 'broadcast':
        console.log('Creating broadcast list');
        break;
      case 'business':
        console.log('Starting business chat');
        break;
      default:
        break;
    }
  };

  // Handle more menu options
  const handleMoreMenuOption = (option: string) => {
    console.log('More menu option:', option);
    setShowMoreMenu(false);
    
    switch (option) {
      case 'select':
        handleSelectModeToggle();
        break;
      case 'read_all':
        setIsFilterActive(true);
        setActiveFilter('read_all');
        setIsSearchActive(false);
        setIsNewChatActive(false);
        setIsSelectMode(false);
        break;
      case 'favourite':
        setIsFilterActive(true);
        setActiveFilter('favourite');
        setIsSearchActive(false);
        setIsNewChatActive(false);
        setIsSelectMode(false);
        break;
      case 'unread':
        setIsFilterActive(true);
        setActiveFilter('unread');
        setIsSearchActive(false);
        setIsNewChatActive(false);
        setIsSelectMode(false);
        break;
      default:
        break;
    }
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
          ) : isSelectMode ? (
            <View style={styles.selectHeader}>
              <TouchableOpacity style={styles.searchBackButton} onPress={handleSelectModeToggle}>
                <Ionicons name="close" size={24} color="#1C1C1E" />
              </TouchableOpacity>
              <View style={styles.selectTitleContainer}>
                <Text style={styles.selectTitle}>
                  {selectedChats.length === 0 
                    ? 'Select Chats' 
                    : `${selectedChats.length} Selected`
                  }
                </Text>
              </View>
              <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
                <Text style={styles.selectAllText}>
                  {selectedChats.length === chats.length ? 'None' : 'All'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : isFilterActive ? (
            <View style={styles.filterHeader}>
              <TouchableOpacity style={styles.searchBackButton} onPress={handleFilterCancel}>
                <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
              </TouchableOpacity>
              <View style={styles.filterTitleContainer}>
                <Text style={styles.filterTitle}>
                  {activeFilter === 'unread' && 'Unread Chats'}
                  {activeFilter === 'favourite' && 'Favourite Chats'}
                  {activeFilter === 'read_all' && 'All Chats (Marked as Read)'}
                  {activeFilter === 'select' && 'Select Chats'}
                </Text>
              </View>
              <View style={styles.headerSpacer} />
            </View>
          ) : isNewChatActive ? (
            <View style={styles.newChatHeader}>
              <TouchableOpacity style={styles.searchBackButton} onPress={handleNewChatCancel}>
                <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
              </TouchableOpacity>
              <Text style={styles.newChatTitle}>New Chat</Text>
              <View style={styles.headerSpacer} />
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
        {isNewChatActive ? (
          /* New Chat Options */
          <ScrollView style={styles.newChatContent} showsVerticalScrollIndicator={false}>
            <View style={styles.newChatDescription}>
              <Text style={styles.newChatDescriptionText}>
                Choose how you'd like to start a new conversation
              </Text>
            </View>
            
            <View style={styles.newChatOptionsContainer}>
              {newChatOptions.map((option) => (
                <TouchableOpacity 
                  key={option.id}
                  style={styles.newChatOption}
                  onPress={() => handleNewChatOption(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.newChatOptionIcon, { backgroundColor: `${option.color}15` }]}>
                    <Ionicons name={option.icon as any} size={24} color={option.color} />
                  </View>
                  <View style={styles.newChatOptionText}>
                    <Text style={styles.newChatOptionTitle}>{option.title}</Text>
                    <Text style={styles.newChatOptionSubtitle}>{option.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : isSearchActive ? (
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
                  <TouchableOpacity 
                    key={chat.id} 
                    style={styles.chatItem} 
                    activeOpacity={0.7}
                    onPress={() => handleChatPress(chat)}
                  >
                    <ChatAvatar avatar={chat.avatar} name={chat.name} />
                    <View style={styles.chatContent}>
                      <View style={styles.chatHeader}>
                        <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                        <View style={styles.timeAndBadgeContainer}>
                          <Text style={styles.chatTime}>{chat.time}</Text>
                          {chat.hasNotification && (
                            <View style={styles.unreadBadge}>
                              <Text style={styles.unreadCount}>
                                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <View style={styles.messageRow}>
                        <Text style={styles.chatMessage} numberOfLines={1}>
                          {chat.message}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        ) : isFilterActive ? (
          /* Filter Mode - Show filtered results */
          <View style={styles.filterContainer}>
            <View style={styles.filterResultsHeader}>
              <Text style={styles.filterResultsTitle}>
                {displayChats.length} chat{displayChats.length !== 1 ? 's' : ''} 
                {activeFilter === 'unread' && ' with unread messages'}
                {activeFilter === 'favourite' && ' in favourites'}
                {activeFilter === 'read_all' && ' (all marked as read)'}
              </Text>
            </View>
            
            <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
              {displayChats.length === 0 ? (
                <View style={styles.emptyFilterState}>
                  <Ionicons 
                    name={
                      activeFilter === 'unread' ? 'mail-unread-outline' :
                      activeFilter === 'favourite' ? 'heart-outline' :
                      'checkmark-done-outline'
                    } 
                    size={80} 
                    color="#C7C7CC" 
                  />
                  <Text style={styles.emptyFilterText}>
                    {activeFilter === 'unread' && 'No unread chats'}
                    {activeFilter === 'favourite' && 'No favourite chats'}
                    {activeFilter === 'read_all' && 'No chats available'}
                  </Text>
                  <Text style={styles.emptyFilterSubtext}>
                    {activeFilter === 'unread' && 'All your chats are up to date'}
                    {activeFilter === 'favourite' && 'Add chats to favourites to see them here'}
                    {activeFilter === 'read_all' && 'All chats have been marked as read'}
                  </Text>
                </View>
              ) : (
                displayChats.map((chat) => (
                  <TouchableOpacity 
                    key={chat.id} 
                    style={styles.chatItem} 
                    activeOpacity={0.7}
                    onPress={() => handleChatPress(chat)}
                  >
                    <ChatAvatar avatar={chat.avatar} name={chat.name} />
                    <View style={styles.chatContent}>
                      <View style={styles.chatHeader}>
                        <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                        <View style={styles.timeAndBadgeContainer}>
                          <Text style={styles.chatTime}>{chat.time}</Text>
                          {chat.hasNotification && (
                            <View style={styles.unreadBadge}>
                              <Text style={styles.unreadCount}>
                                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <View style={styles.messageRow}>
                        <Text style={styles.chatMessage} numberOfLines={1}>
                          {chat.message}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        ) : (
          /* Normal Mode - Show stories and chats */
          <>
            {/* Stories Section */}
            <View style={styles.storiesSection}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.storiesContainer}
              >
                {/* Add Story Button */}
                <TouchableOpacity style={styles.addStoryContainer}>
                  <View style={styles.addStoryButton}>
                    <Ionicons name="add" size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.storyName}>Add story</Text>
                </TouchableOpacity>

                {/* Story Items */}
                {stories.map((story) => (
                  <TouchableOpacity key={story.id} style={styles.storyContainer}>
                    <View style={styles.storyImageContainer}>
                      <View style={styles.storyRing}>
                        <StoryAvatar story={story} />
                      </View>
                    </View>
                    <Text style={styles.storyName}>{story.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Chats Header */}
            <View style={styles.chatsHeader}>
              <Text style={styles.chatsTitle}>Chats</Text>
              {!isSelectMode && (
                <TouchableOpacity 
                  style={styles.moreButton}
                  onPress={() => setShowMoreMenu(true)}
                >
                  <MaterialIcons name="more-horiz" size={24} color="#1C1C1E" />
                </TouchableOpacity>
              )}
            </View>

            {/* Chat List */}
            <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
              {chats.map((chat) => (
                <TouchableOpacity 
                  key={chat.id} 
                  style={[
                    styles.chatItem,
                    isSelectMode && selectedChats.includes(chat.id) && styles.selectedChatItem
                  ]} 
                  activeOpacity={0.7}
                  onPress={() => handleChatPress(chat)}
                >
                  {isSelectMode && (
                    <View style={styles.radioButtonContainer}>
                      <View style={[
                        styles.radioButton,
                        selectedChats.includes(chat.id) && styles.radioButtonSelected
                      ]}>
                        {selectedChats.includes(chat.id) && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    </View>
                  )}
                  <ChatAvatar avatar={chat.avatar} name={chat.name} />
                  <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                      <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                      <View style={styles.timeAndBadgeContainer}>
                        <Text style={styles.chatTime}>{chat.time}</Text>
                        {chat.hasNotification && !isSelectMode && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadCount}>
                              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.messageRow}>
                      <Text style={styles.chatMessage} numberOfLines={1}>
                        {chat.message}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Bottom Navigation Component - Always visible except in select mode */}
        {!isSelectMode && <BottomNavigation onNewChatPress={handleNewChatPress} />}
        
        {/* Select Mode Action Bar */}
        {isSelectMode && selectedChats.length > 0 && (
          <View style={styles.selectActionBar}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleBulkAction('delete')}
            >
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleBulkAction('star')}
            >
              <Ionicons name="star-outline" size={24} color="#FF9500" />
              <Text style={[styles.actionButtonText, { color: '#FF9500' }]}>Star</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleBulkAction('mark_read')}
            >
              <Ionicons name="checkmark-done-outline" size={24} color="#007AFF" />
              <Text style={[styles.actionButtonText, { color: '#007AFF' }]}>Read</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleBulkAction('archive')}
            >
              <Ionicons name="archive-outline" size={24} color="#8E8E93" />
              <Text style={[styles.actionButtonText, { color: '#8E8E93' }]}>Archive</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>

      {/* More Options Menu */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showMoreMenu}
        onRequestClose={() => setShowMoreMenu(false)}
      >
        <TouchableOpacity 
          style={styles.moreMenuOverlay}
          activeOpacity={1}
          onPress={() => setShowMoreMenu(false)}
        >
          <View style={styles.moreMenuContent}>
            <TouchableOpacity 
              style={styles.moreMenuOption}
              onPress={() => handleMoreMenuOption('select')}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#1C1C1E" />
              <Text style={styles.moreMenuText}>Select chats</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moreMenuOption}
              onPress={() => handleMoreMenuOption('read_all')}
            >
              <Ionicons name="checkmark-done-outline" size={20} color="#1C1C1E" />
              <Text style={styles.moreMenuText}>Mark all as read</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moreMenuOption}
              onPress={() => handleMoreMenuOption('favourite')}
            >
              <Ionicons name="heart-outline" size={20} color="#1C1C1E" />
              <Text style={styles.moreMenuText}>Favourite chats</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.moreMenuOption, styles.lastMoreMenuOption]}
              onPress={() => handleMoreMenuOption('unread')}
            >
              <Ionicons name="mail-unread-outline" size={20} color="#1C1C1E" />
              <Text style={styles.moreMenuText}>Unread chats</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: 0.5,
  },
  searchButton: {
    padding: 8,
    borderRadius: 20,
  },

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

  // New Chat Header Styles
  newChatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  newChatTitle: {
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

  // Search Container
  searchContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // New Chat Content Styles
  newChatContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  newChatDescription: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  newChatDescriptionText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  newChatOptionsContainer: {
    paddingTop: 8,
  },
  newChatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  newChatOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  newChatOptionText: {
    flex: 1,
  },
  newChatOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  newChatOptionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
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

  // Filter Header Styles
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 32,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  // Filter Container
  filterContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  filterResultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterResultsTitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Empty Filter State
  emptyFilterState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyFilterText: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyFilterSubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 8,
    textAlign: 'center',
  },
  
  // Stories Section
  storiesSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  storiesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  addStoryContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 68,
  },
  addStoryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 68,
  },
  storyImageContainer: {
    marginBottom: 6,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  storyName: {
    fontSize: 11,
    color: '#1C1C1E',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 68,
  },

  // Chats Section
  chatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  chatsTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  moreButton: {
    padding: 8,
    borderRadius: 16,
  },
  
  chatsList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 4,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
    minHeight: 72,
  },
  chatAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 16,
  },
  chatContent: {
    flex: 1,
    height: 44,
    justifyContent: 'space-between',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 20,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 12,
    lineHeight: 20,
  },
  timeAndBadgeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 44,
    minWidth: 50,
  },
  chatTime: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    lineHeight: 16,
    height: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  chatMessage: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
    flex: 1,
    paddingRight: 60,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  
  // Avatar fallback styles
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
  
  // Story avatar fallback styles
  storyAvatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  storyAvatarInitials: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // More Menu Styles
  moreMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  moreMenuContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 120,
    marginRight: 20,
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  moreMenuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  lastMoreMenuOption: {
    borderBottomWidth: 0,
  },
  moreMenuText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
    fontWeight: '500',
  },

  // Select Mode Styles
  selectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 12,
  },
  selectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  selectAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  selectedChatItem: {
    backgroundColor: '#F0F8FF',
  },
  radioButtonContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
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

  // Select Action Bar Styles
  selectActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 60,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default ChatInterface;