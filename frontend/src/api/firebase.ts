// src/api/firebase.ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeFirestore } from "firebase/firestore";

// ⬇️ Replace with the Web app config from Firebase Console (Project settings → Your apps → Web)
const firebaseConfig = {
  apiKey: "AIzaSyAcgAawm3bL1zokTeCGBVqUdOt-gcpFPu8",
  authDomain: "exchat-83d02.firebaseapp.com",
  projectId: "exchat-83d02",
  storageBucket: "exchat-83d02.firebasestorage.app",
  messagingSenderId: "66606634710",
  appId: "1:66606634710:web:8b11cf1eb7aff898b0db77",
  measurementId: "G-9E4PDNGF5E"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Auth instance with persistence (keeps UID stable across restarts & offline)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Firestore instance
// Long-polling helps avoid React Native networking issues (esp. on Android/emulators)
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
