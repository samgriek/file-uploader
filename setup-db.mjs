// setup-db.mjs
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
  const db = await open({
    filename: './tokens.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      token TEXT PRIMARY KEY,
      status TEXT,
      create_time DATETIME,
      expire_time DATETIME
    )
  `);

  await db.close();
})();
