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
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ChatConversation = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const {
    id,
    chatName,
    chatAvatar,
    hasNotification,
    unreadCount
  } = params;

  const [message, setMessage] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Dummy chat data
  const chatInfo = {
    name: 'Angel Curtis',
    avatar: null, // Using null to show fallback avatar
    isOnline: true,
    lastSeen: 'last seen today at 14:23',
  };

  // Message type for type safety
  type MessageStatusType = 'read' | 'delivered' | 'sent' | null;
  type Message = {
    id: number;
    text: string;
    time: string;
    isMe: boolean;
    status: MessageStatusType;
  };

  // Dummy messages with read status - Updated last message to delivered, others to read
  const messages: Message[] = [
    {
      id: 1,
      text: 'Hey! How are you doing?',
      time: '14:20',
      isMe: false,
      status: null, // Received messages don't have status
    },
    {
      id: 2,
      text: 'Hi Angel! I\'m doing great, thanks for asking. How about you?',
      time: '14:21',
      isMe: true,
      status: 'read', // Changed to read (double blue tick)
    },
    {
      id: 3,
      text: 'I\'m good too! Please help me find a good monitor for my setup. Do you have any recommendations?',
      time: '14:22',
      isMe: false,
      status: null,
    },
    {
      id: 4,
      text: 'Sure! What\'s your budget and what will you be using it for?',
      time: '14:23',
      isMe: true,
      status: 'read', // Changed to read (double blue tick)
    },
    {
      id: 5,
      text: 'Around $300-400 and mainly for coding and some gaming',
      time: '14:23',
      isMe: false,
      status: null,
    },
    {
      id: 6,
      text: 'Great! I\'d recommend looking at the ASUS VG249Q or the LG 27GN750-B. Both are excellent for coding with good color accuracy and decent gaming performance.',
      time: '14:24',
      isMe: true,
      status: 'delivered', // Last message is only delivered (double gray tick)
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
      '#007AFF', '#007AFF', '#007AFF', '#007AFF', '#007AFF',
      '#007AFF', '#007AFF', '#007AFF', '#007AFF', '#007AFF'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Component to render avatar with fallback
  type ChatAvatarProps = {
    avatar: string | null;
    name: string;
    size?: number;
  };

  const ChatAvatar = ({ avatar, name, size = 40 }: ChatAvatarProps) => {
    if (avatar) {
      return (
        <Image 
          source={{ uri: avatar }} 
          style={[styles.headerAvatar, { width: size, height: size, borderRadius: size / 2 }]}
        />
      );
    }
    
    // Fallback to initials
    return (
      <View style={[styles.headerAvatar, styles.avatarFallback, { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: getAvatarColor(name) 
      }]}>
        <Text style={[styles.avatarInitials, { fontSize: size * 0.4 }]}>
          {getInitials(name)}
        </Text>
      </View>
    );
  };

  // Component to render message status ticks
  const MessageStatus = ({ status }: { status: 'sent' | 'delivered' | 'read' | null }) => {
    if (status === 'sent') {
      return <Ionicons name="checkmark" size={16} color="#8E8E93" style={styles.statusIcon} />;
    } else if (status === 'delivered') {
      return (
        <View style={styles.doubleCheck}>
          <Ionicons name="checkmark" size={16} color="#8E8E93" style={[styles.statusIcon, styles.firstCheck]} />
          <Ionicons name="checkmark" size={16} color="#8E8E93" style={[styles.statusIcon, styles.secondCheck]} />
        </View>
      );
    } else if (status === 'read') {
      return (
        <View style={styles.doubleCheck}>
          <Ionicons name="checkmark" size={16} color="#007AFF" style={[styles.statusIcon, styles.firstCheck]} />
          <Ionicons name="checkmark" size={16} color="#007AFF" style={[styles.statusIcon, styles.secondCheck]} />
        </View>
      );
    }
    return null;
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      // Add logic to send message
      setMessage('');
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  // Handle more menu options
  const handleMoreMenuOption = (option: 'clear' | 'star' | 'select' | 'block') => {
    console.log('More menu option:', option);
    setShowMoreMenu(false);
    
    switch (option) {
      case 'clear':
        console.log('Clear chat');
        break;
      case 'star':
        console.log('Star messages');
        break;
      case 'select':
        console.log('Select messages');
        break;
      case 'block':
        console.log('Block contact');
        break;
      default:
        break;
    }
  };

  // Handle attachment options
  const handleAttachOption = (option: 'camera' | 'gallery' | 'audio' | 'document' | 'contact' | 'location') => {
    console.log('Attach option:', option);
    setShowAttachMenu(false);
    
    switch (option) {
      case 'camera':
        console.log('Open camera');
        break;
      case 'gallery':
        console.log('Open gallery');
        break;
      case 'audio':
        console.log('Record audio');
        break;
      case 'document':
        console.log('Select document');
        break;
      case 'contact':
        console.log('Share contact');
        break;
      case 'location':
        console.log('Share location');
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
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
            </TouchableOpacity>
            
            <ChatAvatar avatar={chatInfo.avatar} name={chatInfo.name} size={40} />
            
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>{chatInfo.name}</Text>
              <Text style={styles.headerStatus}>
                {chatInfo.isOnline ? 'Online' : chatInfo.lastSeen}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="videocam-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="call-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowMoreMenu(true)}
            >
              <MaterialIcons name="more-vert" size={24} color="#1C1C1E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <KeyboardAvoidingView 
          style={styles.messagesContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View 
                key={msg.id} 
                style={[
                  styles.messageContainer,
                  msg.isMe ? styles.myMessageContainer : styles.theirMessageContainer
                ]}
              >
                <View 
                  style={[
                    styles.messageBubble,
                    msg.isMe ? styles.myMessageBubble : styles.theirMessageBubble
                  ]}
                >
                  <Text 
                    style={[
                      styles.messageText,
                      msg.isMe ? styles.myMessageText : styles.theirMessageText
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <View style={styles.messageFooter}>
                    <Text 
                      style={[
                        styles.messageTime,
                        msg.isMe ? styles.myMessageTime : styles.theirMessageTime
                      ]}
                    >
                      {msg.time}
                    </Text>
                    {msg.isMe && msg.status && <MessageStatus status={msg.status} />}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TouchableOpacity 
                style={styles.attachButton}
                onPress={() => setShowAttachMenu(true)}
              >
                <Ionicons name="add" size={24} color="#8E8E93" />
              </TouchableOpacity>
              
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                placeholderTextColor="#8E8E93"
                multiline
                maxLength={1000}
              />
              
              {message.trim() ? (
                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                >
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <View style={styles.rightButtons}>
                  <TouchableOpacity style={styles.micButton}>
                    <Ionicons name="mic-outline" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cameraButton}>
                    <Ionicons name="camera-outline" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
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
              onPress={() => handleMoreMenuOption('clear')}
            >
              <Ionicons name="trash-outline" size={20} color="#1C1C1E" />
              <Text style={styles.moreMenuText}>Clear chat</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moreMenuOption}
              onPress={() => handleMoreMenuOption('star')}
            >
              <Ionicons name="star-outline" size={20} color="#1C1C1E" />
              <Text style={styles.moreMenuText}>Star messages</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moreMenuOption}
              onPress={() => handleMoreMenuOption('select')}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#1C1C1E" />
              <Text style={styles.moreMenuText}>Select messages</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.moreMenuOption, styles.lastMoreMenuOption]}
              onPress={() => handleMoreMenuOption('block')}
            >
              <Ionicons name="ban-outline" size={20} color="#FF3B30" />
              <Text style={[styles.moreMenuText, styles.dangerText]}>Block contact</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Attachment Menu */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAttachMenu}
        onRequestClose={() => setShowAttachMenu(false)}
      >
        <View style={styles.attachMenuOverlay}>
          <View style={styles.attachMenuContent}>
            <View style={styles.attachMenuGrid}>
              <TouchableOpacity 
                style={styles.attachOption}
                onPress={() => handleAttachOption('camera')}
              >
                <View style={[styles.attachIconContainer, { backgroundColor: '#007AFF' }]}>
                  <Ionicons name="camera" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.attachOptionText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.attachOption}
                onPress={() => handleAttachOption('gallery')}
              >
                <View style={[styles.attachIconContainer, { backgroundColor: '#007AFF' }]}>
                  <Ionicons name="image" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.attachOptionText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.attachOption}
                onPress={() => handleAttachOption('audio')}
              >
                <View style={[styles.attachIconContainer, { backgroundColor: '#007AFF' }]}>
                  <Ionicons name="musical-notes" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.attachOptionText}>Audio</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.attachOption}
                onPress={() => handleAttachOption('document')}
              >
                <View style={[styles.attachIconContainer, { backgroundColor: '#007AFF' }]}>
                  <Ionicons name="document-text" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.attachOptionText}>Document</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.attachOption}
                onPress={() => handleAttachOption('contact')}
              >
                <View style={[styles.attachIconContainer, { backgroundColor: '#007AFF' }]}>
                  <Ionicons name="person" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.attachOptionText}>Contact</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.attachOption}
                onPress={() => handleAttachOption('location')}
              >
                <View style={[styles.attachIconContainer, { backgroundColor: '#007AFF' }]}>
                  <Ionicons name="location" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.attachOptionText}>Location</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.attachCancelButton}
              onPress={() => setShowAttachMenu(false)}
            >
              <Text style={styles.attachCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    lineHeight: 22,
  },
  headerStatus: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
    borderRadius: 20,
  },

  // Messages Styles
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    marginVertical: 4,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  theirMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    position: 'relative',
  },
  myMessageBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#1C1C1E',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  messageTime: {
    fontSize: 11,
    marginRight: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  theirMessageTime: {
    color: '#8E8E93',
  },
  statusIcon: {
    marginLeft: -2,
  },
  doubleCheck: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  firstCheck: {
    marginRight: -8,
  },
  secondCheck: {
    marginLeft: -8,
  },

  // Input Styles
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F2F2F7',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  attachButton: {
    padding: 8,
    marginLeft: 4,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
    textAlignVertical: 'center',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 4,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  micButton: {
    padding: 8,
    marginRight: 4,
  },
  cameraButton: {
    padding: 8,
    marginRight: 4,
  },

  // More Menu Styles - Updated width
  moreMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 12,
  },

  moreMenuContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    position: "absolute",
    top: 10,
    right: 10,
    width: 180, // Changed from 160 to 180
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },

  moreMenuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  lastMoreMenuOption: {
    borderBottomWidth: 0,
  },
  moreMenuText: {
    fontSize: 15,
    color: '#1C1C1E',
    marginLeft: 10,
    fontWeight: '500',
  },
  dangerText: {
    color: '#FF3B30',
  },

  // Attachment Menu Styles
  attachMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  attachMenuContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  attachMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  attachOption: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
  },
  attachIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  attachOptionText: {
    fontSize: 14,
    color: '#1C1C1E',
    textAlign: 'center',
    fontWeight: '500',
  },
  attachCancelButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  attachCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
});

export default ChatConversation;