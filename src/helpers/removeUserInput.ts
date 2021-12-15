import { NextFunction } from 'grammy'
import Context from '@/models/Context'

export default async function removeUserInput(
  ctx: Context,
  next: NextFunction
) {
  await ctx.api.deleteMessage(ctx.chat.id, ctx.msg.message_id)
  return next()
}
