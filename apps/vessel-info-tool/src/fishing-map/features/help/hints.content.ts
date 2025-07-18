import type { Placement } from '@floating-ui/react'

import areaSearchImg from 'assets/images/hints/areaSearch.png'
import changingTheTimeRangeImg from 'assets/images/hints/changingTheTimeRange.png'
import clickingOnAGridCellToShowVesselsImg from 'assets/images/hints/clickingOnAGridCellToShowVessels.png'
import fishingEffortHeatmapImg from 'assets/images/hints/fishingEffortHeatmap.png'
import howToFilterActivityLayersImg from 'assets/images/hints/howToFilterActivityLayers.png'

// t('help-hints:areaSearch')
// t('help-hints:changingTheTimeRange')
// t('help-hints:clickingOnAGridCellToShowVessels')
// t('help-hints:filterActivityLayers')
// t('help-hints:fishingEffortHeatmap')
// t('help-hints:periodComparisonBaseline')
// t('help-hints:userContextLayers')

export type HintId =
  | 'fishingEffortHeatmap'
  | 'filterActivityLayers'
  | 'clickingOnAGridCellToShowVessels'
  | 'changingTheTimeRange'
  | 'areaSearch'
  | 'periodComparisonBaseline'
  | 'userContextLayers'

type HintConfig = {
  imageUrl?: string
  placement?: Placement
  pulse: 'light' | 'dark'
  openedByDefault?: boolean
}

const hintsConfig: Record<HintId, HintConfig> = {
  fishingEffortHeatmap: {
    imageUrl: fishingEffortHeatmapImg.src,
    placement: 'right',
    pulse: 'light',
    openedByDefault: true,
  },
  filterActivityLayers: {
    imageUrl: howToFilterActivityLayersImg.src,
    placement: 'bottom-end',
    pulse: 'dark',
  },
  clickingOnAGridCellToShowVessels: {
    imageUrl: clickingOnAGridCellToShowVesselsImg.src,
    placement: 'right',
    pulse: 'light',
  },
  changingTheTimeRange: {
    imageUrl: changingTheTimeRangeImg.src,
    placement: 'top',
    pulse: 'light',
  },
  areaSearch: {
    imageUrl: areaSearchImg.src,
    placement: 'right',
    pulse: 'light',
  },
  periodComparisonBaseline: {
    placement: 'top',
    pulse: 'dark',
    openedByDefault: true,
  },
  userContextLayers: {
    placement: 'top',
    pulse: 'dark',
  },
}

export default hintsConfig
