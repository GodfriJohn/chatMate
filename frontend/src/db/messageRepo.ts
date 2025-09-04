// import db from './sqlite';

// export type Message = {
//   id: string;
//   chatId: string;
//   fromUid: string;
//   text: string;
//   createdAt: number; // timestamp (ms)
// };

// // Save a message to SQLite
// export const saveMessage = (message: Message) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `INSERT OR REPLACE INTO messages (id, chatId, fromUid, text, createdAt)
//        VALUES (?, ?, ?, ?, ?);`,
//       [message.id, message.chatId, message.fromUid, message.text, message.createdAt]
//     );
//   });
// };

// // Get all messages for a chat
// export const getMessages = (chatId: string): Promise<Message[]> => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         `SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt ASC;`,
//         [chatId],
//         (_, result) => {
//           const rows: Message[] = result.rows._array;
//           resolve(rows);
//         },
//         (_, error) => {
//           reject(error);
//           return false;
//         }
//       );
//     });
//   });
// };
