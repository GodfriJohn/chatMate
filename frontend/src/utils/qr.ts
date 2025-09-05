// src/api/qr.ts
export type QrPayload = { 
  v: 1; 
  uid: string;
  name?: string;
  username?: string;
  timestamp: number;
};

/**
 * Generate a QR code string with user data
 */
export const makeQrString = (uid: string, name?: string, username?: string): string =>
  JSON.stringify({ 
    v: 1, 
    uid,
    name,
    username,
    timestamp: Date.now()
  } as QrPayload);

/**
 * Parse and validate a scanned QR code string
 */
export const parseQrString = (raw: string): QrPayload => {
  try {
    const data = JSON.parse(raw);
    
    // Validate required fields
    if (!data?.uid || typeof data.uid !== 'string') {
      throw new Error('Invalid QR: missing or invalid uid');
    }
    
    // Validate version if present
    if (data.v && data.v !== 1) {
      throw new Error('Invalid QR: unsupported version');
    }
    
    // Return standardized payload
    return {
      v: 1,
      uid: data.uid,
      name: data.name || null,
      username: data.username || null,
      timestamp: data.timestamp || Date.now()
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid QR: malformed JSON');
    }
    throw error;
  }
};