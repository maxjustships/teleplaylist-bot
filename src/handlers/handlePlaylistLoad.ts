import Context from '@/models/Context'
import { InlineKeyboard } from 'grammy'

export async function handlePlaylistLoad(ctx: Context) {
  const index = Number(ctx.callbackQuery.data.replace('select-', ''))
  ctx.dbuser.selectedPlaylist = index
  await ctx.dbuser.save()

  return sendPlaylist(ctx, index)
}

export async function sendPlaylist(ctx: Context, index: number) {
  const playlist = ctx.dbuser.playlists[index]
  return ctx.reply(
    ctx.i18n.t('playlist_menu', {
      playlistName: playlist.name,
    }),
    {
      reply_markup: getPlaylistKeyboard(ctx, index),
    }
  )
}

function getPlaylistKeyboard(ctx: Context, index: number): InlineKeyboard {
  const keyboard = new InlineKeyboard()

  keyboard.text(ctx.i18n.t('playlist_menu_rename'), `rename-${index}`)
  keyboard.text(ctx.i18n.t('playlist_menu_delete'), `delete-${index}`).row()
  keyboard.text(ctx.i18n.t('playlist_menu_back'), 'playlist-back')

  return keyboard
}
