import Context from '@/models/Context'
import { Playlist, State } from '@/models/User'
import handlePlaylistAdd from './handlePlaylistAdd'
import handlePlaylistDelete from './handlePlaylistDelete'
import { loadPlaylist } from './loadPlaylist'
import sendMenu from './sendMenu'
import sendRenamePrompt from './sendRenamePrompt'

export default async function handleMessage(ctx: Context) {
  // delete user message
  // await ctx.api.deleteMessage(ctx.chat.id, ctx.msg.message_id)

  // naming and renaming a playlist
  switch (ctx.dbuser.state) {
    case State.AwaitingPlaylistName:
      return handleNewPlaylistName(ctx)
    case State.AwaitingPlaylistRename:
      return handlePlaylistRename(ctx)
  }

  // main keyboard service buttons processing
  switch (ctx.msg.text) {
    case ctx.i18n.t('playlist_add_button'):
      return handlePlaylistAdd(ctx)
  }

  // playlist keyboard service buttons processing
  switch (ctx.msg.text) {
    case ctx.i18n.t('playlist_menu_rename'):
      return sendRenamePrompt(ctx)
    case ctx.i18n.t('playlist_menu_delete'):
      return handlePlaylistDelete(ctx)
    case ctx.i18n.t('playlist_menu_back'):
      return sendMenu(ctx)
  }

  // picking a playlist
  const playlistIndex = ctx.dbuser.playlists.findIndex(
    ({ name }) => name === ctx.msg.text
  )
  if (playlistIndex !== -1) {
    return loadPlaylist(ctx, playlistIndex)
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
  ctx.dbuser.state = State.MainMenu
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
  return loadPlaylist(ctx, ctx.dbuser.selectedPlaylist)
}
