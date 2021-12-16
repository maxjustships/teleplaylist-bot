import Context from '@/models/Context'
import sendMenu from '@/handlers/handleMenu'

export default function sendHelp(ctx: Context) {
  return sendMenu(ctx)
}
