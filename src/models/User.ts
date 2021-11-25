import * as findorcreate from 'mongoose-findorcreate'
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelForClass, plugin, prop } from '@typegoose/typegoose'

export class Playlist {
  @prop()
  public name: string
  @prop({ default: [] })
  public songIds: string[]
}

export enum State {
  MainMenu = 'main_menu',
  PlaylistMenu = 'playlist_menu',
  AwaitingPlaylistName = 'awaiting_playlist_name',
  AwaitingPlaylistRename = 'awaiting_playlist_rename',
}

@plugin(findorcreate)
export class User extends FindOrCreate {
  @prop({ required: true, index: true, unique: true })
  id: number

  @prop({ required: true, default: 'en' })
  language: string

  @prop({ type: () => Playlist, default: [] })
  playlists: Playlist[]

  @prop({ enum: State, default: State.MainMenu })
  state: State

  @prop({ default: -1 })
  selectedPlaylist: number
}

const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
})

export function findOrCreateUser(id: number) {
  return UserModel.findOrCreate({ id })
}
