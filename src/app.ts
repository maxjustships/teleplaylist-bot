import 'reflect-metadata'
// Setup @/ aliases for modules
import 'module-alias/register'
// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Dependencies
import { localeActions } from '@/handlers/language'
import { run } from '@grammyjs/runner'
import { sendLanguage, setLanguage } from '@/handlers/language'
import attachUser from '@/middlewares/attachUser'
import bot from '@/helpers/bot'
import configureI18n from '@/middlewares/configureI18n'
import i18n from '@/helpers/i18n'
import ignoreOldMessageUpdates from '@/middlewares/ignoreOldMessageUpdates'
import sendHelp from '@/handlers/sendHelp'
import sequentialize from '@/middlewares/sequentialize'
import startMongo from '@/helpers/startMongo'
import { brotliDecompress } from 'zlib'
import sendMenu from './handlers/sendMenu'
import handlePlaylistAdd from './handlers/handlePlaylistAdd'
import handleMessage from './handlers/handleMessage'
import { handlePlaylistLoad } from './handlers/handlePlaylistLoad'
import handlePlaylistDelete from './handlers/handlePlaylistDelete'
import handlePlaylistRename from './handlers/handlePlaylistRename'
import handlePlaylistBack from './handlers/handlePlaylistBack'

async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')
  // Middlewares
  bot.use(sequentialize)
  bot.use(ignoreOldMessageUpdates)
  bot.use(attachUser)
  bot.use(i18n.middleware())
  bot.use(configureI18n)
  // Commands
  bot.command('help', sendHelp)
  bot.command(['start', 'menu'], sendMenu)
  bot.command('language', sendLanguage)
  // Events
  bot.on('message:text', handleMessage)
  // Actions
  bot.callbackQuery(localeActions, setLanguage)
  bot.callbackQuery('playlist-add', handlePlaylistAdd)
  bot.callbackQuery('playlist-back', handlePlaylistBack)
  bot.callbackQuery(/^select-/, handlePlaylistLoad)
  bot.callbackQuery(/^rename-/, handlePlaylistRename)
  bot.callbackQuery(/^delete-/, handlePlaylistDelete)
  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
