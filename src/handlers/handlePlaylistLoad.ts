import { InlineKeyboard, NextFunction } from 'grammy'
import { State, updateUser } from '@/models/User'
import Context from '@/models/Context'
import deleteLastMessages from '@/helpers/deleteLastMessages'
import getLoadingKeyboard from '@/helpers/loadingKeyboard'
import sendAudio from '@/handlers/sendAudio'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function handlePlaylistLoad(ctx: Context, next: NextFunction) {
  const data = ctx.callbackQuery?.data
  if (!data?.startsWith('open_playlist:')) {
    return next()
  }

  const playlistId = parseInt(data.split(':')[1])
  const playlist = ctx.dbuser.playlists.find(({ id }) => id === playlistId)

  if (!playlist) {
    return ctx.answerCallbackQuery()
  }

  await updateUser(ctx.db, ctx.from.id, {
    selectedPlaylistId: playlist.id,
    lastPlaylistActiveTimestamp: Date.now(),
  })

  // Refresh ctx.dbuser manually for subsequent calls in same request
  ctx.dbuser.selectedPlaylistId = playlist.id

  await ctx.answerCallbackQuery()
  await loadPlaylistAudio(ctx)
  return loadPlaylistMenu(ctx)
}

export async function loadPlaylistMenu(ctx: Context) {
  await updateUser(ctx.db, ctx.from.id, { state: State.PlaylistMenu })

  const keyboard = new InlineKeyboard()
    .text(ctx.t('playlist_menu_rename'), 'rename_playlist')
    .row()
    .text(ctx.t('playlist_menu_delete'), 'delete_playlist')
    .row()
    .text(ctx.t('playlist_menu_back'), 'playlist_back')
    .row()

  const selectedPlaylist = ctx.dbuser.playlists.find(
    (p) => p.id === ctx.dbuser.selectedPlaylistId
  )

  const text = ctx.t('playlist_menu', {
    playlistName: selectedPlaylist?.name || '',
  })

  if (ctx.dbuser.lastBotMessages.length > 0) {
    const lastMsg =
      ctx.dbuser.lastBotMessages[ctx.dbuser.lastBotMessages.length - 1]
    try {
      await ctx.api.editMessageText(ctx.chat.id, lastMsg.messageId, text, {
        reply_markup: keyboard,
      })
      return
    } catch {
      // Edit failed
    }
  }

  await deleteLastMessages(ctx)
  const sent = await ctx.reply(text, {
    reply_markup: keyboard,
  })
  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from.id,
    messageId: sent.message_id,
  })
}

export async function loadPlaylistAudio(ctx: Context) {
  // We send a temporary loading message which will be deleted later by deleteLastMessages if needed,
  // but here we just want to show progress.
  const { message_id: loadingId } = await ctx.reply(ctx.t('loading'), {
    reply_markup: getLoadingKeyboard(ctx),
  })

  const selectedPlaylist = ctx.dbuser.playlists.find(
    (p) => p.id === ctx.dbuser.selectedPlaylistId
  )
  if (!selectedPlaylist) {
    await ctx.api.deleteMessage(ctx.chat.id, loadingId).catch(() => {})
    return
  }

  for (const audio of selectedPlaylist.audios) {
    const audioMessage = await sendAudio(ctx, audio.fileId)
    await ctx.db
      .update(schema.audios)
      .set({ messageId: audioMessage.message_id })
      .where(eq(schema.audios.id, audio.id))
  }

  await ctx.api.deleteMessage(ctx.chat.id, loadingId).catch(() => {})
}
