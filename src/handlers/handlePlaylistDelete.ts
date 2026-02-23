import { InlineKeyboard } from 'grammy'
import { State, updateUser } from '@/models/User'
import Context from '@/models/Context'
import deleteAudio from '@/handlers/deleteAudio'
import sendMenu from '@/handlers/handleMenu'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'
import deleteLastMessages from '@/helpers/deleteLastMessages'

export async function handlePlaylistDeleteAwaitingConfirmation(ctx: Context) {
  await updateUser(ctx.db, ctx.from.id, {
    state: State.AwaitingPlaylistDeletion,
  })

  const selectedPlaylist = ctx.dbuser.playlists.find(
    (p) => p.id === ctx.dbuser.selectedPlaylistId
  )

  const text = ctx.t('playlist_menu_delete_prompt', {
    playlistName: selectedPlaylist?.name || '',
  })
  const reply_markup = getConfirmKeyboard(ctx)

  if (ctx.dbuser.lastBotMessages.length > 0) {
    const lastMsg =
      ctx.dbuser.lastBotMessages[ctx.dbuser.lastBotMessages.length - 1]
    try {
      await ctx.api.editMessageText(ctx.chat.id, lastMsg.messageId, text, {
        reply_markup,
      })
      await ctx.answerCallbackQuery()
      return
    } catch {
      // Edit failed
    }
  }

  await deleteLastMessages(ctx)
  const sent = await ctx.reply(text, {
    reply_markup,
  })

  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from.id,
    messageId: sent.message_id,
  })
  await ctx.answerCallbackQuery()
}

function getConfirmKeyboard(ctx: Context): InlineKeyboard {
  return new InlineKeyboard()
    .text(ctx.t('playlist_menu_confirm_delete'), 'confirm_delete')
    .text(ctx.t('keyboard_cancel'), 'cancel')
}

export async function handlePlaylistDeleteConfirm(ctx: Context) {
  if (ctx.dbuser.state !== State.AwaitingPlaylistDeletion) {
    return
  }

  await deleteAudio(ctx)

  if (ctx.dbuser.selectedPlaylistId) {
    await ctx.db
      .delete(schema.playlists)
      .where(eq(schema.playlists.id, ctx.dbuser.selectedPlaylistId))
  }

  await ctx.refetchUser()

  await ctx.answerCallbackQuery()
  return sendMenu(ctx)
}
