import Context from '@/models/Context'
import { InlineKeyboard } from 'grammy'

export default async function sendAudio(ctx: Context, fileId: string) {
  const keyboard = new InlineKeyboard().text(
    ctx.i18n.t('audio_delete'),
    'deleteAudio'
  )

  return ctx.replyWithAudio(fileId, {
    reply_markup: keyboard,
  })
}
