import { Keyboard, NextFunction } from 'grammy'
import { State, updateUser } from '@/models/User'
import Context from '@/models/Context'
import deleteLastMessages from '@/helpers/deleteLastMessages'
import getLoadingKeyboard from '@/helpers/loadingKeyboard'
import sendAudio from '@/handlers/sendAudio'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function handlePlaylistLoad(ctx: Context, next: NextFunction) {
  if (ctx.dbuser.state !== State.MainMenu) {
    return next()
  }

  const playlist = ctx.dbuser.playlists.find(
    ({ name }) => name === ctx.msg.text
  )

  if (!playlist) {
    // If not a playlist name, maybe it's some other message
    return next()
  }

  await updateUser(ctx.db, ctx.from.id, {
    selectedPlaylistId: playlist.id,
    lastPlaylistActiveTimestamp: Date.now(),
  })

  // Refresh ctx.dbuser manually for subsequent calls in same request
  ctx.dbuser.selectedPlaylistId = playlist.id

  await loadPlaylistAudio(ctx)
  return loadPlaylistMenu(ctx)
}

export async function loadPlaylistMenu(ctx: Context) {
  await updateUser(ctx.db, ctx.from.id, { state: State.PlaylistMenu })

  const keyboard = new Keyboard()

  keyboard
    .text(ctx.t('playlist_menu_rename'))
    .row()
    .text(ctx.t('playlist_menu_delete'))
    .row()
    .text(ctx.t('playlist_menu_back'))
    .row()

  const selectedPlaylist = ctx.dbuser.playlists.find(
    (p) => p.id === ctx.dbuser.selectedPlaylistId
  )

  const { message_id } = await ctx.reply(
    ctx.t('playlist_menu', {
      playlistName: selectedPlaylist?.name || '',
    }),
    {
      reply_markup: keyboard,
    }
  )
  await deleteLastMessages(ctx)
  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from.id,
    messageId: message_id,
  })
}

export async function loadPlaylistAudio(ctx: Context) {
  const { message_id } = await ctx.reply(ctx.t('loading'), {
    reply_markup: getLoadingKeyboard(ctx),
  })
  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from.id,
    messageId: message_id,
  })

  const selectedPlaylist = ctx.dbuser.playlists.find(
    (p) => p.id === ctx.dbuser.selectedPlaylistId
  )
  if (!selectedPlaylist) return

  for (const audio of selectedPlaylist.audios) {
    const audioMessage = await sendAudio(ctx, audio.fileId)
    await ctx.db
      .update(schema.audios)
      .set({ messageId: audioMessage.message_id })
      .where(eq(schema.audios.id, audio.id))
  }
}
