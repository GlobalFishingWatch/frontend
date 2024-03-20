import {
  isDetectionsDataview,
  isHeatmapAnimatedDataview,
  isHeatmapStaticDataview,
  MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
  MERGED_DETECTIONS_ANIMATED_HEATMAP_GENERATOR_ID,
  MULTILAYER_SEPARATOR,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import {
  DEFAULT_CONTEXT_SOURCE_LAYER,
  DEFAULT_POINTS_SOURCE_LAYER,
  ExtendedStyle,
  getHeatmapStaticSourceId,
  HeatmapLayerMeta,
  TRACK_HIGHLIGHT_SUFFIX,
} from '@globalfishingwatch/layer-composer'
import { DataviewType } from '@globalfishingwatch/api-types'
import {
  MAPBOX_GL_DRAW_PREFIX,
  PREVIEW_BUFFER_GENERATOR_ID,
  REPORT_BUFFER_GENERATOR_ID,
} from './map.config'

// Don't consider loading states for our interaction layers
export const isInteractionSource = (sourceId: string) => {
  return (
    sourceId.includes(TRACK_HIGHLIGHT_SUFFIX) ||
    sourceId.includes(MAPBOX_GL_DRAW_PREFIX) ||
    sourceId.includes(PREVIEW_BUFFER_GENERATOR_ID) ||
    sourceId.includes(REPORT_BUFFER_GENERATOR_ID)
  )
}

export const getHeatmapSourceMetadata = (style: ExtendedStyle, id: string) => {
  return style?.metadata?.generatorsMetadata?.[id]
}

export const getSourceMetadata = (style: ExtendedStyle, dataview: UrlDataviewInstance) => {
  const activityDataview = isHeatmapAnimatedDataview(dataview)
  if (activityDataview) {
    const generatorSourceId = isDetectionsDataview(dataview)
      ? MERGED_DETECTIONS_ANIMATED_HEATMAP_GENERATOR_ID
      : MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID
    const metadata = getHeatmapSourceMetadata(style, generatorSourceId)
    return { metadata, generatorSourceId }
  }
  const heatmapStaticDataview = isHeatmapStaticDataview(dataview)
  if (heatmapStaticDataview) {
    return {
      metadata: {
        static: true,
        sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
      } as HeatmapLayerMeta,
      generatorSourceId: getHeatmapStaticSourceId(dataview.id),
    }
  }
  const environmentMetadata = getHeatmapSourceMetadata(style, dataview.id)
  if (environmentMetadata) {
    return { metadata: environmentMetadata, generatorSourceId: dataview.id }
  }

  const generatorSourceId = Array.isArray(dataview.config?.layers)
    ? `${dataview.id}${MULTILAYER_SEPARATOR}${dataview.config?.layers[0]?.id}`
    : `${dataview.id}${MULTILAYER_SEPARATOR}${dataview.config?.layers}`

  return {
    metadata: {
      sourceLayer:
        dataview.config?.type === DataviewType.TileCluster
          ? DEFAULT_POINTS_SOURCE_LAYER
          : DEFAULT_CONTEXT_SOURCE_LAYER,
    } as HeatmapLayerMeta,
    generatorSourceId,
  }
}
