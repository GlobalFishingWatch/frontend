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

export type HighlighPanelConfig = {
  dataviewInstanceId: string
  imageUrl: string
  learnMoreUrl: string
  delayed?: boolean
} & HighlighPanelConfigLocale

const highlightPanelConfig: HighlighPanelConfig = {
  dataviewInstanceId: HIGHLIGHT_DATAVIEW_INSTANCE_ID,
  delayed: true,
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
      'Identity of fishing vessels using bright lights at night added through advanced matching process.',
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

export default highlightPanelConfig
