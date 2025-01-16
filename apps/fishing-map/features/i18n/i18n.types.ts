import type dataTerminology from '../../public/locales/source/data-terminology.json'
import type helpHints from '../../public/locales/source/help-hints.json'
import type layerLibrary from '../../public/locales/source/layer-library.json'
import type translations from '../../public/locales/source/translations.json'

export type I18nNamespaces = {
  dataTerminology: keyof typeof dataTerminology
  helpHints: keyof typeof helpHints
  layerLibrary: keyof typeof layerLibrary
  translations: keyof typeof translations
}
