import Context from '@/models/Context'
import { State } from '@/models/User'
import { Keyboard, NextFunction } from 'grammy'
import sendMenu from '@/handlers/handleMenu'
import { menuCancelText } from '@/helpers/serviceTexts'
import { loadPlaylistMenu } from '@/handlers/handlePlaylistLoad'
import deleteAudio from '@/handlers/deleteAudio'

export async function handlePlaylistDeleteAwaitingConfirmation(ctx: Context) {
  ctx.dbuser.state = State.AwaitingPlaylistDeletion
  await ctx.dbuser.save()

  return ctx.reply(
    ctx.i18n.t('playlist_menu_delete_prompt', {
      playlistName: ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].name,
    }),
    {
      reply_markup: getConfirmKeyboard(ctx),
    }
  )
}

function getConfirmKeyboard(ctx: Context): Keyboard {
  return new Keyboard()
    .text(ctx.i18n.t('playlist_menu_confirm_delete'))
    .text(ctx.i18n.t('keyboard_cancel'))
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

  ctx.dbuser.playlists.splice(ctx.dbuser.selectedPlaylist, 1)
  return sendMenu(ctx)
}
