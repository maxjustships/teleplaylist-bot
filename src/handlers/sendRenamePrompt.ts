import Context from '@/models/Context'
import { State } from '@/models/User'

export default async function sendRenamePrompt(ctx: Context) {
  ctx.dbuser.state = State.AwaitingPlaylistRename
  await ctx.dbuser.save()
  return ctx.reply(
    ctx.i18n.t('playlist_rename_prompt', {
      playlistName: ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].name,
    }),
    {
      reply_markup: { remove_keyboard: true },
    }
  )
}
