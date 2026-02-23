import { Bot, webhookCallback } from 'grammy'
import { drizzle } from 'drizzle-orm/d1'
import Context, { Env } from '@/models/Context'
import * as schema from '@/db/schema'
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
import fluent from '@/helpers/i18n'
import removeStalePlaylists from '@/helpers/removeStalePlaylist'
import removeUserInput from '@/helpers/removeUserInput'
import requireState from '@/helpers/requireState'
import {
  mainMenuLanguageSelectText,
  mainMenuLanguageText,
  mainMenuNewPlaylistText,
  mainMenuPrevPageText,
  mainMenuNextPageText,
  playlistMenuBackText,
  playlistMenuConfirmDeleteText,
  playlistMenuDeleteText,
  playlistMenuRenameText,
} from '@/helpers/serviceTexts'
import attachUser from '@/middlewares/attachUser'
import configureI18n from '@/middlewares/configureI18n'
import ignoreOldMessageUpdates from '@/middlewares/ignoreOldMessageUpdates'
import { State } from '@/models/User'

let bot: Bot<Context>

function setupBot(env: Env) {
  if (bot) return bot

  bot = new Bot<Context>(env.TOKEN)

  // Middlewares
  bot.use(ignoreOldMessageUpdates)
  bot.use(async (ctx, next) => {
    ctx.db = drizzle(env.DB, { schema })
    ctx.env = env
    await next()
  })
  bot.use(attachUser)
  bot.use(fluent)
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
  bot.catch((err) => {
    console.error(err)
  })

  return bot
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    const bot = setupBot(env)
    const handleUpdate = webhookCallback(bot, 'cloudflare')
    return handleUpdate(request)
  },

  async scheduled(
    _controller: ScheduledController,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<void> {
    const bot = setupBot(env)
    const db = drizzle(env.DB, { schema })
    await removeStalePlaylists(db, bot, env)
  },
}
