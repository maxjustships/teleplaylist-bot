import { Context as BaseContext } from 'grammy'
import { FluentContext } from '@grammyjs/fluent'
import * as schema from '@/db/schema'
import { DrizzleD1Database } from 'drizzle-orm/d1'

export interface Env {
  DB: D1Database
  TOKEN: string
  DONATION_LINK?: string
  DONATION_FREQUENCY?: string
}

type DbUser = typeof schema.users.$inferSelect & {
  playlists: (typeof schema.playlists.$inferSelect & {
    audios: (typeof schema.audios.$inferSelect)[]
  })[]
  lastBotMessages: (typeof schema.lastBotMessages.$inferSelect)[]
}

interface Context extends BaseContext, FluentContext {
  dbuser: DbUser
  db: DrizzleD1Database<typeof schema>
  env: Env
}

export default Context
export { DbUser }
