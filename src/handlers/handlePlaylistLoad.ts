import Context from '@/models/Context'
import { createSecretKey } from 'crypto'
import { Keyboard, NextFunction } from 'grammy'
import { Playlist, State } from '../models/User'
import sendAudio from './sendAudio'

export async function handlePlaylistLoad(ctx: Context, next: NextFunction) {
  if (ctx.dbuser.state !== State.MainMenu) {
    return next()
  }

  const playlistIndex = ctx.dbuser.playlists.findIndex(
    ({ name }) => name === ctx.msg.text
  )

  if (playlistIndex === -1) {
    return ctx.reply(
      ctx.i18n.t('main_menu_select_error', {
        playlistName: ctx.msg.text,
      })
    )
  }

  ctx.dbuser.selectedPlaylist = playlistIndex
  await loadPlaylistMenu(ctx)
  return loadPlaylistAudio(ctx)
}

export async function loadPlaylistMenu(ctx: Context) {
  ctx.dbuser.state = State.PlaylistMenu
  await ctx.dbuser.save()

  const keyboard = new Keyboard()

  keyboard
    .text(ctx.i18n.t('playlist_menu_rename'))
    .row()
    .text(ctx.i18n.t('playlist_menu_delete'))
    .row()
    .text(ctx.i18n.t('playlist_menu_back'))
    .row()

  return ctx.reply(
    ctx.i18n.t('playlist_menu', {
      playlistName: ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].name,
    }),
    {
      reply_markup: keyboard,
    }
  )
}

export async function loadPlaylistAudio(ctx: Context) {
  for (
    let i = 0;
    i < ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].audio.length;
    i++
  ) {
    const audioMessage = await sendAudio(
      ctx,
      ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].audio[i].fileId
    )
    ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].audio[i].messageId =
      audioMessage.message_id
    ctx.dbuser.markModified(
      `playlists.${ctx.dbuser.selectedPlaylist}.audio.${i}.messageId`
    )
  }

  return ctx.dbuser.save()
}
