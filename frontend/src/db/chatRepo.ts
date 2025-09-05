import { query, exec } from './sqlite';

export type ChatRow = {
  id: string;
  pairKey: string;
  participants: string;
  createdAt: number;
  lastUpdated: number;
  lastMessageText?: string | null;
  lastMessageFrom?: string | null;
  lastMessageCreatedAt?: number | null;
  syncStatus: 'pending' | 'synced';
  peerUsername?: string | null;
  peerDisplayName?: string | null;
};

export async function saveChat(chat: ChatRow): Promise<void> {
  await exec(
    `INSERT OR REPLACE INTO chats (
      id, pairKey, participants, createdAt, lastUpdated,
      lastMessageText, lastMessageFrom, lastMessageCreatedAt,
      syncStatus, peerUsername, peerDisplayName
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      chat.id,
      chat.pairKey,
      chat.participants,
      chat.createdAt,
      chat.lastUpdated,
      chat.lastMessageText ?? null,
      chat.lastMessageFrom ?? null,
      chat.lastMessageCreatedAt ?? null,
      chat.syncStatus,
      chat.peerUsername ?? null,
      chat.peerDisplayName ?? null,
    ]
  );
}

export async function getAllChats(me: string): Promise<ChatRow[]> {
  return query<ChatRow>(
    `SELECT * FROM chats WHERE participants LIKE ? ORDER BY lastUpdated DESC`,
    [`%${me}%`]
  );
}

export async function getChatByPairKey(pairKey: string): Promise<ChatRow | null> {
  const rows = await query<ChatRow>(`SELECT * FROM chats WHERE pairKey = ? LIMIT 1`, [pairKey]);
  return rows[0] || null;
}

export async function updateChatLastMessage(
  id: string,
  text: string,
  from: string,
  createdAt: number
): Promise<void> {
  await exec(
    `UPDATE chats SET
      lastMessageText = ?,
      lastMessageFrom = ?,
      lastMessageCreatedAt = ?,
      lastUpdated = ?
     WHERE id = ?`,
    [text, from, createdAt, Date.now(), id]
  );
}

export async function getPendingChats(): Promise<ChatRow[]> {
  return query<ChatRow>(`SELECT * FROM chats WHERE syncStatus = 'pending'`);
}
