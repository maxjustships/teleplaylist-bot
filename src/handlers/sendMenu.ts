import Context from '@/models/Context'
import { State } from '@/models/User'
import { Keyboard } from 'grammy'

const PLAYLIST_PER_PAGE = 3

export default async function sendMenu(ctx: Context) {
  const playlistAmount = ctx.dbuser.playlists.length

  ctx.dbuser.state = State.MainMenu
  const maxPage = Math.ceil(playlistAmount / PLAYLIST_PER_PAGE) - 1

  if (ctx.dbuser.selectedPage > maxPage) {
    ctx.dbuser.selectedPage = maxPage
  }
  if (ctx.dbuser.selectedPage < 0) {
    ctx.dbuser.selectedPage = 0
  }

  await ctx.dbuser.save()

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

  for (let serviceButton of getMainKeyboardButtons(ctx, maxPage)) {
    keyboard.text(serviceButton)
  }

  return keyboard
}

function getMainKeyboardButtons(ctx, maxPage: number): string[] {
  if (ctx.dbuser.playlists.length > 0) {
    return [
      ctx.i18n.t('main_menu_keyboard_left'),
      `${ctx.dbuser.selectedPage + 1}/${maxPage + 1}`,
      ctx.i18n.t('main_menu_keyboard_right'),
      ctx.i18n.t('main_menu_keyboard_add'),
    ]
  } else {
    return [ctx.i18n.t('main_menu_keyboard_add')]
  }
}
