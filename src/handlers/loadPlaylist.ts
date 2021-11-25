import Context from '@/models/Context'
import { Keyboard } from 'grammy'
import { Playlist } from '../models/User'

export async function loadPlaylist(ctx: Context, playlistIndex: number) {
  ctx.dbuser.selectedPlaylist = playlistIndex
  await ctx.dbuser.save()

  return ctx.reply(
    ctx.i18n.t('playlist_menu', {
      playlistName: ctx.dbuser.playlists[playlistIndex].name,
    }),
    {
      reply_markup: getPlaylistKeyboard(ctx, playlistIndex),
    }
  )
}

function getPlaylistKeyboard(ctx: Context, playlistIndex: number): Keyboard {
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
