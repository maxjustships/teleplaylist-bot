import Context from '@/models/Context'

export default async function deleteLastMessages(ctx: Context) {
  if (ctx.dbuser.lastBotMessages.length > 0) {
    await Promise.allSettled(
      ctx.dbuser.lastBotMessages.map((messageId) =>
        ctx.api.deleteMessage(ctx.chat.id, messageId).catch(() => {
          // do nothing, message simply does not exist
        })
      )
    )
    ctx.dbuser.lastBotMessages = []
    await ctx.dbuser.save()
  }
}
