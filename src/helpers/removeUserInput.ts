import Context from '@/models/Context'
import { NextFunction } from 'grammy'

export default function removeUserInput(ctx: Context, next: NextFunction) {
  ctx.api.deleteMessage(ctx.chat.id, ctx.msg.message_id)
  return next()
}
