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
}
