import { Keyboard, NextFunction } from 'grammy'
import { State, updateUser } from '@/models/User'
import { loadPlaylistMenu } from '@/handlers/handlePlaylistLoad'
import { menuCancelText } from '@/helpers/serviceTexts'
import Context from '@/models/Context'
import deleteAudio from '@/handlers/deleteAudio'
import sendMenu from '@/handlers/handleMenu'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function handlePlaylistDeleteAwaitingConfirmation(ctx: Context) {
  await updateUser(ctx.db, ctx.from.id, {
    state: State.AwaitingPlaylistDeletion,
  })

  const selectedPlaylist = ctx.dbuser.playlists.find(
    (p) => p.id === ctx.dbuser.selectedPlaylistId
  )

  const { message_id } = await ctx.reply(
    ctx.t('playlist_menu_delete_prompt', {
      playlistName: selectedPlaylist?.name || '',
    }),
    {
      reply_markup: getConfirmKeyboard(ctx),
    }
  )
  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from.id,
    messageId: message_id,
  })
}

function getConfirmKeyboard(ctx: Context): Keyboard {
  return new Keyboard()
    .text(ctx.t('playlist_menu_confirm_delete'))
    .text(ctx.t('keyboard_cancel'))
}

export async function handlePlaylistDeleteReceivedReply(
  ctx: Context,
  next: NextFunction
) {
  if (ctx.dbuser.state !== State.AwaitingPlaylistDeletion) {
    return next()
  }
  if (menuCancelText.includes(ctx.msg.text)) {
    return loadPlaylistMenu(ctx)
  }

  await deleteAudio(ctx)

  if (ctx.dbuser.selectedPlaylistId) {
    await ctx.db
      .delete(schema.playlists)
      .where(eq(schema.playlists.id, ctx.dbuser.selectedPlaylistId))
  }

  // Refresh ctx.dbuser for sendMenu if needed, but it's okay for now
  ctx.dbuser.playlists = ctx.dbuser.playlists.filter(
    (p) => p.id !== ctx.dbuser.selectedPlaylistId
  )

  return sendMenu(ctx)
}
