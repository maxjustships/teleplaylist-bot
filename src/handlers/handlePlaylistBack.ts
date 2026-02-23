import Context from '@/models/Context'
import deleteAudio from '@/handlers/deleteAudio'
import getLoadingKeyboard from '@/helpers/loadingKeyboard'
import sendMenu from '@/handlers/handleMenu'
import { updateUser } from '@/models/User'
import * as schema from '@/db/schema'

export default async function handlePlaylistBack(ctx: Context) {
  const { message_id } = await ctx.reply(ctx.t('loading'), {
    reply_markup: getLoadingKeyboard(ctx),
  })

  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from.id,
    messageId: message_id,
  })

  await deleteAudio(ctx)

  await updateUser(ctx.db, ctx.from.id, {
    selectedPlaylistId: null,
  })

  return sendMenu(ctx)
}
