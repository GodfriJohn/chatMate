// src/db/contactRepo.ts
import { query, exec } from './sqlite';

export type ContactRow = {
  id?: number;
  uid: string;
  contactUid: string;
  contactUsername?: string;
  contactDisplayName?: string;
  addedAt: number;
};

/**
 * Add a contact for a user
 */
export async function addContact(contact: Omit<ContactRow, 'id' | 'addedAt'> & { addedAt?: number }): Promise<void> {
  try {
    console.log("👥 addContact called:", contact);
    await exec(
      `INSERT OR REPLACE INTO contacts 
        (uid, contactUid, contactUsername, contactDisplayName, addedAt)
       VALUES (?, ?, ?, ?, ?)`,
      [
        contact.uid,
        contact.contactUid,
        contact.contactUsername ?? null,
        contact.contactDisplayName ?? null,
        contact.addedAt ?? Date.now(),
      ]
    );
    console.log("✅ addContact success");
  } catch (err) {
    console.error("❌ addContact failed:", err);
    throw err;
  }
}

/**
 * Get all contacts for a user
 */
export async function getContacts(uid: string): Promise<ContactRow[]> {
  try {
    console.log("📚 getContacts for user:", uid);
    const contacts = await query<ContactRow>(
      `SELECT * FROM contacts WHERE uid = ? ORDER BY addedAt DESC`,
      [uid]
    );
    console.log("✅ Found", contacts.length, "contacts");
    return contacts;
  } catch (err) {
    console.error("❌ getContacts failed:", err);
    return [];
  }
}

/**
 * Get contact info for a specific user
 */
export async function getContact(uid: string, contactUid: string): Promise<ContactRow | null> {
  try {
    const contacts = await query<ContactRow>(
      `SELECT * FROM contacts WHERE uid = ? AND contactUid = ? LIMIT 1`,
      [uid, contactUid]
    );
    return contacts.length > 0 ? contacts[0] : null;
  } catch (err) {
    console.error("❌ getContact failed:", err);
    return null;
  }
}

/**
 * Update contact information
 */
export async function updateContact(uid: string, contactUid: string, updates: {
  contactUsername?: string;
  contactDisplayName?: string;
}): Promise<void> {
  try {
    console.log("🔄 updateContact:", uid, contactUid, updates);
    
    const fields = [];
    const values = [];
    
    if (updates.contactUsername !== undefined) {
      fields.push('contactUsername = ?');
      values.push(updates.contactUsername);
    }
    if (updates.contactDisplayName !== undefined) {
      fields.push('contactDisplayName = ?');
      values.push(updates.contactDisplayName);
    }
    
    if (fields.length === 0) {
      console.log("⚠️ No fields to update");
      return;
    }
    
    values.push(uid, contactUid);
    
    await exec(
      `UPDATE contacts SET ${fields.join(', ')} WHERE uid = ? AND contactUid = ?`,
      values
    );
    
    console.log("✅ updateContact success");
  } catch (err) {
    console.error("❌ updateContact failed:", err);
    throw err;
  }
}

/**
 * Remove a contact
 */
export async function removeContact(uid: string, contactUid: string): Promise<void> {
  try {
    console.log("🗑️ removeContact:", uid, contactUid);
    await exec(
      `DELETE FROM contacts WHERE uid = ? AND contactUid = ?`,
      [uid, contactUid]
    );
    console.log("✅ removeContact success");
  } catch (err) {
    console.error("❌ removeContact failed:", err);
    throw err;
  }
}