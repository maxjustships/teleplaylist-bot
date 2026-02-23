import { NextFunction } from 'grammy'
import { fetchUser, findOrCreateUser } from '@/models/User'
import Context from '@/models/Context'

export default async function attachUser(ctx: Context, next: NextFunction) {
  if (!ctx.from?.id) return next()
  const user = await findOrCreateUser(ctx.db, ctx.from.id)
  ctx.dbuser = user

  ctx.refetchUser = async () => {
    const freshUser = await fetchUser(ctx.db, ctx.from!.id)
    if (freshUser) {
      ctx.dbuser = freshUser
    }
  }

  return next()
}
