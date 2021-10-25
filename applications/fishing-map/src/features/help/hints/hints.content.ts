import type { Placement } from 'tippy.js'
import { Locale } from 'types'
import fishingEffortHeatmapImg from 'assets/images/hints/fishingEffortHeatmap.png'
import howToFilterActivityLayersImg from 'assets/images/hints/howToFilterActivityLayers.png'
import clickingOnAGridCellToShowVesselsImg from 'assets/images/hints/clickingOnAGridCellToShowVessels.png'
import changingTheTimeRangeImg from 'assets/images/hints/changingTheTimeRange.png'
import areaSearchImg from 'assets/images/hints/areaSearch.png'

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
}

const hintsConfig: Record<HintId, HintConfig> = {
  fishingEffortHeatmap: {
    imageUrl: fishingEffortHeatmapImg,
    placement: 'right',
    pulse: 'light',
  },
  filterActivityLayers: {
    imageUrl: howToFilterActivityLayersImg,
    placement: 'bottom-end',
    pulse: 'dark',
  },
  clickingOnAGridCellToShowVessels: {
    imageUrl: clickingOnAGridCellToShowVesselsImg,
    placement: 'right',
    pulse: 'light',
  },
  changingTheTimeRange: {
    imageUrl: changingTheTimeRangeImg,
    placement: 'top',
    pulse: 'light',
  },
  areaSearch: {
    imageUrl: areaSearchImg,
    placement: 'right',
    pulse: 'light',
  },
}

export default hintsConfig
