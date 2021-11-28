import Context from '@/models/Context'
import deleteAudio from './deleteAudio'
import sendMenu from './handleMenu'

export default async function handlePlaylistBack(ctx: Context) {
  await deleteAudio(ctx)

  ctx.dbuser.selectedPlaylist = -1
  await ctx.dbuser.save()

  return sendMenu(ctx)
}
