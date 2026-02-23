import Context from '@/models/Context'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function deleteLastMessages(ctx: Context) {
  if (ctx.dbuser.lastBotMessages.length > 0) {
    await Promise.allSettled(
      ctx.dbuser.lastBotMessages.map((msg) =>
        ctx.api.deleteMessage(ctx.chat.id, msg.messageId).catch(() => {
          // do nothing, message simply does not exist
        })
      )
    )

    await ctx.db
      .delete(schema.lastBotMessages)
      .where(eq(schema.lastBotMessages.userId, ctx.from.id))
  }
}
