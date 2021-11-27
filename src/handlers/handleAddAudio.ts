import Context from '@/models/Context'
import { Audio } from '@/models/User'
import { loadPlaylist } from './handlePlaylistLoad'
import { InlineKeyboard } from 'grammy'

export async function handleAddAudio(ctx: Context) {
  const messageId = ctx.msg.message_id
  const fileId = ctx.msg.audio.file_id

  const keyboard = new InlineKeyboard().text(
    ctx.i18n.t('audio_delete'),
    'deleteAudio'
  )

  const audioMessage = await ctx.replyWithAudio(fileId, {
    reply_markup: keyboard,
  })

  const audio = new Audio()
  audio.fileId = fileId
  audio.messageId = audioMessage.message_id

  ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].audio.push(audio)
  await ctx.dbuser.save()
  return ctx.reply(ctx.i18n.t('audio_add'))
}
