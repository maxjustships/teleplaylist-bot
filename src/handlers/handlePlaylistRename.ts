import { Keyboard, NextFunction } from 'grammy'
import { State } from '@/models/User'
import { loadPlaylistMenu } from '@/handlers/handlePlaylistLoad'
import { menuCancelText, serviceText } from '@/helpers/serviceTexts'
import Context from '@/models/Context'

export async function handlePlaylistRenameAwaitingRename(ctx: Context) {
  ctx.dbuser.state = State.AwaitingPlaylistRename

  const { message_id } = await ctx.reply(
    ctx.i18n.t('playlist_rename_prompt', {
      playlistName: ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].name,
    }),
    {
      reply_markup: new Keyboard().text(ctx.i18n.t('keyboard_cancel')),
    }
  )
  ctx.dbuser.lastBotMessages.push(message_id)

  return ctx.dbuser.save()
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
      ctx.i18n.t('playlist_add_name_error_service')
    )
    ctx.dbuser.lastBotMessages.push(message_id)
    return ctx.dbuser.save()
  }

  if (
    ctx.dbuser.playlists.some(
      (playlist, index) =>
        ctx.dbuser.selectedPlaylist !== index && playlist.name === ctx.msg.text
    )
  ) {
    const { message_id } = await ctx.reply(
      ctx.i18n.t('playlist_rename_error_exists')
    )
    ctx.dbuser.lastBotMessages.push(message_id)
    return ctx.dbuser.save()
  }

  ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].name = ctx.msg.text
  ctx.dbuser.state = State.PlaylistMenu
  await ctx.dbuser.save()
  return loadPlaylistMenu(ctx)
}
