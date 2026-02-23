import sendMenu from '@/handlers/handleMenu'
import Context from '@/models/Context'
import { State, updateUser } from '@/models/User'
import { Keyboard } from 'grammy'
import { locales, nameToCode } from '@/helpers/i18n'
import * as schema from '@/db/schema'

export const localeActions = Object.keys(locales)

export async function sendLanguage(ctx: Context) {
  await updateUser(ctx.db, ctx.from!.id, { state: State.AwaitingLanguage })

  const { message_id } = await ctx.reply(ctx.t('language'), {
    reply_markup: languageKeyboard(),
  })

  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from!.id,
    messageId: message_id,
  })
}

export async function setLanguage(ctx: Context) {
  const text = ctx.callbackQuery?.data || ctx.msg?.text

  if (!text) return

  if (!(text in nameToCode) && !(text in locales)) {
    const { message_id } = await ctx.reply(ctx.t('language_select_error'))
    await ctx.db.insert(schema.lastBotMessages).values({
      userId: ctx.from!.id,
      messageId: message_id,
    })
    return
  }

  const langCode = (nameToCode[text] || text) as string

  await updateUser(ctx.db, ctx.from!.id, { language: langCode })
  await ctx.useLocale(langCode)

  return sendMenu(ctx)
}

const LANGS_PER_ROW = 2

function languageKeyboard() {
  const keyboard = new Keyboard()
  Object.values(locales).forEach((transStr, index) => {
    // Extract name from Fluent string: "name = English"
    const nameMatch = transStr.match(/name\s*=\s*(.+)/)
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown'
    keyboard.text(name)
    if ((index + 1) % LANGS_PER_ROW == 0) {
      keyboard.row()
    }
  })
  return keyboard
}
