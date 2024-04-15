import { EventTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  AnyDeckLayer,
  DeckLayerPickingObject,
  FourwingsResolution,
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
  resolution?: FourwingsResolution
  activityVisualizationMode?: FourwingsVisualizationMode
  detectionsVisualizationMode?: FourwingsVisualizationMode
  // TODO review if we can move this to each own dataview
  compareStart?: string
  compareEnd?: string
  highlightedTime: Partial<TimeRange>
  locale?: string
  visibleEvents: EventTypes[]
}

export type DeckResolverFunction<
  LayerProps = AnyDeckLayer['props'],
  InteractionFeature = DeckLayerPickingObject
> = (
  dataview: UrlDataviewInstance,
  globalConfig: ResolverGlobalConfig,
  interactions?: InteractionFeature[]
) => LayerProps
