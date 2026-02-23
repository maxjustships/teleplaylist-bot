import { InlineKeyboard, NextFunction } from 'grammy'
import { State, updateUser } from '@/models/User'
import { loadPlaylistMenu } from '@/handlers/handlePlaylistLoad'
import { serviceText } from '@/helpers/serviceTexts'
import Context from '@/models/Context'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'
import deleteLastMessages from '@/helpers/deleteLastMessages'

export async function handlePlaylistRenameAwaitingRename(ctx: Context) {
  await updateUser(ctx.db, ctx.from.id, { state: State.AwaitingPlaylistRename })

  const selectedPlaylist = ctx.dbuser.playlists.find(
    (p) => p.id === ctx.dbuser.selectedPlaylistId
  )

  const text = ctx.t('playlist_rename_prompt', {
    playlistName: selectedPlaylist?.name || '',
  })
  const reply_markup = new InlineKeyboard().text(
    ctx.t('keyboard_cancel'),
    'cancel'
  )

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

export async function handlePlaylistRenameReceivedReply(
  ctx: Context,
  next: NextFunction
) {
  if (ctx.dbuser.state !== State.AwaitingPlaylistRename || !ctx.msg?.text) {
    return next()
  }

  const text = ctx.msg.text.trim()
  await ctx.api.deleteMessage(ctx.chat.id, ctx.msg.message_id).catch(() => {})

  if (serviceText.includes(text)) {
    const errorText = ctx.t('playlist_add_name_error_service')
    if (ctx.dbuser.lastBotMessages.length > 0) {
      const lastMsg =
        ctx.dbuser.lastBotMessages[ctx.dbuser.lastBotMessages.length - 1]
      await ctx.api.editMessageText(ctx.chat.id, lastMsg.messageId, errorText, {
        reply_markup: new InlineKeyboard().text(
          ctx.t('keyboard_cancel'),
          'cancel'
        ),
      })
    }
    return
  }

  if (
    ctx.dbuser.playlists.some(
      (playlist) =>
        ctx.dbuser.selectedPlaylistId !== playlist.id && playlist.name === text
    )
  ) {
    const errorText = ctx.t('playlist_rename_error_exists')
    if (ctx.dbuser.lastBotMessages.length > 0) {
      const lastMsg =
        ctx.dbuser.lastBotMessages[ctx.dbuser.lastBotMessages.length - 1]
      await ctx.api.editMessageText(ctx.chat.id, lastMsg.messageId, errorText, {
        reply_markup: new InlineKeyboard().text(
          ctx.t('keyboard_cancel'),
          'cancel'
        ),
      })
    }
    return
  }

  if (ctx.dbuser.selectedPlaylistId) {
    await ctx.db
      .update(schema.playlists)
      .set({ name: text })
      .where(eq(schema.playlists.id, ctx.dbuser.selectedPlaylistId))

    // Update in memory for loadPlaylistMenu
    const p = ctx.dbuser.playlists.find(
      (p) => p.id === ctx.dbuser.selectedPlaylistId
    )
    if (p) p.name = text
  }

  await updateUser(ctx.db, ctx.from.id, { state: State.PlaylistMenu })
  return loadPlaylistMenu(ctx)
}
