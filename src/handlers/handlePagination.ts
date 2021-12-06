import Context from '@/models/Context'
import { State } from '@/models/User'
import sendMenu from '@/handlers/handleMenu'

export async function handlePaginationPrev(ctx: Context) {
  if (ctx.dbuser.state !== State.MainMenu) {
    return
  }
  ctx.dbuser.selectedPage -= 1
  return sendMenu(ctx)
}

export async function handlePaginationNext(ctx: Context) {
  if (ctx.dbuser.state !== State.MainMenu) {
    return
  }
  ctx.dbuser.selectedPage += 1
  return sendMenu(ctx)
}
