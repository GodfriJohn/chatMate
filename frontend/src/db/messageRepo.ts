import { query, exec } from './sqlite';

export type MessageRow = {
  clientId: string;
  serverId?: string;
  chatId: string;
  fromUid: string;
  text: string;
  createdAt: number; // store as timestamp (ms since epoch)
  status: 'pending' | 'sent' | 'failed';
};

/**
 * Save or update a message in SQLite
 */
export async function saveMessage(msg: MessageRow): Promise<void> {
  try {
    console.log("💾 saveMessage called with:", msg);
    await exec(
      `INSERT OR REPLACE INTO messages 
        (clientId, serverId, chatId, fromUid, text, createdAt, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        msg.clientId,
        msg.serverId ?? null,
        msg.chatId,
        msg.fromUid,
        msg.text,
        msg.createdAt,
        msg.status,
      ]
    );
    console.log("✅ saveMessage success:", msg.clientId);
  } catch (err) {
    console.error("❌ saveMessage failed:", err);
    throw err;
  }
}


/**
 * Get all messages for a chat (sorted newest first)
 */
export async function getMessagesByChat(chatId: string): Promise<MessageRow[]> {
  return query<MessageRow>(
    `SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt DESC`,
    [chatId]
  );
}

/**
 * Get all pending (unsent) messages
 */
export async function getPendingMessages(): Promise<MessageRow[]> {
  return query<MessageRow>(
    `SELECT * FROM messages WHERE status = 'pending' ORDER BY createdAt ASC`
  );
}

/**
 * Mark a message as sent (after server ack)
 */
export async function markMessageSent(clientId: string, serverId: string): Promise<void> {
  await exec(
    `UPDATE messages SET status = 'sent', serverId = ? WHERE clientId = ?`,
    [serverId, clientId]
  );
}

/**
 * Mark a message as failed
 */
export async function markMessageFailed(clientId: string): Promise<void> {
  await exec(`UPDATE messages SET status = 'failed' WHERE clientId = ?`, [clientId]);
}
