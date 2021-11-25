import Context from '@/models/Context'
import { InlineKeyboard } from 'grammy'

export default function sendMenu(ctx: Context) {
  return ctx.reply(
    ctx.i18n.t('menu', {
      playlistAmount: ctx.dbuser.playlists.length,
      plural: ctx.dbuser.playlists.length === 1 ? '' : 's',
    }),
    {
      reply_markup: getMainKeyboard(ctx),
    }
  )
}

function getMainKeyboard(ctx: Context): InlineKeyboard {
  const keyboard = new InlineKeyboard()

  for (let i = 0; i < ctx.dbuser.playlists.length; i++) {
    keyboard.text(ctx.dbuser.playlists[i].name, `select-${i}`).row()
  }
  keyboard.text(ctx.i18n.t('playlist_add_button'), 'playlist-add')

  return keyboard
}
