import { Keyboard, NextFunction } from 'grammy'
import { Playlist, State } from '@/models/User'
import { menuCancelText, serviceText } from '@/helpers/serviceTexts'
import Context from '@/models/Context'
import sendMenu from '@/handlers/handleMenu'

export async function handlePlaylistAddAwaitingName(ctx: Context) {
  ctx.dbuser.state = State.AwaitingName

  const { message_id } = await ctx.reply(
    ctx.i18n.t('playlist_add_name_prompt'),
    {
      reply_markup: new Keyboard().text(ctx.i18n.t('keyboard_cancel')),
    }
  )
  ctx.dbuser.lastBotMessages.push(message_id)

  return ctx.dbuser.save()
}

export async function handlePlaylistAddReceivedName(
  ctx: Context,
  next: NextFunction
) {
  if (ctx.dbuser.state !== State.AwaitingName) {
    return next()
  }

  const text = ctx.msg.text.trim()

  if (menuCancelText.includes(text)) {
    return sendMenu(ctx)
  }

  if (ctx.dbuser.playlists.some((playlist) => playlist.name === text)) {
    const { message_id } = await ctx.reply(
      ctx.i18n.t('playlist_add_name_error_exists')
    )
    ctx.dbuser.lastBotMessages.push(message_id)
    return ctx.dbuser.save()
  }

  if (serviceText.includes(text)) {
    const { message_id } = await ctx.reply(
      ctx.i18n.t('playlist_add_name_error_service')
    )
    ctx.dbuser.lastBotMessages.push(message_id)
    return ctx.dbuser.save()
  }

  const playlist = new Playlist()
  playlist.name = text
  ctx.dbuser.playlists.push(playlist)

  return sendMenu(ctx)
}
