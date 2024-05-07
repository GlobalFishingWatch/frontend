import { EventTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  AnyDeckLayer,
  DeckLayerPickingObject,
  FourwingsHeatmapResolution,
  FourwingsVisualizationMode,
} from '@globalfishingwatch/deck-layers'
import { TimeRange } from './dataviews'

export type ResolverGlobalConfig = {
  start: string
  end: string
  zoom?: number
  token?: string
  debug?: boolean
  bivariateDataviews?: [string, string]
  resolution?: FourwingsHeatmapResolution
  activityVisualizationMode?: FourwingsVisualizationMode
  detectionsVisualizationMode?: FourwingsVisualizationMode
  // TODO review if we can move this to each own dataview
  compareStart?: string
  compareEnd?: string
  highlightedTime: Partial<TimeRange>
  visibleEvents: EventTypes[]
  highlightedFeatures?: DeckLayerPickingObject[]
}

export type DeckResolverFunction<LayerProps = AnyDeckLayer['props']> = (
  dataview: UrlDataviewInstance,
  globalConfig: ResolverGlobalConfig
) => LayerProps
