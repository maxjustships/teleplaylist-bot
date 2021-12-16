import { Keyboard, NextFunction } from 'grammy'
import { State } from '@/models/User'
import { loadPlaylistMenu } from '@/handlers/handlePlaylistLoad'
import { menuCancelText } from '@/helpers/serviceTexts'
import Context from '@/models/Context'
import deleteAudio from '@/handlers/deleteAudio'
import sendMenu from '@/handlers/handleMenu'

export async function handlePlaylistDeleteAwaitingConfirmation(ctx: Context) {
  ctx.dbuser.state = State.AwaitingPlaylistDeletion

  const { message_id } = await ctx.reply(
    ctx.i18n.t('playlist_menu_delete_prompt', {
      playlistName: ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].name,
    }),
    {
      reply_markup: getConfirmKeyboard(ctx),
    }
  )
  ctx.dbuser.lastBotMessages.push(message_id)

  await ctx.dbuser.save()
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
