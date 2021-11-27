import * as findorcreate from 'mongoose-findorcreate'
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelForClass, plugin, prop } from '@typegoose/typegoose'

export class Audio {
  @prop()
  public messageId: number
  @prop()
  public fileId: string
}

export class Playlist {
  @prop()
  public name: string
  @prop({ default: [] })
  public audio: Audio[]
}

export enum State {
  MainMenu = 'main_menu',
  PlaylistMenu = 'playlist_menu',
  AwaitingName = 'awaiting_playlist_name',
  AwaitingPlaylistDeletion = 'awaiting_playlist_deletion',
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

  @prop({ default: 0 })
  selectedPage: number
}

const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
})

export function findOrCreateUser(id: number) {
  return UserModel.findOrCreate({ id })
}
