import { InlineKeyboard, NextFunction } from 'grammy'
import { State, updateUser } from '@/models/User'
import { serviceText } from '@/helpers/serviceTexts'
import Context from '@/models/Context'
import sendMenu from '@/handlers/handleMenu'
import * as schema from '@/db/schema'
import deleteLastMessages from '@/helpers/deleteLastMessages'

export async function handlePlaylistAddAwaitingName(ctx: Context) {
  await updateUser(ctx.db, ctx.from.id, { state: State.AwaitingName })

  const text = ctx.t('playlist_add_name_prompt')
  const reply_markup = new InlineKeyboard().text(
    ctx.t('keyboard_cancel'),
    'cancel'
  )

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
      // Edit failed
    }
  }

  await deleteLastMessages(ctx)
  const sent = await ctx.reply(text, {
    reply_markup,
  })

  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from.id,
    messageId: sent.message_id,
  })
  await ctx.answerCallbackQuery()
}

export async function handlePlaylistAddReceivedName(
  ctx: Context,
  next: NextFunction
) {
  if (ctx.dbuser.state !== State.AwaitingName || !ctx.msg?.text) {
    return next()
  }

  const text = ctx.msg.text.trim()

  if (ctx.dbuser.playlists.some((playlist) => playlist.name === text)) {
    // We send error and then wait for another name.
    // For simplicity, we just send a new message and then delete it later,
    // or we could edit the main message to show the error.
    // Let's edit the main message to show the error.
    const errorText = ctx.t('playlist_add_name_error_exists')
    if (ctx.dbuser.lastBotMessages.length > 0) {
      const lastMsg =
        ctx.dbuser.lastBotMessages[ctx.dbuser.lastBotMessages.length - 1]
      await ctx.api.editMessageText(ctx.chat.id, lastMsg.messageId, errorText, {
        reply_markup: new InlineKeyboard().text(
          ctx.t('keyboard_cancel'),
          'cancel'
        ),
      })
    }
    return
  }

  if (serviceText.includes(text)) {
    const errorText = ctx.t('playlist_add_name_error_service')
    if (ctx.dbuser.lastBotMessages.length > 0) {
      const lastMsg =
        ctx.dbuser.lastBotMessages[ctx.dbuser.lastBotMessages.length - 1]
      await ctx.api.editMessageText(ctx.chat.id, lastMsg.messageId, errorText, {
        reply_markup: new InlineKeyboard().text(
          ctx.t('keyboard_cancel'),
          'cancel'
        ),
      })
    }
    return
  }

  await ctx.db.insert(schema.playlists).values({
    userId: ctx.from.id,
    name: text,
  })

  return sendMenu(ctx)
}
