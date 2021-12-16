import { Keyboard } from 'grammy'
import { State } from '@/models/User'
import { load } from 'js-yaml'
import { readFileSync, readdirSync } from 'fs'
import Context from '@/models/Context'
import sendMenu from '@/handlers/handleMenu'

export const localeActions = localesFiles().map((file) => file.split('.')[0])
const nameToCode = Object.fromEntries(
  localesFiles().map((locale) => {
    const localeCode = locale.split('.')[0]
    const localeName = load(
      readFileSync(`${__dirname}/../../locales/${locale}`, 'utf8')
    ).name as string

    return [localeName, localeCode]
  })
)

export async function sendLanguage(ctx: Context) {
  ctx.dbuser.state = State.AwaitingLanguage

  const { message_id } = await ctx.reply(ctx.i18n.t('language'), {
    reply_markup: languageKeyboard(),
  })

  ctx.dbuser.lastBotMessages.push(message_id)

  await ctx.dbuser.save()
}

export async function setLanguage(ctx: Context) {
  if (!(ctx.msg.text in nameToCode)) {
    const { message_id } = await ctx.reply(ctx.i18n.t('language_select_error'))
    ctx.dbuser.lastBotMessages.push(message_id)
    return ctx.dbuser.save()
  }

  ctx.dbuser.language = nameToCode[ctx.msg.text]
  ctx.i18n.locale(nameToCode[ctx.msg.text])

  return sendMenu(ctx)
}

const LANGS_PER_ROW = 2

function languageKeyboard() {
  const locales = localesFiles()
  const keyboard = new Keyboard()
  locales.forEach((locale, index) => {
    const localeName = load(
      readFileSync(`${__dirname}/../../locales/${locale}`, 'utf8')
    ).name as string
    keyboard.text(localeName)
    if (index % LANGS_PER_ROW != 0) {
      keyboard.row()
    }
  })
  return keyboard
}

export function localesFiles() {
  return readdirSync(`${__dirname}/../../locales`)
}
