import { PATH_BASENAME } from 'routes/routes'
import { Locale } from 'types'

// Update with a new id when a new release
// This id is used for highlighting the dataview with a popup on the right
// update it here if you want to show it again
export const HIGHLIGHT_DATAVIEW_INSTANCE_ID = 'highlight-sar-match'

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
  learnMoreUrl?: string
  delayed?: number
  workspaceUrl?: string
} & HighlighPanelConfigLocale

const HIGHLIGHT_POPUP_KEY = 'HighlightPopup'

const HIGHLIGHT_CONFIG: HighlightPanelConfig = {
  dataviewInstanceId: HIGHLIGHT_DATAVIEW_INSTANCE_ID,
  localStorageKey: HIGHLIGHT_POPUP_KEY,
  delayed: 1000,
  imageUrl: `${PATH_BASENAME}/images/sar.jpg`,
  // learnMoreUrl: 'https://globalfishingwatch.org/data/ais-viirs-reveals-dark-fleet/',
  en: {
    title: 'Revealing vessels with radar',
    description:
      'First global radar detections layer, derived from satellite radar (SAR), showing vessels that may not appear in other tracking systems and matched to vessel identity.',
  },
  es: {
    title: 'Desvelando embarcaciones con radar',
    description:
      'Primera capa de detecciones de radar global, derivada del radar de apertura sintética (SAR), que muestra embarcaciones que pueden no aparecer en otros sistemas de seguimiento y que son emparejadas con la identidad de la embarcación.',
  },
}

export default HIGHLIGHT_CONFIG
