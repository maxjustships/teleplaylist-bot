import Context from '@/models/Context'
import { NextFunction } from 'grammy'
import { State } from '@/models/User'

export function requireState(state: State) {
  return function (ctx: Context, next: NextFunction) {
    if (ctx.dbuser.state === state) {
      return next()
    }
  }
}
