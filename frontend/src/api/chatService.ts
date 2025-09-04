


// src/api/chatService.ts
import { db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  where,
} from 'firebase/firestore';

/**
 * Create or get a chat between two users
 */
export const createChat = async (uid1: string, uid2: string) => {
  const chatId = [uid1, uid2].sort().join('_'); // unique chatId
  const chatRef = doc(db, 'chats', chatId);

  const chatSnap = await getDoc(chatRef);
  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      users: [uid1, uid2],
      createdAt: serverTimestamp(),
    });
  }

  return chatId;
};

/**
 * Send a message in a chat
 */
export const sendMessage = async (
  chatId: string,
  fromUid: string,
  text: string
) => {
  if (!text.trim()) return;

  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, {
    from: fromUid,
    text,
    createdAt: serverTimestamp(),
  });
};

/**
 * Listen for messages in real-time
 */
export const listenForMessages = (
  chatId: string,
  callback: (messages: any[]) => void
) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(msgs);
  });
};

/**
 * Listen for chats in real-time
 */

export const listenForChats = (userId: string, callback: (chats: any[]) => void) => {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(chats);
  });
};