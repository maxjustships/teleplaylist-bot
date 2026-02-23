import { NextFunction } from 'grammy'
import { findOrCreateUser } from '@/models/User'
import Context from '@/models/Context'

export default async function attachUser(ctx: Context, next: NextFunction) {
  if (!ctx.from?.id) return next()
  const user = await findOrCreateUser(ctx.db, ctx.from.id)
  ctx.dbuser = user
  return next()
}
