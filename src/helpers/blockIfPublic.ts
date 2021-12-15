import { NextFunction } from 'grammy'
import Context from '@/models/Context'

export default function blockIfPublic(ctx: Context, next: NextFunction) {
  if (ctx.chat.type !== 'private') {
    return
  }

  return next()
}
