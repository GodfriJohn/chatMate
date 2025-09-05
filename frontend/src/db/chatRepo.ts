// src/db/chatRepo.ts
import { query, exec } from './sqlite';

export type ChatRow = {
  id: string;
  pairKey: string;
  participants: string; // JSON string of array
  createdAt: number;
  lastUpdated: number;
  lastMessageText?: string;
  lastMessageFrom?: string;
  lastMessageCreatedAt?: number;
  syncStatus: 'synced' | 'pending' | 'failed';
};

/**
 * Save or update a chat in SQLite
 */
export async function saveChat(chat: Omit<ChatRow, 'syncStatus'> & { syncStatus?: ChatRow['syncStatus'] }): Promise<void> {
  try {
    console.log("💾 saveChat called with:", chat.id);
    await exec(
      `INSERT OR REPLACE INTO chats 
        (id, pairKey, participants, createdAt, lastUpdated, lastMessageText, lastMessageFrom, lastMessageCreatedAt, syncStatus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        chat.id,
        chat.pairKey,
        chat.participants,
        chat.createdAt,
        chat.lastUpdated,
        chat.lastMessageText ?? null,
        chat.lastMessageFrom ?? null,
        chat.lastMessageCreatedAt ?? null,
        chat.syncStatus ?? 'synced',
      ]
    );
    console.log("✅ saveChat success:", chat.id);
  } catch (err) {
    console.error("❌ saveChat failed:", err);
    throw err;
  }
}

/**
 * Get all chats for current user (sorted by lastUpdated DESC)
 */
export async function getAllChats(currentUid: string): Promise<ChatRow[]> {
  try {
    console.log("📚 getAllChats for user:", currentUid);
    const chats = await query<ChatRow>(
      `SELECT * FROM chats WHERE participants LIKE ? ORDER BY lastUpdated DESC`,
      [`%"${currentUid}"%`]
    );
    console.log("✅ Found", chats.length, "chats in SQLite");
    return chats;
  } catch (err) {
    console.error("❌ getAllChats failed:", err);
    return [];
  }
}

/**
 * Get a specific chat by ID
 */
export async function getChatById(chatId: string): Promise<ChatRow | null> {
  try {
    const chats = await query<ChatRow>(
      `SELECT * FROM chats WHERE id = ? LIMIT 1`,
      [chatId]
    );
    return chats.length > 0 ? chats[0] : null;
  } catch (err) {
    console.error("❌ getChatById failed:", err);
    return null;
  }
}

/**
 * Get a chat by pairKey
 */
export async function getChatByPairKey(pairKey: string): Promise<ChatRow | null> {
  try {
    const chats = await query<ChatRow>(
      `SELECT * FROM chats WHERE pairKey = ? LIMIT 1`,
      [pairKey]
    );
    return chats.length > 0 ? chats[0] : null;
  } catch (err) {
    console.error("❌ getChatByPairKey failed:", err);
    return null;
  }
}

/**
 * Update last message info for a chat
 */
export async function updateChatLastMessage(
  chatId: string,
  lastMessageText: string,
  lastMessageFrom: string,
  lastMessageCreatedAt: number
): Promise<void> {
  try {
    await exec(
      `UPDATE chats SET 
        lastUpdated = ?, 
        lastMessageText = ?, 
        lastMessageFrom = ?, 
        lastMessageCreatedAt = ?
       WHERE id = ?`,
      [Date.now(), lastMessageText, lastMessageFrom, lastMessageCreatedAt, chatId]
    );
    console.log("✅ Updated last message for chat:", chatId);
  } catch (err) {
    console.error("❌ updateChatLastMessage failed:", err);
    throw err;
  }
}

/**
 * Mark chat as pending sync (when created offline)
 */
export async function markChatPendingSync(chatId: string): Promise<void> {
  try {
    await exec(
      `UPDATE chats SET syncStatus = 'pending' WHERE id = ?`,
      [chatId]
    );
  } catch (err) {
    console.error("❌ markChatPendingSync failed:", err);
    throw err;
  }
}

/**
 * Mark chat as synced
 */
export async function markChatSynced(chatId: string): Promise<void> {
  try {
    await exec(
      `UPDATE chats SET syncStatus = 'synced' WHERE id = ?`,
      [chatId]
    );
  } catch (err) {
    console.error("❌ markChatSynced failed:", err);
    throw err;
  }
}

/**
 * Get all chats that need syncing
 */
export async function getPendingChats(): Promise<ChatRow[]> {
  try {
    return await query<ChatRow>(
      `SELECT * FROM chats WHERE syncStatus = 'pending' ORDER BY createdAt ASC`
    );
  } catch (err) {
    console.error("❌ getPendingChats failed:", err);
    return [];
  }
}