import type helpHints from '../../public/locales/source/helphints.json'
import type translations from '../../public/locales/source/translations.json'
import type dataTerminology from '../../public/locales/source/data-terminology.json'

export type I18nNamespaces = {
  dataTerminology: keyof typeof dataTerminology
  helpHints: keyof typeof helpHints
  translations: keyof typeof translations
}
