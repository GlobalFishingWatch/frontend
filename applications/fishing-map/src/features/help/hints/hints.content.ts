import { CSSProperties } from 'react'
import type { Placement } from 'tippy.js'
import { Locale } from 'types'

type HintConfigLocale = {
  [locale in Locale]?: {
    description: string
  }
}

export type HintConfig = {
  hintId: string
  imageUrl: string
  position?: CSSProperties
  placement?: Placement
  pulse: 'light' | 'dark'
} & HintConfigLocale

const hintsConfig: HintConfig[] = [
  {
    hintId: 'fishingEffortHetmap',
    imageUrl: 'https://globalfishingwatch.org/wp-content/uploads/fishingEffortHeatmap.png',
    position: { left: '37rem', top: '17rem' },
    placement: 'right',
    pulse: 'dark',
    en: {
      description:
        'The map shows an interactive heat map of apparent fishing effort. The lighter grid cells are the most intensely fished areas.',
    },
  },
  {
    hintId: 'howToFilterActivityLayers',
    imageUrl: 'https://globalfishingwatch.org/wp-content/uploads/howToFilterActivityLayers.png',
    position: { left: '29.5rem', top: '11.5rem' },
    placement: 'right',
    pulse: 'dark',
    en: {
      description:
        'Click the filter icon to filter activity using different available criteria, including data source, flag and gear types.',
    },
  },
  {
    hintId: 'clickingOnAGridCellToShowVessels',
    imageUrl:
      'https://globalfishingwatch.org/wp-content/uploads/clickingOnAGridCellToShowVessels.png',
    position: { right: '50%', top: '50vh' },
    placement: 'right',
    pulse: 'light',
    en: {
      description:
        'Click on any grid cell to show the most active vessels in that area over the chosen time range.',
    },
  },
  {
    hintId: 'changingTheTimeRange',
    imageUrl: 'https://globalfishingwatch.org/wp-content/uploads/changingTheTimeRange.png',
    position: { bottom: '9.7rem', right: '15rem' },
    placement: 'top',
    pulse: 'light',
    en: {
      description: 'Click and drag to change the time range you are viewing in the time bar.',
    },
  },
  {
    hintId: 'areaSearch',
    imageUrl: 'https://globalfishingwatch.org/wp-content/uploads/areaSearch.png',
    position: { right: '6rem', top: '10.2rem' },
    placement: 'right',
    pulse: 'light',
    en: {
      description: "Search by country, X or X to focus on an area you're interested in.",
    },
  },
]

export default hintsConfig
