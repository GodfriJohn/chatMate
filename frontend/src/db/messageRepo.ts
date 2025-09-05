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
 * Get all messages for a chat by chat ID (sorted newest first)
 * This function name matches the import in chatService.ts
 */
export async function getMessagesByChatId(chatId: string): Promise<MessageRow[]> {
  try {
    console.log("📚 getMessagesByChatId for chat:", chatId);
    const messages = await query<MessageRow>(
      `SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt ASC`,
      [chatId]
    );
    console.log("✅ Found", messages.length, "messages for chat:", chatId);
    return messages;
  } catch (err) {
    console.error("❌ getMessagesByChatId failed:", err);
    return [];
  }
}

/**
 * Get all messages for a chat (sorted newest first) - Alternative function name
 * Keeping this for backward compatibility
 */
export async function getMessagesByChat(chatId: string): Promise<MessageRow[]> {
  return getMessagesByChatId(chatId);
}

/**
 * Get all pending (unsent) messages
 */
export async function getPendingMessages(): Promise<MessageRow[]> {
  try {
    console.log("📤 Getting pending messages...");
    const messages = await query<MessageRow>(
      `SELECT * FROM messages WHERE status = 'pending' ORDER BY createdAt ASC`
    );
    console.log("✅ Found", messages.length, "pending messages");
    return messages;
  } catch (err) {
    console.error("❌ getPendingMessages failed:", err);
    return [];
  }
}

/**
 * Mark a message as sent (after server ack)
 */
export async function markMessageSent(clientId: string, serverId: string): Promise<void> {
  try {
    console.log("✅ Marking message as sent:", clientId, "->", serverId);
    await exec(
      `UPDATE messages SET status = 'sent', serverId = ? WHERE clientId = ?`,
      [serverId, clientId]
    );
    console.log("✅ markMessageSent success for:", clientId);
  } catch (err) {
    console.error("❌ markMessageSent failed:", err);
    throw err;
  }
}

/**
 * Mark a message as failed
 */
export async function markMessageFailed(clientId: string): Promise<void> {
  try {
    console.log("❌ Marking message as failed:", clientId);
    await exec(`UPDATE messages SET status = 'failed' WHERE clientId = ?`, [clientId]);
    console.log("✅ markMessageFailed success for:", clientId);
  } catch (err) {
    console.error("❌ markMessageFailed failed:", err);
    throw err;
  }
}

/**
 * Get failed messages for retry functionality
 */
export async function getFailedMessages(): Promise<MessageRow[]> {
  try {
    console.log("🔄 Getting failed messages for retry...");
    const messages = await query<MessageRow>(
      `SELECT * FROM messages WHERE status = 'failed' ORDER BY createdAt ASC`
    );
    console.log("✅ Found", messages.length, "failed messages");
    return messages;
  } catch (err) {
    console.error("❌ getFailedMessages failed:", err);
    return [];
  }
}

/**
 * Delete a message by clientId
 */
export async function deleteMessage(clientId: string): Promise<void> {
  try {
    console.log("🗑️ Deleting message:", clientId);
    await exec(`DELETE FROM messages WHERE clientId = ?`, [clientId]);
    console.log("✅ deleteMessage success for:", clientId);
  } catch (err) {
    console.error("❌ deleteMessage failed:", err);
    throw err;
  }
}