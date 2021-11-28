import Context from '@/models/Context'

export async function handleDeleteAudio(ctx: Context) {
  const messageId = ctx.callbackQuery.message.message_id

  const deletedSongIndex = ctx.dbuser.playlists[
    ctx.dbuser.selectedPlaylist
  ].audio.findIndex((audio) => audio.messageId === messageId)
  if (deletedSongIndex === -1) {
    return
  }

  ctx.dbuser.playlists[ctx.dbuser.selectedPlaylist].audio.splice(
    deletedSongIndex,
    1
  )

  return Promise.all([
    ctx.dbuser.save(),
    ctx.api.deleteMessage(ctx.chat.id, messageId),
  ])
}
