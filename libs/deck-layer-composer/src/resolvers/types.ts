import { EventTypes } from '@globalfishingwatch/api-types'
import { FourwingsVisualizationMode } from '@globalfishingwatch/deck-layers'

export type ResolverGlobalConfig = {
  start?: string
  end?: string
  zoom?: number
  token?: string
  bivariateDataviews?: [string, string]
  activityVisualizationMode?: FourwingsVisualizationMode
  detectionsVisualizationMode?: FourwingsVisualizationMode
  // TODO review if we can move this to each own dataview
  compareStart?: string
  compareEnd?: string
  highlightedTime?: { start: string; end: string }
  locale?: string
  visibleEvents?: EventTypes[]
}
