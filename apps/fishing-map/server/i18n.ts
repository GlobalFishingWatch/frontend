import get from 'lodash/get'

import flagsEnglish from '../../../libs/i18n-labels/en/flags.json'
import flagsSource from '../../../libs/i18n-labels/source/flags.json'
import appEnglish from '../public/locales/en/translations.json'
import appSource from '../public/locales/source/translations.json'

type Namespace = { translations: typeof appEnglish; flags: typeof flagsEnglish }
const namespaces: Namespace = {
  translations: appEnglish,
  flags: flagsEnglish,
}
const sourceNamespaces = {
  translations: appSource,
  flags: flagsSource,
}

export const serverT: any = (
  key: string,
  params: string | Record<string | 'defaultValue', any>
) => {
  const namespace = key.includes(':') ? (key.split(':')[0] as keyof Namespace) : 'translations'
  const keyName = key.includes(':') ? key.split(':')[1] : key

  const { defaultValue, ...replaceParams } = typeof params === 'object' ? params : {}
  const fallback = typeof params === 'string' ? params : defaultValue
  const value =
    get(namespaces[namespace], keyName) || get(sourceNamespaces[namespace], keyName) || fallback
  if (Object.keys(replaceParams).length > 0) {
    return value.replace(/{{(.*?)}}/g, (match: string, p1: string) => replaceParams[p1] || match)
  }
  return value
}
