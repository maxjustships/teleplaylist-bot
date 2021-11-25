import Context from '@/models/Context'
import { NextFunction } from 'grammy'

export default function sendHelp(ctx: Context, next: NextFunction) {
  return ctx.reply(ctx.i18n.t('help'))
}
