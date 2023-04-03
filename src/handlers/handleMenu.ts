import { Keyboard } from 'grammy'
import { State } from '@/models/User'
import Context from '@/models/Context'
import deleteLastMessages from '@/helpers/deleteLastMessages'

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

  const shouldShowDonationLink =
    Math.random() < Number(process.env.DONATION_FREQUENCY)
  const donationInfo = shouldShowDonationLink
    ? ctx.i18n.t('donation_info', {
        donationLink: process.env.DONATION_LINK,
      })
    : ''

  const { message_id } = await ctx.reply(
    ctx.i18n.t('main_menu', {
      playlistAmount,
      plural: playlistAmount === 1 ? '' : 's',
      mainInfo:
        playlistAmount === 0
          ? ctx.i18n.t('main_menu_info_empty')
          : ctx.i18n.t('main_menu_info'),
      donationInfo,
    }),
    {
      reply_markup: getMainKeyboard(ctx, maxPage),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }
  )

  await deleteLastMessages(ctx)
  ctx.dbuser.lastBotMessages.push(message_id)

  await ctx.dbuser.save()
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

  for (const serviceButton of getMainKeyboardButtons(ctx, maxPage)) {
    keyboard.text(serviceButton)
  }

  return keyboard
}

function getMainKeyboardButtons(ctx, maxPage: number): string[] {
  if (ctx.dbuser.playlists.length > 0) {
    return [
      ctx.i18n.t('main_menu_keyboard_language'),
      ctx.i18n.t('main_menu_keyboard_left'),
      `${ctx.dbuser.selectedPage + 1}/${maxPage + 1}`,
      ctx.i18n.t('main_menu_keyboard_right'),
      ctx.i18n.t('main_menu_keyboard_add'),
    ]
  } else {
    return [
      ctx.i18n.t('main_menu_keyboard_add'),
      ctx.i18n.t('main_menu_keyboard_language'),
    ]
  }
}
