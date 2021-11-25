import Context from '@/models/Context'
import { createSecretKey } from 'crypto'
import { Keyboard, NextFunction } from 'grammy'
import { Playlist, State } from '../models/User'

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
  return loadPlaylist(ctx)
}

export async function loadPlaylist(ctx: Context) {
  ctx.dbuser.state = State.PlaylistMenu
  await ctx.dbuser.save()
  return ctx.reply(
    ctx.i18n.t('playlist_menu', {
      playlistName: ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].name,
    }),
    {
      reply_markup: getPlaylistKeyboard(ctx),
    }
  )
}

function getPlaylistKeyboard(ctx: Context): Keyboard {
  const keyboard = new Keyboard()

  keyboard
    .text(ctx.i18n.t('playlist_menu_rename'))
    .row()
    .text(ctx.i18n.t('playlist_menu_delete'))
    .row()
    .text(ctx.i18n.t('playlist_menu_back'))
    .row()

  return keyboard
}
