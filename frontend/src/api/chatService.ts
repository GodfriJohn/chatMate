// src/api/chatService.ts
import 'react-native-get-random-values';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
  saveChat,
  getAllChats,
  getChatByPairKey,
  updateChatLastMessage,
  getPendingChats,
  ChatRow,
} from '../db/chatRepo';
import {
  saveMessage,
  markMessageSent,
  markMessageFailed,
  getMessagesByChatId,
  getPendingMessages,   // ✅ added
} from '../db/messageRepo';
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore();
const auth = getAuth();
const chatsCol = collection(db, 'chats');
const pairKeyOf = (a: string, b: string) => [a, b].sort().join('__');

// In-memory cache to prevent duplicate requests
const chatCreationCache = new Map<string, Promise<string>>();

// ---------------------- Chat creation ----------------------

export async function createOrGetChat(peerUid: string): Promise<string> {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error('Not signed in');
  if (me === peerUid) throw new Error('Cannot chat with yourself');

  const key = pairKeyOf(me, peerUid);
  console.log('Chat pair key:', key);

  // Check SQLite first
  const localChat = await getChatByPairKey(key);
  if (localChat) {
    console.log('Found chat in SQLite:', localChat.id);
    syncChatWithServer(localChat); // non-blocking
    return localChat.id;
  }

  if (chatCreationCache.has(key)) {
    console.log('Chat creation already in progress, waiting...');
    return await chatCreationCache.get(key)!;
  }

  const chatCreationPromise = createOrGetChatInternal(key, me, peerUid);
  chatCreationCache.set(key, chatCreationPromise);

  try {
    return await chatCreationPromise;
  } finally {
    setTimeout(() => chatCreationCache.delete(key), 5000);
  }
}

async function createOrGetChatInternal(key: string, me: string, peerUid: string): Promise<string> {
  try {
    const q = query(chatsCol, where('pairKey', '==', key), limit(1));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const existingChat = snap.docs[0];
      const chatData = existingChat.data();

      await saveChat({
        id: existingChat.id,
        pairKey: key,
        participants: JSON.stringify([me, peerUid]),
        createdAt: chatData.createdAt?.toMillis() || Date.now(),
        lastUpdated: chatData.lastUpdated?.toMillis() || Date.now(),
        lastMessageText: chatData.lastMessage?.text || null,
        lastMessageFrom: chatData.lastMessage?.from || null,
        lastMessageCreatedAt: chatData.lastMessage?.createdAt?.toMillis() || null,
        syncStatus: 'synced',
      });

      return existingChat.id;
    }

    // Create new chat in Firestore
    const docRef = await addDoc(chatsCol, {
      pairKey: key,
      participants: [me, peerUid],
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      lastMessage: null,
    });

    await saveChat({
      id: docRef.id,
      pairKey: key,
      participants: JSON.stringify([me, peerUid]),
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      syncStatus: 'synced',
    });

    return docRef.id;
  } catch (error) {
    console.error('Failed to create chat online, creating offline:', error);

    const offlineChatId = uuidv4();
    await saveChat({
      id: offlineChatId,
      pairKey: key,
      participants: JSON.stringify([me, peerUid]),
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      syncStatus: 'pending',
    });

    return offlineChatId;
  }
}

// ---------------------- Sending messages ----------------------

export async function sendMessage(chatId: string, text: string) {
  const me = auth.currentUser?.uid;
  if (!me) return;

  const clientId = uuidv4();
  const createdAtLocal = Date.now();

  await saveMessage({
    clientId,
    chatId,
    fromUid: me,
    text,
    createdAt: createdAtLocal,
    status: 'pending',
  });

  try {
    const msgsCol = collection(db, 'chats', chatId, 'messages');
    const timestamp = serverTimestamp();

    const docRef = await addDoc(msgsCol, {
      from: me,
      text,
      createdAt: timestamp,
      clientId,
    });

    await updateDoc(doc(db, 'chats', chatId), {
      lastUpdated: timestamp,
      lastMessage: { from: me, text, createdAt: timestamp },
    });

    await markMessageSent(clientId, docRef.id);
    await updateChatLastMessage(chatId, text, me, createdAtLocal);

    console.log('Message sent successfully');
  } catch (err) {
    console.error('Firestore sendMessage failed:', err);
    await markMessageFailed(clientId);
    await updateChatLastMessage(chatId, text, me, createdAtLocal);
  }
}

// ---------------------- Listening ----------------------

