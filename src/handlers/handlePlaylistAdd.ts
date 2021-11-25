import Context from '@/models/Context'
import { Playlist, State } from '@/models/User'
import { Keyboard, NextFunction } from 'grammy'
import { menuCancelText, serviceText } from '../helpers/serviceTexts'
import sendMenu from './sendMenu'

export async function handlePlaylistAddAwaitingName(ctx: Context) {
  ctx.dbuser.state = State.AwaitingName
  await ctx.dbuser.save()
  return ctx.reply(ctx.i18n.t('playlist_add_name_prompt'), {
    reply_markup: new Keyboard().text(ctx.i18n.t('keyboard_cancel')),
  })
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
    return ctx.reply(ctx.i18n.t('playlist_add_name_error_exists'))
  }

  if (serviceText.includes(text)) {
    return ctx.reply(ctx.i18n.t('playlist_add_name_error_service'))
  }

  const playlist = new Playlist()
  playlist.name = text
  ctx.dbuser.playlists.push(playlist)
  await ctx.dbuser.save()
  return sendMenu(ctx)
}
