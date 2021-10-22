import type { Placement } from 'tippy.js'
import { Locale } from 'types'
import fishingEffortHeatmapImg from 'assets/images/hints/fishingEffortHeatmap.png'
import howToFilterActivityLayersImg from 'assets/images/hints/howToFilterActivityLayers.png'
import clickingOnAGridCellToShowVesselsImg from 'assets/images/hints/clickingOnAGridCellToShowVessels.png'
import changingTheTimeRangeImg from 'assets/images/hints/changingTheTimeRange.png'
import areaSearchImg from 'assets/images/hints/areaSearch.png'

type HintConfigLocale = {
  [locale in Locale]?: {
    description: string
  }
}

export type HintId =
  | 'fishingEffortHeatmap'
  | 'filterActivityLayers'
  | 'clickingOnAGridCellToShowVessels'
  | 'changingTheTimeRange'
  | 'areaSearch'

type HintConfig = {
  imageUrl: string
  placement?: Placement
  pulse: 'light' | 'dark'
} & HintConfigLocale

const hintsConfig: Record<HintId, HintConfig> = {
  fishingEffortHeatmap: {
    imageUrl: fishingEffortHeatmapImg,
    placement: 'right',
    pulse: 'light',
    en: {
      description:
        'The map shows an interactive heat map of apparent fishing effort. The lighter grid cells are the most intensely fished areas.',
    },
  },
  filterActivityLayers: {
    imageUrl: howToFilterActivityLayersImg,
    placement: 'bottom-end',
    pulse: 'dark',
    en: {
      description:
        'Click the filter icon to filter activity using different available criteria, including data source, flag and gear types.',
    },
  },
  clickingOnAGridCellToShowVessels: {
    imageUrl: clickingOnAGridCellToShowVesselsImg,
    placement: 'right',
    pulse: 'light',
    en: {
      description:
        'Click on any grid cell to show the most active vessels in that area over the chosen time range.',
    },
  },
  changingTheTimeRange: {
    imageUrl: changingTheTimeRangeImg,
    placement: 'top',
    pulse: 'light',
    en: {
      description: 'Click and drag to change the time range you are viewing in the time bar.',
    },
  },
  areaSearch: {
    imageUrl: areaSearchImg,
    placement: 'right',
    pulse: 'light',
    en: {
      description: "Search by country, sea or ocean to focus on an area you're interested in.",
    },
  },
}

export default hintsConfig
