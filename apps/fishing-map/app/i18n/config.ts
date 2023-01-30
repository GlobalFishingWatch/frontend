import { InitOptions } from 'i18next'
import { Locale } from '@globalfishingwatch/api-types'

export const CROWDIN_IN_CONTEXT_LANG = 'val'
export const fallbackLng = Locale.en
export const languages = [...Object.values(Locale), CROWDIN_IN_CONTEXT_LANG]
export const defaultNS = 'translations'

export function getI18nConfig(lng = fallbackLng, ns = defaultNS): InitOptions {
  return {
    // debug: true,
    lng,
    ns,
    supportedLngs: languages,
    fallbackLng,
    fallbackNS: defaultNS,
    defaultNS,
    debug: process.env.i18n_DEBUG === 'true',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default,
      // format: (value, format, lng) => {
      //   if (format === 'intlDate') {
      //     return new Intl.DateTimeFormat(lng).format(value)
      //   }
      //   return value
      // },
    },
    // react: {
    //   wait: true,
    //   useSuspense: false,
    // },
  }
}
