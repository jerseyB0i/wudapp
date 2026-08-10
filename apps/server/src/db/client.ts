import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema/index.js';

const DB_PATH = process.env.DATABASE_PATH ?? './wudapp.db';

const sqlite = new Database(DB_PATH);

// WAL mode + performance pragmas
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('synchronous = NORMAL');
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('cache_size = -32000'); // 32MB cache
sqlite.pragma('temp_store = MEMORY');

export const db = drizzle(sqlite, { schema });
export type DB = typeof db;
