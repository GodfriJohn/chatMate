// src/api/authService.ts
import { auth } from "./firebase";
import { signInAnonymously } from "firebase/auth";
import { saveUserProfile, getUserProfile } from "../db/userRepo";

/**
 * Ensures there is a logged-in Firebase user and initializes their profile.
 * - If a user is already restored via persistence, reuse it and ensure profile exists.
 * - Otherwise, sign in anonymously, create profile, and return the UID.
 */
export async function ensureAnonLogin(): Promise<string> {
  let currentUser = auth.currentUser;
  
  // ✅ If Firebase already restored a user (persistence), just return it
  if (currentUser) {
    console.log("🔑 Using existing Firebase user:", currentUser.uid);
    await ensureUserProfile(currentUser);
    return currentUser.uid;
  }

  // ✅ If no user, sign in anonymously
  const result = await signInAnonymously(auth);
  currentUser = result.user;
  console.log("🆕 Signed in anonymously:", currentUser.uid);

  // Create initial profile for new user
  await ensureUserProfile(currentUser);

  return currentUser.uid;
}

/**
 * Ensures the user has a profile in SQLite database
 */
async function ensureUserProfile(user: any): Promise<void> {
  try {
    // Check if profile already exists
    const existingProfile = await getUserProfile(user.uid);
    
    if (!existingProfile) {
      console.log("📝 Creating initial profile for user:", user.uid);
      
      // Generate a default username based on UID
      const defaultUsername = `user${user.uid.slice(-6)}`;
      
      // Create default profile
      await saveUserProfile({
        uid: user.uid,
        username: defaultUsername,
        displayName: user.displayName || defaultUsername,
        phone: '',
        email: user.email || '',
        photoURL: user.photoURL || '',
      });
      
      console.log("✅ Initial profile created with username:", defaultUsername);
    } else {
      console.log("✅ User profile already exists:", existingProfile.username);
    }
  } catch (error) {
    console.error("❌ Failed to ensure user profile:", error);
  }
}