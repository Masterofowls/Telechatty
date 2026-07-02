import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
  username: text('username').unique().notNull(),
  contactEmail: text('contact_email'),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
});

export type ProfileRow = typeof profiles.$inferSelect;
export type NewProfileRow = typeof profiles.$inferInsert;
