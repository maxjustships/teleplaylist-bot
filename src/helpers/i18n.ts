import { FluentBundle, FluentResource } from '@fluent/bundle'
import { NextFunction } from 'grammy'
import Context from '@/models/Context'

export const locales = {
  de: `
name = Deutsch
language = Bitte wählen Sie die Sprache.
language_select_error = Bitte wählen Sie die korrekte Sprache.
main_menu =
  🎵 Anzahl der Wiedergabelisten: { $playlistAmount }.
  
  { $mainInfo }
  Dieser Bot spricht Deutsch. Sie können die Sprache unten ändern.
  
  Wenn Sie dieses Menü erneut anzeigen möchten, falls Sie es gelöscht haben, geben Sie einfach /start ein.
  
  { $donationInfo }
main_menu_info_empty = 🤔 Um den Bot zu starten, fügen Sie einfach eine Wiedergabeliste hinzu, indem Sie die Option im Menü unten auswählen.
main_menu_info = 🎶 Um eine Wiedergabeliste zu verwalten, wählen Sie diese einfach aus dem Menü unten aus. Sie können auch eine neue hinzufügen.
main_menu_keyboard_left = ⬅️
main_menu_keyboard_right = ➡️
main_menu_keyboard_add = 🆕 Neue Wiedergabeliste
main_menu_keyboard_language = 🌐 Sprache 🌐
playlist_add_name_prompt = ❓ Geben Sie den Namen der neuen Wiedergabeliste ein.
playlist_add_name_error_exists = 😕 Sie haben bereits eine Wiedergabeliste mit diesem Namen. Bitte versuchen Sie es mit einem anderen Namen.
playlist_add_name_error_service = 😕 Sie können keine Service-Wörter verwenden, um Ihre Wiedergabeliste zu benennen. Bitte versuchen Sie es mit einem anderen Namen.
main_menu_select_error = 🤔 Keine Wiedergabeliste mit dem angegebenen Namen "{ $playlistName }"
playlist_menu =
  Die Wiedergabeliste "{ $playlistName }" wurde ausgewählt.
  
  Um Audios zur Wiedergabeliste hinzuzufügen, laden Sie sie einfach hoch oder leiten Sie Nachrichten mit Ihren Dateien hier weiter.
  Klicken Sie auf "Audio löschen" unter jedem der Audios, um sie aus der Wiedergabeliste zu entfernen.
  
  Sie können die Wiedergabeliste im Menü unten umbenennen oder löschen.
  ‼️ Wenn Sie zum Hauptmenü zurückkehren, verschwindent Ihre Titel, aber keine Sorge, sie kehren zurück, wenn Sie diese Wiedergabeliste erneut auswählen! 👌
playlist_menu_rename = 🔄 Wiedergabeliste umbenennen
playlist_menu_delete = ❌ Wiedergabeliste löschen
playlist_menu_back = ◀️ Hauptmenü
playlist_rename_prompt = ❓ Geben Sie einen neuen Namen für die Wiedergabeliste "{ $playlistName }" ein.
playlist_rename_error_exists = 😕 Sie haben bereits eine Wiedergabeliste mit diesem Namen. Versuchen Sie es mit einem anderen Namen.
playlist_menu_delete_prompt = ❓ Möchten Sie die Wiedergabeliste "{ $playlistName }" wirklich löschen?
playlist_menu_confirm_delete = ✅ Ja, Wiedergabeliste löschen
keyboard_cancel = ❎ Abbrechen
audio_delete = 🗑️ Audio löschen
loading = ⏳ Laden...
donation_info = Dieser Bot ist kostenlos und hat keine lästigen Werbeanzeigen. Wenn Sie ihn mögen, erwägen Sie bitte, <a href="{ $donationLink }">eine kleine Spende</a> zu leisten, um die Serverkosten zu decken. Vielen Dank!
`,
  en: `
name = English
language = Please, select the language.
language_select_error = Please, choose the correct language.
main_menu =
  🎵🎵🎵  Amount of playlists: { $playlistAmount }.
  
  { $mainInfo }
  This bot speaks english. You can change the language below.
  
  To show this menu again if you delete it, just type in /start
  
  { $donationInfo }
main_menu_info_empty = 🤔 To start using the bot just add a playlist by clicking the option in the menu below.
main_menu_info = 🎶 To manage a playlist just select it from the menu below. You can add a new one from there as well.
main_menu_keyboard_left = ⬅️
main_menu_keyboard_right = ➡️
main_menu_keyboard_add = 🆕 New playlist
main_menu_keyboard_language = 🌐 Language 🌐
playlist_add_name_prompt = ❓ Enter new playlist name.
playlist_add_name_error_exists = 😕 You already have a playlist with this name. Please, try another name.
playlist_add_name_error_service = 😕 You cannot use service words to name your playlist. Please, try another name.
main_menu_select_error = 🤔 No playlist with specified name "{ $playlistName }"
playlist_menu =
  "{ $playlistName }" playlist is selected.
  
  To add audios to the playlist simply upload them or forward messages with your files here.
  Click on the "Delete audio" below each of the audios to remove them from playlist.
  
  You can rename or remove playlist in the menu below.
  ‼️ If you go back to main menu, your tracks will dissappear, but don't worry, they will return when you pick this playlist again! 👌
playlist_menu_rename = 🔄 Rename playlist
playlist_menu_delete = ❌ Delete playlist
playlist_menu_back = ◀️ Main menu
playlist_rename_prompt = ❓ Enter new name for the playlist "{ $playlistName }"
playlist_rename_error_exists = 😕 You already have a playlist with this name. Try another.
playlist_menu_delete_prompt = ❓ Are you sure you want to delete the "{ $playlistName }" playlist?
playlist_menu_confirm_delete = ✅ Yes, delete playlist
keyboard_cancel = ❎ Cancel
audio_delete = 🗑️ Delete audio
loading = ⏳ Loading...
donation_info = This bot is free and has no annoying ads. If you like it, concider making <a href="{ $donationLink }">a small donation</a> to help cover the server costs. Thank you!
`,
  fr: `
name = Français
language = S'il vous plaît, sélectionnez la langue.
language_select_error = Veuillez choisir la langue correcte.
main_menu =
  🎵 Nombre de listes de lecture : { $playlistAmount }.
  
  { $mainInfo }
  Ce bot parle français. Vous pouvez changer de langue ci-dessous.
  
  Pour afficher ce menu à nouveau si vous le supprimez, tapez simplement /start
  
  { $donationInfo }
main_menu_info_empty = 🤔 Pour commencer à utiliser le bot, ajoutez simplement une liste de lecture en cliquant sur l'option dans le menu ci-dessous.
main_menu_info = 🎶 Pour gérer une liste de lecture, sélectionnez-la simplement dans le menu ci-dessous. Vous pouvez en ajouter une nouvelle à partir de là également.
main_menu_keyboard_left = ⬅️
main_menu_keyboard_right = ➡️
main_menu_keyboard_add = 🆕 Nouvelle liste de lecture
main_menu_keyboard_language = 🌐 Langue 🌐
playlist_add_name_prompt = ❓ Entrez le nom de la nouvelle liste de lecture.
playlist_add_name_error_exists = 😕 Vous avez déjà une liste de lecture avec ce nom. Veuillez en essayer un autre.
playlist_add_name_error_service = 😕 Vous ne pouvez pas utiliser de mots de service pour nommer votre liste de lecture. Veuillez en essayer un autre.
main_menu_select_error = 🤔 Aucune liste de lecture avec le nom "{ $playlistName }" spécifié
playlist_menu =
  La liste de lecture "{ $playlistName }" est sélectionnée.
  
  Pour ajouter des audios à la liste de lecture, téléchargez-les simplement ou transférez des messages avec vos fichiers ici.
  Cliquez sur "Supprimer l'audio" sous chacun des audios pour les supprimer de la liste de lecture.
  
  Vous pouvez renommer ou supprimer la liste de lecture dans le menu ci-dessous.
  ‼️ Si vous retournez au menu principal, vos morceaux disparaîtront, mais ne vous inquiétez pas, ils reviendront lorsque vous choisirez à nouveau cette liste de lecture ! 👌
playlist_menu_rename = 🔄 Renommer la liste de lecture
playlist_menu_delete = ❌ Supprimer la liste de lecture
playlist_menu_back = ◀️ Menu principal
playlist_rename_prompt = ❓ Entrez le nouveau nom pour la liste de lecture "{ $playlistName }"
playlist_rename_error_exists = 😕 Vous avez déjà une liste de lecture avec ce nom. Essayez un autre nom.
playlist_menu_delete_prompt = ❓ Êtes-vous sûr de vouloir supprimer la liste de lecture "{ $playlistName }" ?
playlist_menu_confirm_delete = ✅ Oui, supprimer la liste de lecture
keyboard_cancel = ❎ Annuler
audio_delete = 🗑️ Supprimer l'audio
loading = ⏳ Chargement...
donation_info = Ce bot est gratuit et n'a pas de publicités ennuyeuses. Si vous l'aimez, envisagez de faire <a href="{ $donationLink }">un petit don</a> pour aider à couvrir les coûts du serveur. Merci!
`,
  it: `
name = Italiano
language = Scegli la lingua.
language_select_error = Scegli la lingua corretta.
main_menu =
  🎵 Numero di playlist: { $playlistAmount }.
  
  { $mainInfo }
  Questo bot parla italiano. Puoi cambiare lingua qui sotto.
  
  Se hai eliminato questo menu, per mostrarlo di nuovo, digita /start.
  
  { $donationInfo }
main_menu_info_empty = 🤔 Per iniziare ad usare il bot, aggiungi una playlist cliccando l'option nel menu qui sotto.
main_menu_info = 🎶 Per gestire una playlist, selezionala dal menu qui sotto. Puoi anche aggiungerne una nuova da lì.
main_menu_keyboard_left = ⬅️
main_menu_keyboard_right = ➡️
main_menu_keyboard_add = 🆕 Nuova playlist
main_menu_keyboard_language = 🌐 Lingua 🌐
playlist_add_name_prompt = ❓ Inserisci il nome della nuova playlist.
playlist_add_name_error_exists = 😕 Hai già una playlist con questo nome. Per favore, prova con un altro nome.
playlist_add_name_error_service = 😕 Non puoi usare parole di servizio per il nome della playlist. Per favore, prova con un altro nome.
main_menu_select_error = 🤔 Nessuna playlist con il nome specificato "{ $playlistName }"
playlist_menu =
  Playlist "{ $playlistName }" selezionata.
  
  Per aggiungere audio alla playlist, caricali o inoltra i messaggi contenenti i file qui.
  Clicca su "Elimina audio" sotto ciascuno degli audio per rimuoverli dalla playlist.
  
  Puoi rinominare o eliminare la playlist dal menu qui sotto.
  ‼️ Se torni al menu principale, i tuoi brani scompariranno, mas non preoccuparti, torneranno quando selezioni di nuovo questa playlist! 👌
playlist_menu_rename = 🔄 Rinomina playlist
playlist_menu_delete = ❌ Elimina playlist
playlist_menu_back = ◀️ Menu principale
playlist_rename_prompt = ❓ Inserisci il nuovo nome per la playlist "{ $playlistName }"
playlist_rename_error_exists = 😕 Hai già una playlist con questo nome. Prova con un altro.
playlist_menu_delete_prompt = ❓ Sei sicuro di voler eliminare la playlist "{ $playlistName }"?
playlist_menu_confirm_delete = ✅ Sì, elimina playlist
keyboard_cancel = ❎ Annulla
audio_delete = 🗑️ Elimina audio
loading = ⏳ Caricamento...
donation_info = Questo bot è gratuito e non ha annunci fastidiosi. Se ti piace, considera di fare <a href="{ $donationLink }">una piccola donazione</a> per aiutare a coprire i costi del server. Grazie!
`,
  ru: `
name = Русский
language = Пожалуйста, выберите язык.
language_select_error = Пожалуйста, введите корректный язык.
main_menu =
  🎵 Количество плейлистов: { $playlistAmount }.
  
  { $mainInfo }
  Бот говорит на русском. В меню ниже Вы можете изменить язык.
  
  Чтобы вызвать это меню, в случае если Вы его потеряете, просто наберите /start
  
  { $donationInfo }
main_menu_info_empty = 🤔 Для начала работы создайте новый плейлист с помощью меню внизу.
main_menu_info = 🎶 Чтобы управлять плейлистами просто выберите один из меню внизу. Вы также можете добавить ещё один плейлист там же.
main_menu_keyboard_left = ⬅️
main_menu_keyboard_right = ➡️
main_menu_keyboard_add = 🆕 Новый
main_menu_keyboard_language = 🌐 Язык 🌐
playlist_add_name_prompt = ❓ Введите название нового плейлиста.
playlist_add_name_error_exists = 😕 У Вас уже есть плейлист с таким названием. Попробуйте, пожалуйста, другое.
playlist_add_name_error_service = 😕 Вы не можете использовать зарезервированные слова в названии плейлистов. Попробуйте, пожалуйста, другое название.
main_menu_select_error = 🤔 Нет плейлиста с названием "{ $playlistName }"
playlist_menu =
  Плейлист "{ $playlistName }" выбран.
  
  Чтобы добавить аудио в плейлист, загрузите или перешлите сообщения с аудиосодержимым (треками) в этот чат.
  Нажимайте на кнопку "Удалить аудио" под аудио, которое Вы хотели бы убрать из плейлиста.
  
  В меню Вы можете переименовать или удалить плейлист.
  ‼️ При возврате в главное меню аудио плейлиста спрячется, однако его можно будет вернуть. Просто выберите этот плейлист снова! 👌
playlist_menu_rename = 🔄 Переименовать плейлист
playlist_menu_delete = ❌ Удалить плейлист
playlist_menu_back = ◀️ Главное меню
playlist_rename_prompt = ❓ Введите новое название для плейлиста "{ $playlistName }"
playlist_rename_error_exists = 😕 У Вас уже есть плейлист с таким названием. Попробуйте, пожалуйста, другое.
playlist_menu_delete_prompt = ❓ Вы уверены в том, что хотите удалить плейлист "{ $playlistName }"?
playlist_menu_confirm_delete = ✅ Да, удалить плейлист
keyboard_cancel = ❎ Отмена
audio_delete = 🗑️ Удалить аудио
loading = ⏳ Загрузка...
donation_info = Этот бот бесплатен и в нем нет надоедливой рекламы. Если он вам нравится, не откажитесь поддержать автора <a href="{ $donationLink }">донатом</a>, чтобы помочь с оплатой сервера. Спасибо!
`,
  sp: `
name = Español
language = Por favor, seleccione el idioma.
language_select_error = Пожалуйста, выберите правильный язык.
main_menu =
  🎵 Cantidad de listas de reproducción: { $playlistAmount }.
  
  { $mainInfo }
  Este bot habla español. Puedes cambiar el idioma a continuación.
  
  Para mostrar este menú de nuevo si lo eliminas, simplemente escribe /start.
  
  { $donationInfo }
main_menu_info_empty = 🤔 Para comenzar a usar el bot, solo agrega una lista de reproducción haciendo clic en la opción en el menú a continuación.
main_menu_info = 🎶 Para administrar una lista de reproducción, selecciónela del menú a continuación. También puedes agregar una nueva desde allí.
main_menu_keyboard_left = ⬅️
main_menu_keyboard_right = ➡️
main_menu_keyboard_add = 🆕 Nueva lista de reproducción
main_menu_keyboard_language = 🌐 Idioma 🌐
playlist_add_name_prompt = ❓ Ingresa el nombre de la nueva lista de reproducción.
playlist_add_name_error_exists = 😕 Ya tienes una lista de reproducción con este nombre. Por favor, intenta con otro nombre.
playlist_add_name_error_service = 😕 No puedes usar palabras de servicio para nombrar tu lista de reproducción. Por favor, intenta con otro nombre.
main_menu_select_error = 🤔 No hay ninguna lista de reproducción con el nombre "{ $playlistName }" specified.
playlist_menu =
  Se ha seleccionado la lista de reproducción "{ $playlistName }".
  
  Para agregar audios a la lista de reproducción, simplemente cárgalos o reenvía los mensagens con tus archivos aquí.
  Haz clic en "Eliminar audio" debajo de cada uno de los audios para eliminarlos de la lista de reproducción.
  
  Puedes renombrar o eliminar la lista de reproducción en el menú a continuación.
  ‼️ Si vuelves al menú principal, tus pistas desaparecerán, pero no te preocupes, volverán cuando selecciones esta lista de reproducción nuevamente! 👌
playlist_menu_rename = 🔄 Renombrar lista de reproducción
playlist_menu_delete = ❌ Eliminar lista de reproducción
playlist_menu_back = ◀️ Menú principal
playlist_rename_prompt = ❓ Ingresa el nuevo nombre para la liste de reproducción "{ $playlistName }"
playlist_rename_error_exists = 😕 Ya tienes una lista de reproducción with this name. Intenta con otro.
playlist_menu_delete_prompt = ❓ ¿Estás seguro de que deseas eliminar la lista de reproducción "{ $playlistName }"?
playlist_menu_confirm_delete = ✅ Sí, eliminar lista de reproducción
keyboard_cancel = ❎ Cancelar
audio_delete = 🗑️ Eliminar audio
loading = ⏳ Cargando...
donation_info = Este bot es gratuito y no tiene anuncios molestos. Si te gusta, considera hacer <a href="{ $donationLink }">una pequeña donación</a> para ayudar a cubrir los costos del server. ¡Gracias!
`,
}

const bundles: Record<string, FluentBundle> = {}
export const nameToCode: Record<string, string> = {}

for (const [lang, translations] of Object.entries(locales)) {
  const bundle = new FluentBundle(lang)
  const resource = new FluentResource(translations)
  const errors = bundle.addResource(resource)
  if (errors.length > 0) {
    console.error(`Fluent errors in ${lang}:`, errors)
  }
  bundles[lang] = bundle

  const nameMatch = translations.match(/name\s*=\s*(.+)/)
  if (nameMatch) {
    nameToCode[nameMatch[1].trim()] = lang
  }
}

export function translate(locale: string, id: string, args?: any) {
  const bundle = bundles[locale] || bundles['en']
  const message = bundle.getMessage(id)
  if (!message || !message.value) return id
  return bundle.formatPattern(message.value, args)
}

export default async function fluent(ctx: Context, next: NextFunction) {
  ctx.t = (id: string, args?: any) => translate(ctx.dbuser.language, id, args)
  await next()
}
