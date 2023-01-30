import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { Locale } from '@globalfishingwatch/api-types'
import { fallbackLng, getI18nConfig } from './config'

const initI18next = async (lng, ns) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`))
    )
    .init(getI18nConfig(lng, ns))
  return i18nInstance
}

export type useTranslationsOptions = {
  keyPrefix: string
}
export async function useTranslation(
  lng = fallbackLng as Locale,
  ns?: string | string[],
  options = {} as useTranslationsOptions
) {
  const i18nextInstance = await initI18next(lng, ns)
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance,
  }
}
