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
import sequentialize from '@/middlewares/sequentialize'
import startMongo from '@/helpers/startMongo'
import { brotliDecompress } from 'zlib'
import sendMenu from './handlers/handleMenu'
import {
  handlePlaylistAddAwaitingName,
  handlePlaylistAddReceivedName,
} from './handlers/handlePlaylistAdd'
import {
  handlePlaylistDeleteAwaitingConfirmation,
  handlePlaylistDeleteReceivedReply,
} from './handlers/handlePlaylistDelete'
import handlePlaylistBack from './handlers/handlePlaylistBack'
import {
  mainMenuNewPlaylistText,
  mainMenuPrevPageText,
  menuCancelText,
  playlistMenuBackText,
  playlistMenuConfirmDeleteText,
  playlistMenuRenameText,
  serviceText,
} from './helpers/serviceTexts'
import removeUserInput from './helpers/removeUserInput'
import {
  handlePaginationNext,
  handlePaginationPrev,
} from './handlers/handlePagination'
import {
  mainMenuNextPageText,
  playlistMenuDeleteText,
} from './helpers/serviceTexts'
import { handlePlaylistLoad } from './handlers/handlePlaylistLoad'
import { requireState } from './helpers/requireState'
import { State } from './models/User'
import {
  handlePlaylistRenameAwaitingRename,
  handlePlaylistRenameReceivedReply,
} from './handlers/handlePlaylistRename'
import { handleAddAudio } from './handlers/handleAudioAdd'
import { handleDeleteAudio } from './handlers/handleAudioDelete'
import Context from './models/Context'
import {
  mainMenuLanguageText,
  mainMenuLanguageSelectText,
} from './helpers/serviceTexts'
import blockIfPublic from './helpers/blockIfPublic'

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
  bot.use(blockIfPublic)

  // Commands
  bot.command('start', sendMenu)
  // Events
  bot.on('message', removeUserInput)
  bot.hears(
    mainMenuNewPlaylistText,
    requireState(State.MainMenu),
    handlePlaylistAddAwaitingName
  )
  bot.hears(
    mainMenuPrevPageText,
    requireState(State.MainMenu),
    handlePaginationPrev
  )
  bot.hears(
    mainMenuNextPageText,
    requireState(State.MainMenu),
    handlePaginationNext
  )
  bot.hears(mainMenuLanguageText, requireState(State.MainMenu), sendLanguage)
  bot.hears(
    mainMenuLanguageSelectText,
    requireState(State.AwaitingLanguage),
    setLanguage
  )
  bot.hears(
    playlistMenuBackText,
    requireState(State.PlaylistMenu),
    handlePlaylistBack
  )
  bot.hears(
    playlistMenuDeleteText,
    requireState(State.PlaylistMenu),
    handlePlaylistDeleteAwaitingConfirmation
  )
  bot.hears(
    playlistMenuConfirmDeleteText,
    requireState(State.AwaitingPlaylistDeletion),
    handlePlaylistDeleteReceivedReply
  )
  bot.hears(
    playlistMenuRenameText,
    requireState(State.PlaylistMenu),
    handlePlaylistRenameAwaitingRename
  )
  bot.on('message:audio', requireState(State.PlaylistMenu), handleAddAudio)
  bot.on('message:text', handlePlaylistAddReceivedName)
  bot.on('message:text', handlePlaylistLoad)
  bot.on('message:text', handlePlaylistRenameReceivedReply)
  bot.on('message:text', handlePlaylistDeleteReceivedReply)

  // Actions
  bot.callbackQuery(localeActions, setLanguage)
  bot.callbackQuery('deleteAudio', handleDeleteAudio)
  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
