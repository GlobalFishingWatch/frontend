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
  learnMoreUrl: 'https://globalfishingwatch.org/belize',
  en: {
    title: 'New VIIRS-AIS match layer',
    description:
      'Identity of fishing vessels using bright lights at night added through advanced matching process.',
  },
  es: {
    title: 'New VIIRS-AIS match layer',
    description:
      'La identidad de los buques pesqueros que usan luces brillantes por la noche se agrega a través de un proceso de comparación avanzado.',
    learnMoreUrl: 'https://globalfishingwatch.org/es/belize',
  },
  fr: {
    title: 'New VIIRS-AIS match layer',
    description:
      'Identity of fishing vessels using bright lights at night added through advanced matching process.',
  },
  pt: {
    title: 'New VIIRS-AIS match layer',
    description:
      'Identity of fishing vessels using bright lights at night added through advanced matching process.',
  },
}

export const HIGHLIGHT_PANEL_CONFIG_ACTIVITY_SWITCH_ID = `${HIGHLIGHT_POPUP_KEY}_ActivitySwtch`
export const HIGHLIGHT_PANEL_CONFIG_ACTIVITY_SWITCH: HighlightPanelConfig = {
  ...DEFAULT_HIGHLIGHT_CONFIG,
  dataviewInstanceId: HIGHLIGHT_PANEL_CONFIG_ACTIVITY_SWITCH_ID,
  localStorageKey: HIGHLIGHT_PANEL_CONFIG_ACTIVITY_SWITCH_ID,
  workspaceUrl:
    '?start=2022-01-01T01%3A00%3A00.000Z&end=2022-04-01T00%3A00%3A00.000Z&latitude=19&longitude=26&zoom=1.5&activityCategory=~0&dvIn[0][id]=~0&dvIn[0][cfg][vis]=false&dvIn[1][id]=highlight-viirs-match&dvIn[1][cfg][vis]=true&tk[0]=presence',
}

export default DEFAULT_HIGHLIGHT_CONFIG
