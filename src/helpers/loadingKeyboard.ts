import { Keyboard } from 'grammy'
import Context from '@/models/Context'

export default function getLoadingKeyboard(ctx: Context): Keyboard {
  return new Keyboard().text(ctx.i18n.t('loading'))
}
