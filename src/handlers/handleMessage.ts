import Context from '@/models/Context'
import { Playlist, State } from '@/models/User'
import { sendPlaylist } from './handlePlaylistLoad'
import sendMenu from './sendMenu'

export default async function handleMessage(ctx: Context) {
  switch (ctx.dbuser.state) {
    case State.AwaitingPlaylistName:
      return handleNewPlaylistName(ctx)
    case State.AwaitingPlaylistRename:
      return handlePlaylistRename(ctx)
  }
}

async function handleNewPlaylistName(ctx: Context) {
  const text = ctx.msg.text

  if (ctx.dbuser.playlists.some((playlist) => playlist.name === text)) {
    return ctx.reply(ctx.i18n.t('playlist_add_name_error_exists'))
  }

  const playlist = new Playlist()
  playlist.name = text
  ctx.dbuser.playlists.push(playlist)
  ctx.dbuser.state = State.PlaylistMenu
  await ctx.dbuser.save()
  return sendMenu(ctx)
}

async function handlePlaylistRename(ctx: Context) {
  const text = ctx.msg.text
  const playlistIndex = ctx.dbuser.selectedPlaylist

  if (
    ctx.dbuser.playlists.some(
      (playlist, index) => playlistIndex !== index && playlist.name === text
    )
  ) {
    return ctx.reply(ctx.i18n.t('playlist_rename_error_exists'))
  }

  ctx.dbuser.playlists[playlistIndex].name = text
  ctx.dbuser.state = State.PlaylistMenu
  await ctx.dbuser.save()
  return sendPlaylist(ctx, ctx.dbuser.selectedPlaylist)
}
