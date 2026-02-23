import { NextFunction } from 'grammy'
import Context from '@/models/Context'

async function configureI18n(ctx: Context, next: NextFunction) {
  await ctx.useLocale(ctx.dbuser.language)
  return next()
}

export default configureI18n
