'use client'

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { getI18nConfig } from './config'

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`))
  )
  .init(getI18nConfig())
