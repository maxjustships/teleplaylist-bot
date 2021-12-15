import { NextFunction } from 'grammy'
import { State } from '@/models/User'
import Context from '@/models/Context'

export default function requireState(state: State) {
  return function (ctx: Context, next: NextFunction) {
    if (ctx.dbuser.state === state) {
      return next()
    }
  }
}
