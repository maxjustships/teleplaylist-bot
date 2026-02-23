import { eq } from 'drizzle-orm'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from '@/db/schema'
import { DbUser } from '@/models/Context'

export enum State {
  MainMenu = 'main_menu',
  PlaylistMenu = 'playlist_menu',
  AwaitingName = 'awaiting_playlist_name',
  AwaitingLanguage = 'awaiting_language',
  AwaitingPlaylistDeletion = 'awaiting_playlist_deletion',
  AwaitingPlaylistRename = 'awaiting_playlist_rename',
}

export async function fetchUser(
  db: DrizzleD1Database<typeof schema>,
  id: number
): Promise<DbUser | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
    with: {
      playlists: {
        with: {
          audios: true,
        },
      },
      lastBotMessages: true,
    },
  })
  return user as DbUser | undefined
}

export async function findOrCreateUser(
  db: DrizzleD1Database<typeof schema>,
  id: number
): Promise<DbUser> {
  let user = await fetchUser(db, id)

  if (!user) {
    await db.insert(schema.users).values({ id }).onConflictDoNothing()
    user = (await fetchUser(db, id))!
  }

  return user
}

export async function updateUser(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  data: Partial<typeof schema.users.$inferInsert>
) {
  await db
    .update(schema.users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.users.id, userId))
}