export function listenForMessages(chatId: string, onUpdate: (messages: any[]) => void) {
  const msgsCol = collection(db, 'chats', chatId, 'messages');
  const q = query(msgsCol, orderBy('createdAt', 'asc'));

  return onSnapshot(
    q,
    (snap) => {
      const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onUpdate(messages);
    },
    async () => {
      console.log('⚠️ Falling back to SQLite messages for chat:', chatId);
      try {
        const localMessages = await getMessagesByChatId(chatId);
        const transformed = localMessages.map((msg) => ({
          id: msg.serverId || msg.clientId,
          text: msg.text,
          from: msg.fromUid,
          clientId: msg.clientId,
          createdAt: {
            toMillis: () => msg.createdAt,
            toDate: () => new Date(msg.createdAt),
          },
          status: msg.status,
        }));
        onUpdate(transformed);
      } catch {
        onUpdate([]);
      }
    }
  );
}

export function listenForMyChats(onUpdate: (chats: any[]) => void) {
  const me = auth.currentUser?.uid;
  if (!me) return () => {};

  loadChatsFromSQLite(me, onUpdate);

  const q = query(chatsCol, where('participants', 'array-contains', me), orderBy('lastUpdated', 'desc'));

  return onSnapshot(
    q,
    async (snap) => {
      const firestoreChats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      for (const chat of firestoreChats) {
        try {
          await saveChat({
            id: chat.id,
            pairKey: chat.pairKey,
            participants: JSON.stringify(chat.participants),
            createdAt: chat.createdAt?.toMillis() || Date.now(),
            lastUpdated: chat.lastUpdated?.toMillis() || Date.now(),
            lastMessageText: chat.lastMessage?.text || null,
            lastMessageFrom: chat.lastMessage?.from || null,
            lastMessageCreatedAt: chat.lastMessage?.createdAt?.toMillis() || null,
            syncStatus: 'synced',
          });
        } catch (err) {
          console.error('Failed to save chat to SQLite:', err);
        }
      }

      onUpdate(firestoreChats);
    },
    async () => {
      console.log('⚠️ Falling back to SQLite chats');
      await loadChatsFromSQLite(me, onUpdate);
    }
  );
}

// ---------------------- Helpers ----------------------

async function loadChatsFromSQLite(me: string, onUpdate: (chats: any[]) => void) {
  try {
    const sqliteChats = await getAllChats(me);
    const transformed = sqliteChats.map((chat) => ({
      id: chat.id,
      pairKey: chat.pairKey,
      participants: JSON.parse(chat.participants),
      createdAt: {
        toMillis: () => chat.createdAt,
        toDate: () => new Date(chat.createdAt),
      },
      lastUpdated: {
        toMillis: () => chat.lastUpdated,
        toDate: () => new Date(chat.lastUpdated),
      },
      lastMessage: chat.lastMessageText
        ? {
            text: chat.lastMessageText,
            from: chat.lastMessageFrom,
            createdAt: {
              toMillis: () => chat.lastMessageCreatedAt || 0,
              toDate: () => new Date(chat.lastMessageCreatedAt || 0),
            },
          }
        : null,
    }));
    onUpdate(transformed);
  } catch {
    onUpdate([]);
  }
}

async function syncChatWithServer(localChat: ChatRow) {
  if (localChat.syncStatus === 'synced') return;

  try {
    const q = query(chatsCol, where('pairKey', '==', localChat.pairKey), limit(1));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const serverChatId = snap.docs[0].id;
      await saveChat({ ...localChat, id: serverChatId, syncStatus: 'synced' });
      return;
    }

    const docRef = await addDoc(chatsCol, {
      pairKey: localChat.pairKey,
      participants: JSON.parse(localChat.participants),
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      lastMessage: null,
    });

    await saveChat({ ...localChat, id: docRef.id, syncStatus: 'synced' });
  } catch (err) {
    console.error('Failed to sync chat:', err);
  }
}

async function syncMessageWithServer(message: any) {
  try {
    const msgsCol = collection(db, 'chats', message.chatId, 'messages');
    const timestamp = serverTimestamp();

    const docRef = await addDoc(msgsCol, {
      from: message.fromUid,
      text: message.text,
      createdAt: timestamp,
      clientId: message.clientId,
    });

    await updateDoc(doc(db, 'chats', message.chatId), {
      lastUpdated: timestamp,
      lastMessage: { from: message.fromUid, text: message.text, createdAt: timestamp },
    });

    await markMessageSent(message.clientId, docRef.id);
    await updateChatLastMessage(message.chatId, message.text, message.fromUid, message.createdAt);
  } catch (err) {
    console.error('Failed to sync message:', err);
    await markMessageFailed(message.clientId);
  }
}

// ---------------------- Background sync ----------------------

export async function syncPendingData() {
  try {
    console.log('🔄 Starting background sync...');

    const pendingChats = await getPendingChats();
    for (const chat of pendingChats) {
      await syncChatWithServer(chat);
    }

    const pendingMessages = await getPendingMessages();
    for (const msg of pendingMessages) {
      await syncMessageWithServer(msg);
    }

    console.log('✅ Background sync completed');
  } catch (err) {
    console.error('Background sync failed:', err);
  }
}
