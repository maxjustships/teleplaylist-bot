import Context from '@/models/Context'

export default function deleteAudio(ctx: Context) {
  return Promise.all(
    ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].audio.map(
      ({ messageId }) =>
        ctx.api.deleteMessage(ctx.chat.id, messageId).catch(() => {
          // user removed the song on their own. do nothing, yet
        })
    )
  )
}
