import Context from '@/models/Context'
import sendAudio from '@/handlers/sendAudio'
import * as schema from '@/db/schema'

export default async function handleAddAudio(ctx: Context) {
  const fileId = ctx.msg.audio.file_id

  if (!ctx.dbuser.selectedPlaylistId) return

  await ctx.api.deleteMessage(ctx.chat.id, ctx.msg.message_id).catch(() => {})
  const audioMessage = await sendAudio(ctx, fileId)

  await ctx.db.insert(schema.audios).values({
    playlistId: ctx.dbuser.selectedPlaylistId,
    fileId: fileId,
    messageId: audioMessage.message_id,
  })
}
