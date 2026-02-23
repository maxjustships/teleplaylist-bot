import { locales, translate } from '@/helpers/i18n'

const localeCodes = Object.keys(locales)

export const mainMenuNewPlaylistText = getLocaleValuesForKey(
  'main_menu_keyboard_add'
)
export const mainMenuPrevPageText = getLocaleValuesForKey(
  'main_menu_keyboard_left'
)
export const mainMenuNextPageText = getLocaleValuesForKey(
  'main_menu_keyboard_right'
)
export const mainMenuLanguageText = getLocaleValuesForKey(
  'main_menu_keyboard_language'
)
export const mainMenuLanguageSelectText = getLocaleValuesForKey('name')
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
export const loadingText = getLocaleValuesForKey('loading')

export const serviceText = [
  loadingText,
  mainMenuNewPlaylistText,
  mainMenuPrevPageText,
  mainMenuNextPageText,
  playlistMenuRenameText,
  playlistMenuDeleteText,
  playlistMenuBackText,
  playlistMenuConfirmDeleteText,
  mainMenuLanguageText,
  mainMenuLanguageSelectText,
  menuCancelText,
].flat()

function getLocaleValuesForKey(key: string) {
  return localeCodes.map((code) => translate(code, key))
}
