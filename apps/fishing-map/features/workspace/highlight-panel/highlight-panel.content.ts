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
} & HighlighPanelConfigLocale

const highlightPanelConfig: HighlighPanelConfig = {
  dataviewInstanceId: HIGHLIGHT_DATAVIEW_INSTANCE_ID,
  imageUrl: `${PATH_BASENAME}/TODO`,
  learnMoreUrl: 'https://globalfishingwatch.org/belize',
  en: {
    title: 'TODO',
    description: 'TODO',
  },
  es: {
    title: 'TODO',
    description: 'TODO',
    learnMoreUrl: 'https://globalfishingwatch.org/es/belize',
  },
  fr: {
    title: 'TODO',
    description: 'TODO',
  },
  pt: {
    title: 'TODO',
    description: 'TODO',
  },
}

export default highlightPanelConfig
