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
} from 'firebase/firestore';
import 'react-native-get-random-values';

import { saveMessage, markMessageSent, markMessageFailed } from '../db/messageRepo';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

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
 * → Save to SQLite first
 * → Try sending to Firestore
 */
export const sendMessage = async (
  chatId: string,
  fromUid: string,
  text: string
) => {
  console.log("🚀 sendMessage function entered", { chatId, fromUid, text });

  if (!text.trim()) {
    console.log("⚠️ Empty message, skipping");
    return;
  }

  const clientId = uuidv4();
  const createdAt = Date.now();

  try {
     console.log("💾 About to call saveMessage...");
    console.log("💾 Saving message to SQLite:", { clientId, chatId, fromUid, text });
    await saveMessage({
      clientId,
      chatId,
      fromUid,
      text,
      createdAt,
      status: 'pending',
    });
     console.log("✅ saveMessage finished");
  } catch (err) {
    console.error("❌ SQLite saveMessage failed:", err);
  }

  try {
    console.log("📌 Preparing Firestore path:", `chats/${chatId}/messages`);
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const docRef = await addDoc(messagesRef, {
      from: fromUid,
      text,
      createdAt: serverTimestamp(),
      clientId,
    });
    console.log("✅ Firestore message stored:", docRef.id);

    await markMessageSent(clientId, docRef.id);
    console.log("✅ SQLite updated to 'sent'");
  } catch (err) {
    console.error("❌ Firestore sendMessage failed:", err);
    await markMessageFailed(clientId);
  }
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
