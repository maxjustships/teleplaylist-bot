import Context from '@/models/Context'
import { State } from '@/models/User'
import { Keyboard } from 'grammy'

export default async function sendMenu(ctx: Context) {
  ctx.dbuser.state = State.MainMenu
  await ctx.dbuser.save()

  const playlistAmount = ctx.dbuser.playlists.length
  return ctx.reply(
    ctx.i18n.t('main_menu', {
      playlistAmount,
      plural: playlistAmount === 1 ? '' : 's',
      mainInfo:
        playlistAmount === 0
          ? ctx.i18n.t('main_menu_info_empty')
          : ctx.i18n.t('main_menu_info'),
    }),
    {
      reply_markup: getMainKeyboard(ctx),
    }
  )
}

const PLAYLIST_PER_PAGE = 3

function getMainKeyboard(ctx: Context): Keyboard {
  const keyboard = new Keyboard()

  const serviceButtons = [
    ctx.i18n.t('main_menu_keyboard_left'),
    `1/${Math.ceil(ctx.dbuser.playlists.length / PLAYLIST_PER_PAGE)}`,
    ctx.i18n.t('main_menu_keyboard_right'),
    ctx.i18n.t('playlist_add_button'),
  ]

  for (let i = 0; i < PLAYLIST_PER_PAGE; i++) {
    keyboard.text(ctx.dbuser.playlists[i].name).row()
  }

  for (let serviceButton of serviceButtons) {
    keyboard.text(serviceButton)
  }

  return keyboard
}
