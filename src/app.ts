import { Bot } from 'grammy'
import { UserFromGetMe } from 'grammy/types'
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
  handlePlaylistDeleteConfirm,
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
import attachUser from '@/middlewares/attachUser'
import ignoreOldMessageUpdates from '@/middlewares/ignoreOldMessageUpdates'
import { State } from '@/models/User'

// Cache botInfo to avoid fetch on every request
let botInfo: UserFromGetMe | undefined

function setupBot(env: Env) {
  const bot = new Bot<Context>(env.TOKEN, { botInfo })

  // Middlewares
  bot.use(ignoreOldMessageUpdates)
  bot.use(async (ctx, next) => {
    ctx.db = drizzle(env.DB, { schema })
    ctx.env = env
    await next()
  })
  bot.use(attachUser)
  bot.use(fluent)
  bot.use(blockIfPublic)

  // Commands
  bot.command('start', async (ctx) => {
    await ctx.api.deleteMessage(ctx.chat.id, ctx.msg.message_id).catch(() => {})
    return sendMenu(ctx)
  })

  // Events
  bot.on('message:audio', requireState(State.PlaylistMenu), handleAddAudio)
  bot.on('message:text', handlePlaylistAddReceivedName)
  bot.on('message:text', handlePlaylistRenameReceivedReply)
  bot.on('message', removeUserInput)

  // Actions
  bot.callbackQuery('ignore', (ctx) => ctx.answerCallbackQuery())
  bot.callbackQuery('nav_prev', handlePaginationPrev)
  bot.callbackQuery('nav_next', handlePaginationNext)
  bot.callbackQuery('add_playlist', handlePlaylistAddAwaitingName)
  bot.callbackQuery('language', sendLanguage)
  bot.callbackQuery('cancel', sendMenu)
  bot.callbackQuery('playlist_back', handlePlaylistBack)
  bot.callbackQuery('rename_playlist', handlePlaylistRenameAwaitingRename)
  bot.callbackQuery('delete_playlist', handlePlaylistDeleteAwaitingConfirmation)
  bot.callbackQuery('confirm_delete', handlePlaylistDeleteConfirm)
  bot.callbackQuery(/^open_playlist:\d+$/, handlePlaylistLoad)
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
    try {
      if (request.method === 'POST') {
        // Initialize bot info if not cached
        if (!botInfo) {
          if (env.BOT_INFO) {
            try {
              botInfo = JSON.parse(env.BOT_INFO)
            } catch (e) {
              console.error('Failed to parse BOT_INFO:', e)
            }
          }

          if (!botInfo) {
            // Create temporary bot to fetch info
            const tempBot = new Bot(env.TOKEN)
            botInfo = await tempBot.api.getMe()
          }
        }

        const bot = setupBot(env)
        const update = await request.json()
        await bot.handleUpdate(update)
        return new Response('OK')
      }

      return new Response('Not Found', { status: 404 })
    } catch (err) {
      console.error(err)
      return new Response('Internal Server Error', { status: 500 })
    }
  },

  async scheduled(
    _controller: ScheduledController,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<void> {
    const bot = setupBot(env)
    if (!botInfo) {
      botInfo = await bot.api.getMe()
    }
    const db = drizzle(env.DB, { schema })
    await removeStalePlaylists(db, bot, env)
  },
}
