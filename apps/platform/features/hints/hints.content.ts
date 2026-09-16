import type { Placement } from '@floating-ui/react'

import areaSearchImg from 'assets/images/hints/areaSearch.png'
import changingTheTimeRangeImg from 'assets/images/hints/changingTheTimeRange.png'
import clickingOnAGridCellToShowVesselsImg from 'assets/images/hints/clickingOnAGridCellToShowVessels.png'
import fishingEffortHeatmapImg from 'assets/images/hints/fishingEffortHeatmap.png'
import howToFilterActivityLayersImg from 'assets/images/hints/howToFilterActivityLayers.png'
import type { UserGuideSlug } from 'features/cms/loaders/user-guide.types'

// t('help-hints:areaSearch')
// t('help-hints:changingTheTimeRange')
// t('help-hints:clickingOnAGridCellToShowVessels')
// t('help-hints:filterActivityLayers')
// t('help-hints:fishingEffortHeatmap')
// t('help-hints:periodComparisonBaseline')
// t('help-hints:userContextLayers')
// t('userGuide.analyzing-activity-over-time')
// t('userGuide.central-section-showing-spatial-activity-maps')
// t('userGuide.timebar')
// t('userGuide.viewing-vessel-activity-in-layers')

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
  userGuideSlug?: UserGuideSlug
}

const hintsConfig: Record<HintId, HintConfig> = {
  fishingEffortHeatmap: {
    imageUrl: fishingEffortHeatmapImg,
    placement: 'right',
    pulse: 'light',
    openedByDefault: true,
    userGuideSlug: 'central-section-showing-spatial-activity-maps',
  },
  filterActivityLayers: {
    imageUrl: howToFilterActivityLayersImg,
    placement: 'bottom-end',
    pulse: 'dark',
    userGuideSlug: 'filtering-activity-layers',
  },
  clickingOnAGridCellToShowVessels: {
    imageUrl: clickingOnAGridCellToShowVesselsImg,
    placement: 'right',
    pulse: 'light',
    userGuideSlug: 'viewing-vessel-activity-in-layers',
  },
  changingTheTimeRange: {
    imageUrl: changingTheTimeRangeImg,
    placement: 'top',
    pulse: 'light',
    userGuideSlug: 'timebar',
  },
  areaSearch: {
    imageUrl: areaSearchImg,
    placement: 'right',
    pulse: 'light',
    userGuideSlug: 'central-section-showing-spatial-activity-maps',
  },
  periodComparisonBaseline: {
    placement: 'top',
    pulse: 'dark',
    openedByDefault: true,
    userGuideSlug: 'analyzing-activity-over-time',
  },
  userContextLayers: {
    placement: 'top',
    pulse: 'dark',
    userGuideSlug: 'uploading-data',
  },
}

export default hintsConfig
