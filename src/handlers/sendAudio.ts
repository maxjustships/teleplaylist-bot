import { InlineKeyboard } from 'grammy'
import Context from '@/models/Context'

export default function sendAudio(ctx: Context, fileId: string) {
  const keyboard = new InlineKeyboard().text(
    ctx.i18n.t('audio_delete'),
    'deleteAudio'
  )

  return ctx.replyWithAudio(fileId, {
    reply_markup: keyboard,
  })
}
