import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  language: text('language').notNull().default('en'),
  state: text('state').notNull().default('main_menu'),
  selectedPlaylistId: integer('selected_playlist_id'),
  selectedPage: integer('selected_page').notNull().default(0),
  lastPlaylistActiveTimestamp: integer('last_playlist_active_timestamp'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const playlists = sqliteTable('playlists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
})

export const audios = sqliteTable('audios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  playlistId: integer('playlist_id')
    .notNull()
    .references(() => playlists.id, { onDelete: 'cascade' }),
  messageId: integer('message_id').notNull(),
  fileId: text('file_id').notNull(),
})

export const lastBotMessages = sqliteTable('last_bot_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  messageId: integer('message_id').notNull(),
})

export const usersRelations = relations(users, ({ many, one }) => ({
  playlists: many(playlists),
  lastBotMessages: many(lastBotMessages),
  selectedPlaylist: one(playlists, {
    fields: [users.selectedPlaylistId],
    references: [playlists.id],
  }),
}))

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
  user: one(users, {
    fields: [playlists.userId],
    references: [users.id],
  }),
  audios: many(audios),
}))

export const audiosRelations = relations(audios, ({ one }) => ({
  playlist: one(playlists, {
    fields: [audios.playlistId],
    references: [playlists.id],
  }),
}))

export const lastBotMessagesRelations = relations(
  lastBotMessages,
  ({ one }) => ({
    user: one(users, {
      fields: [lastBotMessages.userId],
      references: [users.id],
    }),
  })
)
