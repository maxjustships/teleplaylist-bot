import Context from '@/models/Context'
import deleteAudio from '@/handlers/deleteAudio'
import sendMenu from '@/handlers/handleMenu'
import { updateUser } from '@/models/User'

export default async function handlePlaylistBack(ctx: Context) {
  await deleteAudio(ctx)

  await updateUser(ctx.db, ctx.from.id, {
    selectedPlaylistId: null,
  })

  await ctx.answerCallbackQuery()
  return sendMenu(ctx)
}
