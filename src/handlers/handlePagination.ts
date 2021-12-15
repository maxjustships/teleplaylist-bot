import { State } from '@/models/User'
import Context from '@/models/Context'
import sendMenu from '@/handlers/handleMenu'

export function handlePaginationPrev(ctx: Context) {
  if (ctx.dbuser.state !== State.MainMenu) {
    return
  }
  ctx.dbuser.selectedPage -= 1
  return sendMenu(ctx)
}

export function handlePaginationNext(ctx: Context) {
  if (ctx.dbuser.state !== State.MainMenu) {
    return
  }
  ctx.dbuser.selectedPage += 1
  return sendMenu(ctx)
}
