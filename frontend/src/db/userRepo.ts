// src/db/userRepo.ts
import { query, exec } from './sqlite';

export type UserRow = {
  uid: string;
  username: string;
  displayName?: string;
  phone?: string;
  email?: string;
  photoURL?: string;
  createdAt: number;
  updatedAt: number;
};

/**
 * Save or update user profile in SQLite
 */
export async function saveUserProfile(user: Omit<UserRow, 'createdAt' | 'updatedAt'> & { 
  createdAt?: number; 
  updatedAt?: number; 
}): Promise<void> {
  try {
    console.log("💾 saveUserProfile called with:", user.uid);
    const now = Date.now();
    await exec(
      `INSERT OR REPLACE INTO users 
        (uid, username, displayName, phone, email, photoURL, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.uid,
        user.username,
        user.displayName ?? null,
        user.phone ?? null,
        user.email ?? null,
        user.photoURL ?? null,
        user.createdAt ?? now,
        user.updatedAt ?? now,
      ]
    );
    console.log("✅ saveUserProfile success:", user.uid);
  } catch (err) {
    console.error("❌ saveUserProfile failed:", err);
    throw err;
  }
}

/**
 * Get user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserRow | null> {
  try {
    console.log("📚 getUserProfile for:", uid);
    const users = await query<UserRow>(
      `SELECT * FROM users WHERE uid = ? LIMIT 1`,
      [uid]
    );
    const user = users.length > 0 ? users[0] : null;
    console.log("✅ Found user:", user ? user.username : 'not found');
    return user;
  } catch (err) {
    console.error("❌ getUserProfile failed:", err);
    return null;
  }
}

/**
 * Update user profile fields
 */
export async function updateUserProfile(uid: string, updates: Partial<Omit<UserRow, 'uid' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  try {
    console.log("🔄 updateUserProfile for:", uid, updates);
    
    const fields = [];
    const values = [];
    
    if (updates.username !== undefined) {
      fields.push('username = ?');
      values.push(updates.username);
    }
    if (updates.displayName !== undefined) {
      fields.push('displayName = ?');
      values.push(updates.displayName);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updates.phone);
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.photoURL !== undefined) {
      fields.push('photoURL = ?');
      values.push(updates.photoURL);
    }
    
    if (fields.length === 0) {
      console.log("⚠️ No fields to update");
      return;
    }
    
    fields.push('updatedAt = ?');
    values.push(Date.now());
    values.push(uid);
    
    await exec(
      `UPDATE users SET ${fields.join(', ')} WHERE uid = ?`,
      values
    );
    
    console.log("✅ updateUserProfile success");
  } catch (err) {
    console.error("❌ updateUserProfile failed:", err);
    throw err;
  }
}

/**
 * Get user by username (for search functionality)
 */
export async function getUserByUsername(username: string): Promise<UserRow | null> {
  try {
    const users = await query<UserRow>(
      `SELECT * FROM users WHERE username = ? LIMIT 1`,
      [username]
    );
    return users.length > 0 ? users[0] : null;
  } catch (err) {
    console.error("❌ getUserByUsername failed:", err);
    return null;
  }
}

/**
 * Search users by username pattern
 */
export async function searchUsersByUsername(pattern: string): Promise<UserRow[]> {
  try {
    const users = await query<UserRow>(
      `SELECT * FROM users WHERE username LIKE ? ORDER BY username ASC LIMIT 20`,
      [`%${pattern}%`]
    );
    return users;
  } catch (err) {
    console.error("❌ searchUsersByUsername failed:", err);
    return [];
  }
}