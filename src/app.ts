import 'reflect-metadata'
// Setup @/ aliases for modules
import 'module-alias/register'
// Dependencies
import handleAddAudio from '@/handlers/handleAudioAdd'
import handleDeleteAudio from '@/handlers/handleAudioDelete'
import sendMenu from '@/handlers/handleMenu'
import {
  handlePaginationNext,
  handlePaginationPrev,
} from '@/handlers/handlePagination'
import {
  handlePlaylistAddAwaitingName,
  handlePlaylistAddReceivedName,
} from '@/handlers/handlePlaylistAdd'
import handlePlaylistBack from '@/handlers/handlePlaylistBack'
import {
  handlePlaylistDeleteAwaitingConfirmation,
  handlePlaylistDeleteReceivedReply,
} from '@/handlers/handlePlaylistDelete'
import { handlePlaylistLoad } from '@/handlers/handlePlaylistLoad'
import {
  handlePlaylistRenameAwaitingRename,
  handlePlaylistRenameReceivedReply,
} from '@/handlers/handlePlaylistRename'
import { localeActions, sendLanguage, setLanguage } from '@/handlers/language'
import blockIfPublic from '@/helpers/blockIfPublic'
import bot from '@/helpers/bot'
import i18n from '@/helpers/i18n'
import removeStalePlaylists from '@/helpers/removeStalePlaylist'
import removeUserInput from '@/helpers/removeUserInput'
import requireState from '@/helpers/requireState'
import {
  mainMenuLanguageSelectText,
  mainMenuLanguageText,
  mainMenuNewPlaylistText,
  mainMenuNextPageText,
  mainMenuPrevPageText,
  playlistMenuBackText,
  playlistMenuConfirmDeleteText,
  playlistMenuDeleteText,
  playlistMenuRenameText,
} from '@/helpers/serviceTexts'
import startMongo from '@/helpers/startMongo'
import attachUser from '@/middlewares/attachUser'
import configureI18n from '@/middlewares/configureI18n'
import ignoreOldMessageUpdates from '@/middlewares/ignoreOldMessageUpdates'
import sequentialize from '@/middlewares/sequentialize'
import { State } from '@/models/User'
import { run } from '@grammyjs/runner'

const STALE_PLAYLIST_DELETION_RATE = 60 * 60 * 1000 // 1 hour

async function runApp() {
  console.log('Starting app!')
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

  // autodelete users with playlists open too long
  setInterval(removeStalePlaylists(), STALE_PLAYLIST_DELETION_RATE)

  // Actions
  bot.callbackQuery(localeActions, setLanguage)
  bot.callbackQuery('deleteAudio', handleDeleteAudio)
  // Errors
  bot.catch(async (err) => {
    console.error(err)

    const ctx = err.ctx
    await ctx.api.sendMessage(
      process.env.ADMIN,
      `
\`\`\`
${JSON.stringify(err)}
\`\`\`
    `
    )
  })
  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
