import { ColorRampsIds } from '../../utils'
import { DeckLayerProps, DeckPickingObject } from '../../types'
import {
  HEATMAP_HIGH_RES_ID,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
  POSITIONS_ID,
} from './fourwings.config'
import {
  FourwingsHeatmapPickingInfo,
  FourwingsHeatmapPickingObject,
  FourwingsHeatmapStaticPickingObject,
} from './heatmap/fourwings-heatmap.types'
import {
  FourwingsPositionsPickingInfo,
  FourwingsPositionsPickingObject,
} from './positions/fourwings-positions.types'

export * from './heatmap/fourwings-heatmap.types'
export * from './positions/fourwings-positions.types'

export type FourwingsSublayerId = string
export type FourwingsDatasetId = string
export type FourwingsVisualizationMode =
  | typeof HEATMAP_ID
  | typeof HEATMAP_HIGH_RES_ID
  | typeof HEATMAP_LOW_RES_ID
  | typeof POSITIONS_ID

export type GetViewportDataParams = {
  onlyValuesAndDates?: boolean
  sampleData?: boolean
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
  positionProperties?: string[]
  vesselGroups?: string | string[]
  extentStart?: number
  extentEnd?: number
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
