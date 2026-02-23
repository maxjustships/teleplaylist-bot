import sendMenu from '@/handlers/handleMenu'
import Context from '@/models/Context'
import { State, updateUser } from '@/models/User'
import { InlineKeyboard } from 'grammy'
import { locales, nameToCode } from '@/helpers/i18n'
import * as schema from '@/db/schema'
import deleteLastMessages from '@/helpers/deleteLastMessages'

export const localeActions = Object.keys(locales)

export async function sendLanguage(ctx: Context) {
  await updateUser(ctx.db, ctx.from!.id, { state: State.AwaitingLanguage })

  const text = ctx.t('language')
  const reply_markup = languageKeyboard()

  if (ctx.dbuser.lastBotMessages.length > 0) {
    const lastMsg =
      ctx.dbuser.lastBotMessages[ctx.dbuser.lastBotMessages.length - 1]
    try {
      await ctx.api.editMessageText(ctx.chat.id, lastMsg.messageId, text, {
        reply_markup,
      })
      await ctx.answerCallbackQuery()
      return
    } catch {
      // Edit failed, send new message
    }
  }

  await deleteLastMessages(ctx)
  const sent = await ctx.reply(text, {
    reply_markup,
  })

  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from!.id,
    messageId: sent.message_id,
  })
  await ctx.answerCallbackQuery()
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
  await ctx.answerCallbackQuery()

  return sendMenu(ctx)
}

const LANGS_PER_ROW = 2

function languageKeyboard() {
  const keyboard = new InlineKeyboard()
  Object.keys(locales).forEach((code, index) => {
    const transStr = locales[code]
    // Extract name from Fluent string: "name = English"
    const nameMatch = (transStr as any).match(/name\s*=\s*(.+)/)
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown'
    keyboard.text(name, code)
    if ((index + 1) % LANGS_PER_ROW == 0) {
      keyboard.row()
    }
  })
  return keyboard
}
