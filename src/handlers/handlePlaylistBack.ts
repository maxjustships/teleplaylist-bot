import Context from '@/models/Context'
import deleteAudio from '@/handlers/deleteAudio'
import getLoadingKeyboard from '@/helpers/loadingKeyboard'
import sendMenu from '@/handlers/handleMenu'

export default async function handlePlaylistBack(ctx: Context) {
  const { message_id } = await ctx.reply(ctx.i18n.t('loading'), {
    reply_markup: getLoadingKeyboard(ctx),
  })
  ctx.dbuser.lastBotMessages.push(message_id)
  await deleteAudio(ctx)

  ctx.dbuser.selectedPlaylist = -1
  await ctx.dbuser.save()

  return sendMenu(ctx)
}
