import Context from '@/models/Context'
import sendMenu from './sendMenu'

export default async function handlePlaylistDelete(ctx: Context) {
  const playlistIndex = ctx.dbuser.selectedPlaylist
  ctx.dbuser.playlists.splice(playlistIndex, 1)
  await ctx.dbuser.save()
  return sendMenu(ctx)
}
