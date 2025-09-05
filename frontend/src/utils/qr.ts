// src/api/qr.ts
export type QrPayload = { v: 1; uid: string };

export const makeQrString = (uid: string) =>
  JSON.stringify({ v: 1, uid } as QrPayload);

/** Safe parse with basic validation */
export const parseQrString = (raw: string): QrPayload => {
  const data = JSON.parse(raw);
  if (!data?.uid || typeof data.uid !== 'string') throw new Error('Invalid QR');
  return { v: 1, uid: data.uid };
};
