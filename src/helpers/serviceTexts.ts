import { localesFiles } from '@/handlers/language'
import { readFileSync } from 'fs'
import { load } from 'js-yaml'

const localesData = localesFiles().map((locale) =>
  load(readFileSync(`${__dirname}/../../locales/${locale}`, 'utf8'))
)

export const mainMenuNewPlaylistText = getLocaleValuesForKey(
  'main_menu_keyboard_add'
)
export const mainMenuPrevPageText = getLocaleValuesForKey(
  'main_menu_keyboard_left'
)
export const mainMenuNextPageText = getLocaleValuesForKey(
  'main_menu_keyboard_right'
)
export const playlistMenuRenameText = getLocaleValuesForKey(
  'playlist_menu_rename'
)
export const playlistMenuDeleteText = getLocaleValuesForKey(
  'playlist_menu_delete'
)
export const playlistMenuBackText = getLocaleValuesForKey('playlist_menu_back')
export const playlistMenuConfirmDeleteText = getLocaleValuesForKey(
  'playlist_menu_confirm_delete'
)
export const menuCancelText = getLocaleValuesForKey('keyboard_cancel')

export const serviceText = [
  mainMenuNewPlaylistText,
  mainMenuPrevPageText,
  mainMenuNextPageText,
  playlistMenuRenameText,
  playlistMenuDeleteText,
  playlistMenuBackText,
  playlistMenuConfirmDeleteText,
  menuCancelText,
].flat()

function getLocaleValuesForKey(key: string) {
  return localesData.map((data) => data[key])
}
