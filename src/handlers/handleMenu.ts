import { Keyboard } from 'grammy'
import { State, updateUser } from '@/models/User'
import Context from '@/models/Context'
import deleteLastMessages from '@/helpers/deleteLastMessages'
import * as schema from '@/db/schema'

const PLAYLIST_PER_PAGE = 3

export default async function sendMenu(ctx: Context) {
  const playlistAmount = ctx.dbuser.playlists.length

  let selectedPage = ctx.dbuser.selectedPage
  const maxPage = Math.ceil(playlistAmount / PLAYLIST_PER_PAGE) - 1

  if (selectedPage > maxPage) {
    selectedPage = maxPage
  }
  if (selectedPage < 0) {
    selectedPage = 0
  }

  const shouldShowDonationLink =
    Math.random() < Number(ctx.env.DONATION_FREQUENCY || 0.05)
  const donationInfo = shouldShowDonationLink
    ? ctx.t('donation_info', {
        donationLink: ctx.env.DONATION_LINK,
      })
    : ''

  const { message_id } = await ctx.reply(
    ctx.t('main_menu', {
      playlistAmount,
      plural: playlistAmount === 1 ? '' : 's',
      mainInfo:
        playlistAmount === 0
          ? ctx.t('main_menu_info_empty')
          : ctx.t('main_menu_info'),
      donationInfo,
    }),
    {
      reply_markup: getMainKeyboard(ctx, maxPage, selectedPage),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }
  )

  await deleteLastMessages(ctx)

  await updateUser(ctx.db, ctx.from.id, {
    state: State.MainMenu,
    selectedPage,
  })

  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from.id,
    messageId: message_id,
  })
}

function getMainKeyboard(
  ctx: Context,
  maxPage: number,
  selectedPage: number
): Keyboard {
  const keyboard = new Keyboard()

  for (
    let i = selectedPage * PLAYLIST_PER_PAGE;
    i <
    Math.min(
      selectedPage * PLAYLIST_PER_PAGE + PLAYLIST_PER_PAGE,
      ctx.dbuser.playlists.length
    );
    i++
  ) {
    keyboard.text(ctx.dbuser.playlists[i].name).row()
  }

  for (const serviceButton of getMainKeyboardButtons(
    ctx,
    maxPage,
    selectedPage
  )) {
    keyboard.text(serviceButton)
  }

  return keyboard
}

function getMainKeyboardButtons(
  ctx: Context,
  maxPage: number,
  selectedPage: number
): string[] {
  if (ctx.dbuser.playlists.length > 0) {
    return [
      ctx.t('main_menu_keyboard_language'),
      ctx.t('main_menu_keyboard_left'),
      `${selectedPage + 1}/${maxPage + 1}`,
      ctx.t('main_menu_keyboard_right'),
      ctx.t('main_menu_keyboard_add'),
    ]
  } else {
    return [
      ctx.t('main_menu_keyboard_add'),
      ctx.t('main_menu_keyboard_language'),
    ]
  }
}
