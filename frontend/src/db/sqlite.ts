// src/db/sqlite.ts
import * as SQLite from 'expo-sqlite';

// Open synchronously
export const db = SQLite.openDatabaseSync('chatmate.db');

type SQLResultRow = { [key: string]: any };

export async function query<T = SQLResultRow>(sql: string, params: any[] = []): Promise<T[]> {
  const rows = await db.getAllAsync<T>(sql, params);
  return rows;
}

export async function exec(sql: string, params: any[] = []): Promise<void> {
  try {
    console.log("📜 exec SQL:", sql, "params:", params);
    await db.runAsync(sql, params);
    console.log("✅ exec success");
  } catch (err) {
    console.error("❌ exec failed:", sql, params, err);
    throw err;
  }
}

export async function initSQLite() {
  // Messages table (existing)
  await exec(`
    CREATE TABLE IF NOT EXISTS messages (
      clientId   TEXT PRIMARY KEY,
      serverId   TEXT UNIQUE,
      chatId     TEXT NOT NULL,
      fromUid    TEXT NOT NULL,
      text       TEXT,
      createdAt  INTEGER,
      status     TEXT NOT NULL CHECK (status IN ('pending','sent','failed'))
    )
  `);

  await exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_chat_created 
    ON messages(chatId, createdAt DESC)
  `);

  // 🆕 Chats table for offline persistence
  await exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      pairKey TEXT NOT NULL UNIQUE,
      participants TEXT NOT NULL,
      createdAt INTEGER,
      lastUpdated INTEGER,
      lastMessageText TEXT,
      lastMessageFrom TEXT,
      lastMessageCreatedAt INTEGER,
      syncStatus TEXT DEFAULT 'synced' CHECK (syncStatus IN ('synced', 'pending', 'failed'))
    )
  `);

  await exec(`
    CREATE INDEX IF NOT EXISTS idx_chats_lastUpdated 
    ON chats(lastUpdated DESC)
  `);

  await exec(`
    CREATE INDEX IF NOT EXISTS idx_chats_pairKey 
    ON chats(pairKey)
  `);
}