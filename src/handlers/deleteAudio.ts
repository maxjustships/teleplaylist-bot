import Context from '@/models/Context'

export default async function deleteAudio(ctx: Context) {
  const selectedPlaylist = ctx.dbuser.playlists.find(
    (p) => p.id === ctx.dbuser.selectedPlaylistId
  )
  if (!selectedPlaylist) return

  await Promise.all(
    selectedPlaylist.audios.map(({ messageId }) =>
      ctx.api.deleteMessage(ctx.chat.id, messageId).catch(() => {
        // user removed the song on their own. do nothing, yet
      })
    )
  )
}
