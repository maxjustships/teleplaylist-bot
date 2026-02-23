import { InlineKeyboard } from 'grammy'
import Context from '@/models/Context'

export default function getLoadingKeyboard(ctx: Context): InlineKeyboard {
  return new InlineKeyboard().text(ctx.t('loading'), 'ignore')
}
