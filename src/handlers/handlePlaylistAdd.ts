import Context from '@/models/Context'
import { State } from '@/models/User'

export default async function handlePlaylistAdd(ctx: Context) {
  ctx.dbuser.state = State.AwaitingPlaylistName
  await ctx.dbuser.save()
  return ctx.reply(ctx.i18n.t('playlist_add_name_prompt'), {
    reply_markup: {
      remove_keyboard: true,
    },
  })
}
