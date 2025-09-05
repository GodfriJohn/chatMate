// src/api/authService.ts
import { auth } from "./firebase";
import { signInAnonymously } from "firebase/auth";

/**
 * Ensures there is a logged-in Firebase user.
 * - If a user is already restored via persistence, reuse it.
 * - Otherwise, sign in anonymously and return the UID.
 */
export async function ensureAnonLogin(): Promise<string> {
  // ✅ If Firebase already restored a user (persistence), just return it
  if (auth.currentUser) {
    console.log("🔑 Using existing Firebase user:", auth.currentUser.uid);
    return auth.currentUser.uid;
  }

  // ✅ If no user, sign in anonymously
  const result = await signInAnonymously(auth);
  console.log("🆕 Signed in anonymously:", result.user.uid);

  return result.user.uid;
}
