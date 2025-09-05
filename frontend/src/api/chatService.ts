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

const db = getFirestore();
const auth = getAuth();
const chatsCol = collection(db, 'chats');
const pairKeyOf = (a: string, b: string) => [a, b].sort().join('__');

export async function createOrGetChat(peerUid: string): Promise<string> {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error('Not signed in');
  if (me === peerUid) throw new Error('Cannot chat with yourself');

  const key = pairKeyOf(me, peerUid);

  // 1) Find existing
  const q = query(chatsCol, where('pairKey', '==', key), limit(1));
  const snap = await getDocs(q);
  if (!snap.empty) return snap.docs[0].id;

  // 2) Otherwise create
  const docRef = await addDoc(chatsCol, {
    pairKey: key,
    participants: [me, peerUid],
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
    lastMessage: null,
  });
  return docRef.id;
}

export async function sendMessage(chatId: string, text: string) {
  const me = auth.currentUser?.uid;
  if (!me) return;
  const msgsCol = collection(db, 'chats', chatId, 'messages');
  const createdAt = serverTimestamp();

  await addDoc(msgsCol, { from: me, text, createdAt });

  await updateDoc(doc(db, 'chats', chatId), {
    lastUpdated: serverTimestamp(),
    lastMessage: { from: me, text, createdAt },
  });
}

export function listenForMessages(chatId: string, onUpdate: (messages: any[]) => void) {
  const msgsCol = collection(db, 'chats', chatId, 'messages');
  const q = query(msgsCol, orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    onUpdate(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function listenForMyChats(onUpdate: (chats: any[]) => void) {
  const me = auth.currentUser?.uid;
  if (!me) return () => {};
  const q = query(
    chatsCol,
    where('participants', 'array-contains', me),
    orderBy('lastUpdated', 'desc')
  );
  return onSnapshot(q, (snap) => {
    onUpdate(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}







// // src/api/chatService.ts
// import { db } from './firebase';
// import {
//   collection,
//   addDoc,
//   doc,
//   setDoc,
//   getDoc,
//   onSnapshot,
//   serverTimestamp,
//   query,
//   orderBy,
// } from 'firebase/firestore';
// import 'react-native-get-random-values';

// import { saveMessage, markMessageSent, markMessageFailed } from '../db/messageRepo';
// import { v4 as uuidv4 } from 'uuid'; // npm install uuid

// /**
//  * Create or get a chat between two users
//  */
// export const createChat = async (uid1: string, uid2: string) => {
//   const chatId = [uid1, uid2].sort().join('_'); // unique chatId
//   const chatRef = doc(db, 'chats', chatId);

//   const chatSnap = await getDoc(chatRef);
//   if (!chatSnap.exists()) {
//     await setDoc(chatRef, {
//       users: [uid1, uid2],
//       createdAt: serverTimestamp(),
//     });
//   }

//   return chatId;
// };

// /**
//  * Send a message in a chat
//  * → Save to SQLite first
//  * → Try sending to Firestore
//  */
// export const sendMessage = async (
//   chatId: string,
//   fromUid: string,
//   text: string
// ) => {
//   console.log("🚀 sendMessage function entered", { chatId, fromUid, text });

//   if (!text.trim()) {
//     console.log("⚠️ Empty message, skipping");
//     return;
//   }

//   const clientId = uuidv4();
//   const createdAt = Date.now();

//   try {
//      console.log("💾 About to call saveMessage...");
//     console.log("💾 Saving message to SQLite:", { clientId, chatId, fromUid, text });
//     await saveMessage({
//       clientId,
//       chatId,
//       fromUid,
//       text,
//       createdAt,
//       status: 'pending',
//     });
//      console.log("✅ saveMessage finished");
//   } catch (err) {
//     console.error("❌ SQLite saveMessage failed:", err);
//   }

//   try {
//     console.log("📌 Preparing Firestore path:", `chats/${chatId}/messages`);
//     const messagesRef = collection(db, 'chats', chatId, 'messages');
//     const docRef = await addDoc(messagesRef, {
//       from: fromUid,
//       text,
//       createdAt: serverTimestamp(),
//       clientId,
//     });
//     console.log("✅ Firestore message stored:", docRef.id);

//     await markMessageSent(clientId, docRef.id);
//     console.log("✅ SQLite updated to 'sent'");
//   } catch (err) {
//     console.error("❌ Firestore sendMessage failed:", err);
//     await markMessageFailed(clientId);
//   }
// };


// /**
//  * Listen for messages in real-time
//  */
// export const listenForMessages = (
//   chatId: string,
//   callback: (messages: any[]) => void
// ) => {
//   const messagesRef = collection(db, 'chats', chatId, 'messages');
//   const q = query(messagesRef, orderBy('createdAt', 'asc'));

//   return onSnapshot(q, (snapshot) => {
//     const msgs = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     callback(msgs);
//   });
// };
