import type { EventTypes } from '@globalfishingwatch/api-types'
import type {
  AnyDeckLayer,
  DeckLayerPickingObject,
  FOOTPRINT_HIGH_RES_ID,
  FOOTPRINT_ID,
  FourwingsLayer,
  FourwingsVisualizationMode,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
  VesselsColorByProperty,
  VesselTrackVisualizationMode,
} from '@globalfishingwatch/deck-layers'
import type { VesselTrackGraphExtent } from '@globalfishingwatch/deck-loaders'

import type { ResolvedDataviewInstance } from './dataviews'

export type TimeRange = { start: string; end: string }

export type ResolverGlobalConfig = {
  start: string
  end: string
  zoom?: number
  token?: string
  debugTiles?: boolean
  bivariateDataviews: [string, string] | null
  activityVisualizationMode?: FourwingsVisualizationMode
  detectionsVisualizationMode?: FourwingsVisualizationMode
  environmentVisualizationMode?: typeof HEATMAP_ID | typeof HEATMAP_LOW_RES_ID
  vesselGroupsVisualizationMode?: typeof FOOTPRINT_ID | typeof FOOTPRINT_HIGH_RES_ID
  vesselTrackVisualizationMode?: VesselTrackVisualizationMode
  onPositionsMaxPointsError?: (layer: FourwingsLayer, maxPoints: number) => void
  // TODO review if we can move this to each own dataview
  compareStart?: string
  compareEnd?: string
  trackGraphExtent?: VesselTrackGraphExtent
  highlightedTime?: Partial<TimeRange>
  highlightEventIds?: string[]
  visibleEvents: EventTypes[]
  vesselsColorBy: VesselsColorByProperty
  vesselsMaxTimeGapHours?: number
  highlightedFeatures?: DeckLayerPickingObject[]
  vectorsTemporalAggregation?: boolean
}

export type DeckResolverFunction<
  LayerProps = AnyDeckLayer['props'],
  Dataview extends ResolvedDataviewInstance = ResolvedDataviewInstance,
> = (dataview: Dataview, globalConfig: ResolverGlobalConfig) => LayerProps
