import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id:          text('id').primaryKey(),
  username:    text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  avatarPath:  text('avatar_path'),
  pinHash:     text('pin_hash').notNull(),
  status:      text('status', { enum: ['online', 'offline', 'away'] }).notNull().default('offline'),
  lastSeen:    text('last_seen').notNull().default(sql`(datetime('now'))`),
  createdAt:   text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const sessions = sqliteTable('sessions', {
  id:         text('id').primaryKey(),
  userId:     text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token:      text('token').notNull().unique(),
  deviceInfo: text('device_info').notNull().default(''),
  createdAt:  text('created_at').notNull().default(sql`(datetime('now'))`),
  expiresAt:  text('expires_at').notNull(),
});
