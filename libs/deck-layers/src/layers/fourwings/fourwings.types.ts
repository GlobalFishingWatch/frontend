import type { DeckLayerProps, DeckPickingObject } from '../../types'
import type { ColorRampsIds } from '../../utils'

import type {
  FourwingsHeatmapPickingInfo,
  FourwingsHeatmapPickingObject,
  FourwingsHeatmapStaticPickingObject,
} from './heatmap/fourwings-heatmap.types'
import type {
  FourwingsPositionsPickingInfo,
  FourwingsPositionsPickingObject,
} from './positions/fourwings-positions.types'
import type { FOURWINGS_VISUALIZATION_MODES } from './fourwings.config'

export * from './heatmap/fourwings-heatmap.types'
export * from './positions/fourwings-positions.types'

export type FourwingsSublayerId = string
export type FourwingsDatasetId = string
export type FourwingsVisualizationMode = (typeof FOURWINGS_VISUALIZATION_MODES)[number]

export type GetViewportDataParams = {
  onlyValuesAndDates?: boolean
}

export type FourwingsColorObject = { r: number; g: number; b: number; a: number }
export type FourwingsTileLayerColorDomain = number[] | number[][]
export type FourwingsTileLayerColorRange = FourwingsColorObject[][] | FourwingsColorObject[]
export type FourwingsTileLayerColorScale = {
  colorDomain: FourwingsTileLayerColorDomain
  colorRange: FourwingsTileLayerColorRange
}

export type FourwingsDeckSublayer = {
  id: FourwingsSublayerId
  datasets: FourwingsDatasetId[]
  visible: boolean
  color: string
  colorRamp: ColorRampsIds
  value?: number
  unit?: string
  filter?: string
  // Used only blue-planet workspace to be able to show only one detection by id
  filterIds?: string[]
  positionProperties?: string[]
  vesselGroups?: string | string[]
  vesselGroupsLength?: number
  extentStart?: number
  extentEnd?: number
}

export type FourwingsVectorDirection = 'u' | 'v'
export type FourwingsDeckVectorSublayer = {
  id: FourwingsSublayerId
  color: string
  datasets: FourwingsDatasetId[]
  direction: FourwingsVectorDirection
  unit?: string
}

export type BaseFourwingsLayerProps = DeckLayerProps<{
  startTime: number
  endTime: number
  sublayers: FourwingsDeckSublayer[]
  tilesUrl?: string
  extentStart?: number
  extentEnd?: number
}>

export type FourwingsPickingInfo = FourwingsHeatmapPickingInfo | FourwingsPositionsPickingInfo
export type FourwingsPickingObject = DeckPickingObject<
  | FourwingsHeatmapPickingObject
  | FourwingsHeatmapStaticPickingObject
  | FourwingsPositionsPickingObject
>
