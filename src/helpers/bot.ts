import { Bot } from 'grammy'
import Context from '@/models/Context'

export function createBot(token: string) {
  return new Bot<Context>(token)
}

export default createBot
