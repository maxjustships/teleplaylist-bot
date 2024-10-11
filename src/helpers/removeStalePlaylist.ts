import sendMenu from '@/handlers/handleMenu'
import handlePlaylistBack from '@/handlers/handlePlaylistBack'
import bot from '@/helpers/bot'
import i18n from '@/helpers/i18n'
import Context from '@/models/Context'
import { State, User, UserModel } from '@/models/User'
import { DocumentType } from '@typegoose/typegoose'

const PLAYLIST_OPEN_TOO_LONG_MS = 36 * 60 * 60 * 1000 // 36 hours

export default function removeStalePlaylists(): () => void {
  return async () => {
    const hours36Ago = Date.now() - PLAYLIST_OPEN_TOO_LONG_MS

    const usersWithStalePlaylists = await UserModel.find({
      state: State.PlaylistMenu,
      lastPlaylistActiveTimestamp: { $lt: Number(hours36Ago) },
    })

    await Promise.all(
      usersWithStalePlaylists.map(async (user) => {
        const doc = user as DocumentType<User>
        const i18nContext = i18n.createContext(doc.language, {})
        const fakeContext = {
          dbuser: doc,
          i18n: i18nContext,
          reply: (text: string, other?: unknown) =>
            bot.api.sendMessage(user.id as number, text, other),
          api: bot.api,
          chat: {
            id: user.id as number,
            type: 'private',
          },
        }
        await handlePlaylistBack(fakeContext as Context)
        return sendMenu(fakeContext as Context)
      })
    )
  }
}
