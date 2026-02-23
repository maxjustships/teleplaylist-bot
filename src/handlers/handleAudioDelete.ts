import Context from '@/models/Context'
import * as schema from '@/db/schema'
import { and, eq } from 'drizzle-orm'

export default async function handleDeleteAudio(ctx: Context) {
  if (!ctx.callbackQuery?.message) return
  const messageId = ctx.callbackQuery.message.message_id as number

  if (!ctx.dbuser.selectedPlaylistId) return

  await ctx.db
    .delete(schema.audios)
    .where(
      and(
        eq(schema.audios.playlistId, ctx.dbuser.selectedPlaylistId),
        eq(schema.audios.messageId, messageId)
      )
    )

  await ctx.api.deleteMessage(ctx.chat.id, messageId)
}
