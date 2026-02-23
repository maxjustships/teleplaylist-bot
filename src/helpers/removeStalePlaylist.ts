import sendMenu from '@/handlers/handleMenu'
import handlePlaylistBack from '@/handlers/handlePlaylistBack'
import { Bot } from 'grammy'
import { translate } from '@/helpers/i18n'
import Context, { Env } from '@/models/Context'
import { State } from '@/models/User'
import * as schema from '@/db/schema'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { and, lt, eq } from 'drizzle-orm'

const PLAYLIST_OPEN_TOO_LONG_MS = 36 * 60 * 60 * 1000 // 36 hours

export default async function removeStalePlaylists(
  db: DrizzleD1Database<typeof schema>,
  bot: Bot<Context>,
  env: Env
) {
  const hours36Ago = Date.now() - PLAYLIST_OPEN_TOO_LONG_MS

  const usersWithStalePlaylists = await db.query.users.findMany({
    where: and(
      eq(schema.users.state, State.PlaylistMenu),
      lt(schema.users.lastPlaylistActiveTimestamp, hours36Ago)
    ),
    with: {
      playlists: {
        with: {
          audios: true,
        },
      },
      lastBotMessages: true,
    },
  })

  for (const user of usersWithStalePlaylists) {
    const fakeContext = {
      dbuser: user,
      db,
      env,
      t: (id: string, args?: any) => translate(user.language, id, args),
      useLocale: async () => {}, // No-op
      reply: (
        text: string,
        other?: Parameters<typeof bot.api.sendMessage>[2]
      ) => bot.api.sendMessage(user.id, text, other),
      api: bot.api,
      chat: {
        id: user.id,
        type: 'private',
      },
      from: {
        id: user.id,
        is_bot: false,
        first_name: 'User',
      },
    } as unknown as Context

    await handlePlaylistBack(fakeContext)
    await sendMenu(fakeContext)
  }
}
