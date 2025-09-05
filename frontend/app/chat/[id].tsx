import React, { useState, useEffect } from 'react';
import { sendMessage, listenForMessages } from '../../src/api/chatService';
import { auth } from '../../src/api/firebase';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ChatConversation = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, chatName, chatAvatar } = params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);

  const currentUser = auth.currentUser;

 useEffect(() => {
 if (!currentUser || !id) return;
  const cId = String(id);
  setChatId(cId);

  const unsubscribe = listenForMessages(cId, (msgs) => {
    console.log("🔥 Firestore messages:", msgs);
    const formatted = msgs.map((m) => ({
      ...m,
      createdAt: m.createdAt?.toDate ? m.createdAt.toDate() : null,
    }));
    setMessages(formatted);
  });
  return unsubscribe;
}, [currentUser, id]);


  const handleSendMessage = async () => {
  console.log("handleSendMessage called");

  if (!chatId) {
    console.warn("❌ No chatId, cannot send");
    return;
  }
  if (!currentUser) {
    console.warn("❌ No currentUser, cannot send");
    return;
  }
  if (!message.trim()) {
    console.warn("❌ Empty message");
    return;
  }

  console.log("Sending message:", message, "chatId:", chatId, "from:", currentUser.uid);
  await sendMessage(chatId, message.trim());
  setMessage('');
};


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{chatName}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="videocam-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="call-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
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
            {messages.map((msg) => {
              const isMe = msg.from === currentUser?.uid;
              const time = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageContainer,
                    isMe ? styles.myMessageContainer : styles.theirMessageContainer,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isMe ? styles.myMessageBubble : styles.theirMessageBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isMe ? styles.myMessageText : styles.theirMessageText,
                      ]}
                    >
                      {msg.text}
                    </Text>
                    <View style={styles.messageFooter}>
                      <Text
                        style={[
                          styles.messageTime,
                          isMe ? styles.myMessageTime : styles.theirMessageTime,
                        ]}
                      >
                        {time}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#8E8E93"
              multiline
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  safeArea: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
    borderRadius: 20,
  },

  // Messages
  messagesContainer: { flex: 1 },
  messagesList: { flex: 1 },
  messagesContent: { padding: 16 },
  messageContainer: { marginVertical: 4 },
  myMessageContainer: { alignItems: 'flex-end' },
  theirMessageContainer: { alignItems: 'flex-start' },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 16,
  },
  myMessageBubble: { backgroundColor: '#007AFF' },
  theirMessageBubble: { backgroundColor: '#E5E5EA' },
  messageText: { fontSize: 16 },
  myMessageText: { color: '#fff' },
  theirMessageText: { color: '#000' },
  messageFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  messageTime: { fontSize: 11, color: '#888' },
  myMessageTime: { color: 'rgba(255, 255, 255, 0.7)' },
  theirMessageTime: { color: '#8E8E93' },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
  },
  messageInput: { flex: 1, fontSize: 16, padding: 8 },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
  },
});

export default ChatConversation;

