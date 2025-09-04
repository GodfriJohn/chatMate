// src/api/authService.ts
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  signInAnonymously,
  User,
  signOut,
} from "firebase/auth";

/**
 * Ensures we have a logged-in user (anonymous).
 * Returns the Firebase UID.
 */
export async function ensureAnonLogin(): Promise<string> {
  // If already logged in, return immediately
  if (auth.currentUser?.uid) return auth.currentUser.uid;

  // Try to restore current user first (wait briefly for auth to hydrate)
  const existing = await waitForAuthUserOnce();
  if (existing?.uid) return existing.uid;

  // Otherwise sign in anonymously
  const cred = await signInAnonymously(auth);
  return cred.user.uid;
}

/** Sign out helper (not required now, but handy) */
export async function logout() {
  await signOut(auth);
}

/** Utilities */
function waitForAuthUserOnce(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}
