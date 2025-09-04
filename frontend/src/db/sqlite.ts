// import * as SQLite from 'expo-sqlite';

// // instead of SQLite.openDatabase()
// const db = SQLite.openDatabase('messageRepo.db');

// // Initialize tables
// export const initDB = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS messages (
//         id TEXT PRIMARY KEY NOT NULL,
//         chatId TEXT NOT NULL,
//         fromUid TEXT NOT NULL,
//         text TEXT,
//         createdAt INTEGER
//       );`
//     );
//   });
// };

// export default db;
