import { EventTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  AnyDeckLayer,
  DeckLayerInteractionFeature,
  FourwingsResolution,
  FourwingsVisualizationMode,
} from '@globalfishingwatch/deck-layers'

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
  highlightedTime?: { start: string; end: string }
  locale?: string
  visibleEvents: EventTypes[]
}

export type DeckResolverFunction<
  LayerProps = AnyDeckLayer['props'],
  InteractionFeature = DeckLayerInteractionFeature
> = (
  dataview: UrlDataviewInstance,
  { start, end, resolution, debug }: ResolverGlobalConfig,
  interactions?: InteractionFeature[]
) => LayerProps
