import type { Placement } from 'tippy.js'
import fishingEffortHeatmapImg from 'assets/images/hints/fishingEffortHeatmap.png'
import howToFilterActivityLayersImg from 'assets/images/hints/howToFilterActivityLayers.png'
import clickingOnAGridCellToShowVesselsImg from 'assets/images/hints/clickingOnAGridCellToShowVessels.png'
import changingTheTimeRangeImg from 'assets/images/hints/changingTheTimeRange.png'
import areaSearchImg from 'assets/images/hints/areaSearch.png'

// t('helpHints:fishingEffortHeatmap', 'The map shows an interactive heat map of activity. The lighter grid cells are the areas with more activity.')
// t('helpHints:filterActivityLayers', 'Click the filter icon to filter activity using different available criteria, including data source, flag and gear types.')
// t('helpHints:clickingOnAGridCellToShowVessels', 'Click on any grid cell to show the most active vessels in that area over the chosen time range.')
// t('helpHints:changingTheTimeRange', 'Click and drag to change the time range you are viewing in the time bar.')
// t('helpHints:periodComparisonBaseline', 'Select a baseline to compare changes in activity e.g. between now and the same date last year, or to compare activity at different times of year.')
// t('helpHints:areaSearch', 'Search by country, sea or ocean to focus on an area you\'re interested in.')

export type HintId =
  | 'fishingEffortHeatmap'
  | 'filterActivityLayers'
  | 'clickingOnAGridCellToShowVessels'
  | 'changingTheTimeRange'
  | 'areaSearch'
  | 'periodComparisonBaseline'

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
}

export default hintsConfig
