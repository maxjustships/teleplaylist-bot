import { Audio } from '@/models/User'
import Context from '@/models/Context'
import sendAudio from '@/handlers/sendAudio'

export default async function handleAddAudio(ctx: Context) {
  const fileId = ctx.msg.audio.file_id

  const audioMessage = await sendAudio(ctx, fileId)

  const audio = new Audio()
  audio.fileId = fileId
  audio.messageId = audioMessage.message_id

  ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].audio.push(audio)
  return ctx.dbuser.save()
}
