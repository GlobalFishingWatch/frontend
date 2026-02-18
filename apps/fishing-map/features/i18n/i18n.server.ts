import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Locale } from 'types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SUPPORTED_LANGUAGES = [
  Locale.en,
  Locale.es,
  Locale.fr,
  Locale.id,
  Locale.pt,
  'val',
  ...(import.meta.env.DEV ? (['source'] as const) : []),
]

const DEFAULT_NAMESPACE = 'translations'
const FALLBACK_LNG = import.meta.env.DEV ? 'source' : Locale.en

const NAMESPACES = [
  'translations',
  'workspaces',
  'data-terminology',
  'layer-library',
  'help-hints',
] as const

function detectLanguageFromRequest(request: Request): string {
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase()
    if (preferred && SUPPORTED_LANGUAGES.includes(preferred)) {
      return preferred
    }
  }
  return FALLBACK_LNG
}

export type I18nServerState = {
  initialI18nStore: Record<string, Record<string, Record<string, unknown>>>
  initialLanguage: string
}

export async function createServerI18n(request: Request): Promise<{
  i18n: typeof i18next
  state: I18nServerState
}> {
  const language = detectLanguageFromRequest(request)

  const localesPath = join(__dirname, '..', '..', 'public', 'locales', '{{lng}}', '{{ns}}.json')

  const i18n = i18next.createInstance()

  await i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: language,
      fallbackLng: FALLBACK_LNG,
      supportedLngs: SUPPORTED_LANGUAGES,
      ns: NAMESPACES,
      defaultNS: DEFAULT_NAMESPACE,
      backend: {
        loadPath: localesPath,
      },
      initImmediate: false,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })

  // Preload all namespaces so initialI18nStore contains translations used during SSR
  await i18n.loadNamespaces(NAMESPACES)

  const initialI18nStore: Record<string, Record<string, Record<string, unknown>>> = {}
  // Only serialize the primary detected language — i18n.languages includes the full
  // fallback chain (e.g. ['en', 'source'] in dev), which causes duplicate identical
  // translations to be embedded in the SSR HTML.
  const data = i18n.services.resourceStore.data[language]
  if (data) {
    initialI18nStore[language] = data as Record<string, Record<string, unknown>>
  }

  return {
    i18n,
    state: {
      initialI18nStore,
      initialLanguage: i18n.language,
    },
  }
}
