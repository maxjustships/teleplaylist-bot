import Context from '@/models/Context'
import { NextFunction } from 'grammy'

export default async function blockIfPublic(ctx: Context, next: NextFunction) {
  if (ctx.chat.type !== 'private') {
    return
  }

  return next()
}
