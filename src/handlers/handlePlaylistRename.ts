import { Keyboard, NextFunction } from 'grammy'
import { State, updateUser } from '@/models/User'
import { loadPlaylistMenu } from '@/handlers/handlePlaylistLoad'
import { menuCancelText, serviceText } from '@/helpers/serviceTexts'
import Context from '@/models/Context'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function handlePlaylistRenameAwaitingRename(ctx: Context) {
  await updateUser(ctx.db, ctx.from.id, { state: State.AwaitingPlaylistRename })

  const selectedPlaylist = ctx.dbuser.playlists.find(
    (p) => p.id === ctx.dbuser.selectedPlaylistId
  )

  const { message_id } = await ctx.reply(
    ctx.t('playlist_rename_prompt', {
      playlistName: selectedPlaylist?.name || '',
    }),
    {
      reply_markup: new Keyboard().text(ctx.t('keyboard_cancel')),
    }
  )
  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from.id,
    messageId: message_id,
  })
}

export async function handlePlaylistRenameReceivedReply(
  ctx: Context,
  next: NextFunction
) {
  if (ctx.dbuser.state !== State.AwaitingPlaylistRename) {
    return next()
  }

  if (menuCancelText.includes(ctx.msg.text)) {
    return loadPlaylistMenu(ctx)
  }

  if (serviceText.includes(ctx.msg.text)) {
    const { message_id } = await ctx.reply(
      ctx.t('playlist_add_name_error_service')
    )
    await ctx.db.insert(schema.lastBotMessages).values({
      userId: ctx.from.id,
      messageId: message_id,
    })
    return
  }

  if (
    ctx.dbuser.playlists.some(
      (playlist) =>
        ctx.dbuser.selectedPlaylistId !== playlist.id &&
        playlist.name === ctx.msg.text
    )
  ) {
    const { message_id } = await ctx.reply(
      ctx.t('playlist_rename_error_exists')
    )
    await ctx.db.insert(schema.lastBotMessages).values({
      userId: ctx.from.id,
      messageId: message_id,
    })
    return
  }

  if (ctx.dbuser.selectedPlaylistId) {
    await ctx.db
      .update(schema.playlists)
      .set({ name: ctx.msg.text })
      .where(eq(schema.playlists.id, ctx.dbuser.selectedPlaylistId))

    // Update in memory for loadPlaylistMenu
    const p = ctx.dbuser.playlists.find(
      (p) => p.id === ctx.dbuser.selectedPlaylistId
    )
    if (p) p.name = ctx.msg.text
  }

  await updateUser(ctx.db, ctx.from.id, { state: State.PlaylistMenu })
  return loadPlaylistMenu(ctx)
}
