import {
  isDetectionsDataview,
  isHeatmapAnimatedDataview,
  MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
  MERGED_DETECTIONS_ANIMATED_HEATMAP_GENERATOR_ID,
  MULTILAYER_SEPARATOR,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import {
  DEFAULT_CONTEXT_SOURCE_LAYER,
  DEFAULT_POINTS_SOURCE_LAYER,
  ExtendedStyle,
  GeneratorType,
  HeatmapLayerMeta,
  TRACK_HIGHLIGHT_SUFFIX,
} from '@globalfishingwatch/layer-composer'

export const MAPBOX_GL_DRAW_PREFIX = 'mapbox-gl-draw'
// Don't consider loading states for our interaction layers
export const isInteractionSource = (sourceId: string) => {
  return sourceId.includes(TRACK_HIGHLIGHT_SUFFIX) || sourceId.includes(MAPBOX_GL_DRAW_PREFIX)
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
        dataview.config?.type === GeneratorType.TileCluster
          ? DEFAULT_POINTS_SOURCE_LAYER
          : DEFAULT_CONTEXT_SOURCE_LAYER,
    } as HeatmapLayerMeta,
    generatorSourceId,
  }
}
