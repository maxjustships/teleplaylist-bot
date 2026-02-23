import { Context as BaseContext } from 'grammy'
import * as schema from '@/db/schema'
import { DrizzleD1Database } from 'drizzle-orm/d1'

export interface Env {
  DB: D1Database
  TOKEN: string
  BOT_INFO?: string
  DONATION_LINK?: string
  DONATION_FREQUENCY?: string
}

type DbUser = typeof schema.users.$inferSelect & {
  playlists: (typeof schema.playlists.$inferSelect & {
    audios: (typeof schema.audios.$inferSelect)[]
  })[]
  lastBotMessages: (typeof schema.lastBotMessages.$inferSelect)[]
}

interface Context extends BaseContext {
  dbuser: DbUser
  db: DrizzleD1Database<typeof schema>
  env: Env
  t: (id: string, args?: any) => string
  useLocale: (locale: string) => Promise<void>
}

export default Context
export { DbUser }
