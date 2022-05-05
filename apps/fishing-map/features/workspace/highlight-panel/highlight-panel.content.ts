import { PATH_BASENAME } from 'routes/routes'
import { Locale } from 'types'

// Update with a new id when a new release
export const HIGHLIGHT_DATAVIEW_INSTANCE_ID = 'highlight-viirs-match'

type HighlighPanelConfigLocale = {
  [locale in Locale]?: {
    title: string
    description: string
    learnMoreUrl?: string
  }
}

export type HighlightPanelConfig = {
  dataviewInstanceId: string
  localStorageKey: string
  imageUrl: string
  learnMoreUrl: string
  delayed?: boolean
  workspaceUrl?: string
} & HighlighPanelConfigLocale

const HIGHLIGHT_POPUP_KEY = 'HighlightPopup'

const DEFAULT_HIGHLIGHT_CONFIG: HighlightPanelConfig = {
  dataviewInstanceId: HIGHLIGHT_DATAVIEW_INSTANCE_ID,
  localStorageKey: HIGHLIGHT_POPUP_KEY,
  // delayed: true,
  imageUrl: `${PATH_BASENAME}/images/viirs-match.webp`,
  learnMoreUrl: 'https://globalfishingwatch.org/data/ais-viirs-reveals-dark-fleet/',
  en: {
    title: 'Who is fishing at night?',
    description:
      'Identity of fishing vessels using bright lights at night added through advanced matching process.',
  },
  es: {
    title: '¿Quién pesca de noche?',
    description:
      'La identidad de los buques pesqueros que usan luces brillantes por la noche se agrega a través de un proceso de comparación avanzado.',
  },
  fr: {
    title: 'Qui pêche la nuit?',
    description:
      "L'identité des navires de pêche utilisant des lumières de nuit a été ajoutée grace à un processus de correspondance avancé.",
  },
  pt: {
    title: 'Who is fishing at night?',
    description:
      'Identity of fishing vessels using bright lights at night added through advanced matching process.',
  },
}

export const HIGHLIGHT_PANEL_CONFIG_ACTIVITY_SWITCH_ID = `${HIGHLIGHT_POPUP_KEY}_ActivitySwitch`
export const HIGHLIGHT_PANEL_CONFIG_ACTIVITY_SWITCH: HighlightPanelConfig = {
  ...DEFAULT_HIGHLIGHT_CONFIG,
  dataviewInstanceId: HIGHLIGHT_PANEL_CONFIG_ACTIVITY_SWITCH_ID,
  localStorageKey: HIGHLIGHT_PANEL_CONFIG_ACTIVITY_SWITCH_ID,
  workspaceUrl:
    'https://globalfishingwatch.org/map/fishing-activity/night_light_viirs_matching-public',
}

export default DEFAULT_HIGHLIGHT_CONFIG
