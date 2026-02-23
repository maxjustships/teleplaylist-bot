import { InlineKeyboard } from 'grammy'
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

  const text = ctx.t('main_menu', {
    playlistAmount,
    plural: playlistAmount === 1 ? '' : 's',
    mainInfo:
      playlistAmount === 0
        ? ctx.t('main_menu_info_empty')
        : ctx.t('main_menu_info'),
    donationInfo,
  })
  const reply_markup = getMainKeyboard(ctx, maxPage, selectedPage)

  // Try to edit the last message
  let message_id: number | undefined
  if (ctx.dbuser.lastBotMessages.length > 0) {
    const lastMsg =
      ctx.dbuser.lastBotMessages[ctx.dbuser.lastBotMessages.length - 1]
    try {
      const edited = await ctx.api.editMessageText(
        ctx.chat.id,
        lastMsg.messageId,
        text,
        {
          reply_markup,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }
      )
      if (typeof edited !== 'boolean') {
        message_id = edited.message_id
      } else {
        message_id = lastMsg.messageId
      }
    } catch {
      // Edit failed (e.g., message not found or too old), send new message
    }
  }

  if (!message_id) {
    // If edit failed or no previous message, delete all and send new
    await deleteLastMessages(ctx)
    const sent = await ctx.reply(text, {
      reply_markup,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    })
    message_id = sent.message_id

    await ctx.db.insert(schema.lastBotMessages).values({
      userId: ctx.from.id,
      messageId: message_id,
    })
  }

  await updateUser(ctx.db, ctx.from.id, {
    state: State.MainMenu,
    selectedPage,
  })
}

function getMainKeyboard(
  ctx: Context,
  maxPage: number,
  selectedPage: number
): InlineKeyboard {
  const keyboard = new InlineKeyboard()

  for (
    let i = selectedPage * PLAYLIST_PER_PAGE;
    i <
    Math.min(
      selectedPage * PLAYLIST_PER_PAGE + PLAYLIST_PER_PAGE,
      ctx.dbuser.playlists.length
    );
    i++
  ) {
    const playlist = ctx.dbuser.playlists[i]
    keyboard.text(playlist.name, `open_playlist:${playlist.id}`).row()
  }

  // Navigation row
  if (ctx.dbuser.playlists.length > PLAYLIST_PER_PAGE) {
    keyboard.text(ctx.t('main_menu_keyboard_left'), 'nav_prev')
    keyboard.text(`${selectedPage + 1}/${maxPage + 1}`, 'ignore')
    keyboard.text(ctx.t('main_menu_keyboard_right'), 'nav_next')
    keyboard.row()
  }

  // Action row
  keyboard.text(ctx.t('main_menu_keyboard_add'), 'add_playlist')
  keyboard.text(ctx.t('main_menu_keyboard_language'), 'language')

  return keyboard
}
