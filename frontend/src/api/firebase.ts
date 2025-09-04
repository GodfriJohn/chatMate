// src/api/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// ⬇️ Replace with the Web app config from Firebase Console (Project settings → Your apps → Web)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcgAawm3bL1zokTeCGBVqUdOt-gcpFPu8",
  authDomain: "exchat-83d02.firebaseapp.com",
  projectId: "exchat-83d02",
  storageBucket: "exchat-83d02.firebasestorage.app",
  messagingSenderId: "66606634710",
  appId: "1:66606634710:web:8b11cf1eb7aff898b0db77",
  measurementId: "G-9E4PDNGF5E"
};

const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Firestore instance
// Auto-detect long-polling helps React Native environments avoid connectivity quirks
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
