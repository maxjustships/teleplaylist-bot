import { describe, it, expect } from 'vitest'
import { translate, nameToCode } from './i18n'

describe('i18n helper', () => {
  it('should translate a simple key in English', () => {
    const result = translate('en', 'loading')
    expect(result).toBe('⏳ Loading...')
  })

  it('should translate a simple key in Russian', () => {
    const result = translate('ru', 'loading')
    expect(result).toBe('⏳ Загрузка...')
  })

  it('should handle arguments in translations', () => {
    const result = translate('en', 'playlist_menu_delete_prompt', {
      playlistName: 'My Hits',
    })
    expect(result).toMatch(
      /Are you sure you want to delete the .*My Hits.* playlist\?/
    )
  })

  it('should fallback to English if locale is not found', () => {
    const result = translate('non-existent', 'loading')
    expect(result).toBe('⏳ Loading...')
  })

  it('should return the ID if the message is not found', () => {
    const result = translate('en', 'non_existent_key')
    expect(result).toBe('non_existent_key')
  })

  it('should correctly map language names to codes', () => {
    expect(nameToCode['English']).toBe('en')
    expect(nameToCode['Русский']).toBe('ru')
    expect(nameToCode['Deutsch']).toBe('de')
  })
})
