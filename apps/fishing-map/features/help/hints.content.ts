import type { Placement } from '@floating-ui/react'

import areaSearchImg from 'assets/images/hints/areaSearch.png'
import changingTheTimeRangeImg from 'assets/images/hints/changingTheTimeRange.png'
import clickingOnAGridCellToShowVesselsImg from 'assets/images/hints/clickingOnAGridCellToShowVessels.png'
import fishingEffortHeatmapImg from 'assets/images/hints/fishingEffortHeatmap.png'
import howToFilterActivityLayersImg from 'assets/images/hints/howToFilterActivityLayers.png'

// t('help-hints:areaSearch', 'Search by country, sea or ocean to focus on an area you\'re interested in.')
// t('help-hints:changingTheTimeRange', 'Click and drag to change the time range you are viewing in the time bar.')
// t('help-hints:clickingOnAGridCellToShowVessels', 'Click on any grid cell to show the most active vessels in that area over the chosen time range.')
// t('help-hints:filterActivityLayers', 'Click the filter icon to filter activity using different available criteria, including data source, flag and gear types.')
// t('help-hints:fishingEffortHeatmap', 'The map shows an interactive heat map of activity. The lighter grid cells are the areas with more activity.')
// t('help-hints:periodComparisonBaseline', 'Select a baseline to compare changes in activity e.g. between now and the same date last year, or to compare activity at different times of year.')
// t('help-hints:userContextLayers', 'Upload and combine your area, track or point data in more formats with flexible color, size, labeling, time and filter options to best visualize and analyze your datasets alongside Global Fishing Watch layers.')

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
