// src/api/qr.ts

// One canonical payload for v1
export type QrPayloadV1 = {
  v: 1;
  uid: string;
  username?: string;
  name?: string;
  ts?: number; // optional timestamp
};

// Build the payload you’ll embed in the QR
export function buildQrPayload(input: {
  uid: string;
  username?: string;
  name?: string;
}): QrPayloadV1 {
  if (!input.uid) throw new Error("QR: uid is required");
  return { v: 1, uid: input.uid, username: input.username, name: input.name, ts: Date.now() };
}

// Stringify for the QR component
export function encodeQrPayload(p: QrPayloadV1): string {
  return JSON.stringify(p);
}

// Parse + validate scanned QR string
export function parseQrPayload(raw: string): QrPayloadV1 {
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("QR: invalid JSON");
  }
  if (!data || typeof data !== "object") throw new Error("QR: invalid object");
  if (data.v !== 1) throw new Error("QR: unsupported version");
  if (typeof data.uid !== "string" || !data.uid) throw new Error("QR: missing uid");
  // optional fields
  if (data.username && typeof data.username !== "string") delete data.username;
  if (data.name && typeof data.name !== "string") delete data.name;
  return data as QrPayloadV1;
}
