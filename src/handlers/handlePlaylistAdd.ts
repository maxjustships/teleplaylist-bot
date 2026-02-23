import { Keyboard, NextFunction } from 'grammy'
import { State, updateUser } from '@/models/User'
import { menuCancelText, serviceText } from '@/helpers/serviceTexts'
import Context from '@/models/Context'
import sendMenu from '@/handlers/handleMenu'
import * as schema from '@/db/schema'

export async function handlePlaylistAddAwaitingName(ctx: Context) {
  await updateUser(ctx.db, ctx.from.id, { state: State.AwaitingName })

  const { message_id } = await ctx.reply(ctx.t('playlist_add_name_prompt'), {
    reply_markup: new Keyboard().text(ctx.t('keyboard_cancel')),
  })

  await ctx.db.insert(schema.lastBotMessages).values({
    userId: ctx.from.id,
    messageId: message_id,
  })
}

export async function handlePlaylistAddReceivedName(
  ctx: Context,
  next: NextFunction
) {
  if (ctx.dbuser.state !== State.AwaitingName) {
    return next()
  }

  const text = ctx.msg.text.trim()

  if (menuCancelText.includes(text)) {
    return sendMenu(ctx)
  }

  if (ctx.dbuser.playlists.some((playlist) => playlist.name === text)) {
    const { message_id } = await ctx.reply(
      ctx.t('playlist_add_name_error_exists')
    )
    await ctx.db.insert(schema.lastBotMessages).values({
      userId: ctx.from.id,
      messageId: message_id,
    })
    return
  }

  if (serviceText.includes(text)) {
    const { message_id } = await ctx.reply(
      ctx.t('playlist_add_name_error_service')
    )
    await ctx.db.insert(schema.lastBotMessages).values({
      userId: ctx.from.id,
      messageId: message_id,
    })
    return
  }

  await ctx.db.insert(schema.playlists).values({
    userId: ctx.from.id,
    name: text,
  })

  return sendMenu(ctx)
}
