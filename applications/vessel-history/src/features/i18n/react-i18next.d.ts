// import the original type declarations
import 'react-i18next'
// import all namespaces (for the default language, only)
import translations from '../../../public/locales/source/translations.json'
import flags from '../../../public/locales/source/flags.json'

declare module 'react-i18next' {
  // and extend them!
  interface Resources {
    translations: typeof translations
    flags: typeof flags
  }
}
