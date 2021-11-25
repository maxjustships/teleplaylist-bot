import Context from '@/models/Context'
import sendMenu from './handleMenu'

export default async function handlePlaylistBack(ctx: Context) {
  ctx.dbuser.selectedPlaylist = -1
  await ctx.dbuser.save()

  return sendMenu(ctx)
}
