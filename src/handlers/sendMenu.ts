import Context from '@/models/Context'
import { State } from '@/models/User'
import { Keyboard } from 'grammy'

const PLAYLIST_PER_PAGE = 3

export default async function sendMenu(ctx: Context) {
  ctx.dbuser.state = State.MainMenu
  const maxPage = Math.ceil(ctx.dbuser.playlists.length / PLAYLIST_PER_PAGE) - 1

  if (ctx.dbuser.selectedPage < 0) {
    ctx.dbuser.selectedPage = 0
  }
  if (ctx.dbuser.selectedPage > maxPage) {
    ctx.dbuser.selectedPage = maxPage
  }

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
      reply_markup: getMainKeyboard(ctx, maxPage),
    }
  )
}

function getMainKeyboard(ctx: Context, maxPage: number): Keyboard {
  const keyboard = new Keyboard()

  let serviceButtons
  if (ctx.dbuser.playlists.length > 0) {
    serviceButtons = [
      ctx.i18n.t('main_menu_keyboard_left'),
      `${ctx.dbuser.selectedPage + 1}/${maxPage + 1}`,
      ctx.i18n.t('main_menu_keyboard_right'),
      ctx.i18n.t('main_menu_keyboard_add'),
    ]
  } else {
    serviceButtons = [ctx.i18n.t('main_menu_keyboard_add')]
  }

  for (
    let i = ctx.dbuser.selectedPage * PLAYLIST_PER_PAGE;
    i <
    Math.min(
      ctx.dbuser.selectedPage * PLAYLIST_PER_PAGE + PLAYLIST_PER_PAGE,
      ctx.dbuser.playlists.length
    );
    i++
  ) {
    keyboard.text(ctx.dbuser.playlists[i].name).row()
  }

  for (let serviceButton of serviceButtons) {
    keyboard.text(serviceButton)
  }

  return keyboard
}
