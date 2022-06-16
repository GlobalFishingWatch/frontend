import { ExtendedStyle, TRACK_HIGHLIGHT_SUFFIX } from '@globalfishingwatch/layer-composer'

export const MAPBOX_GL_DRAW_PREFIX = 'mapbox-gl-draw'
// Don't consider loading states for our interaction layers
export const isInteractionSource = (sourceId: string) => {
  return sourceId.includes(TRACK_HIGHLIGHT_SUFFIX) || sourceId.includes(MAPBOX_GL_DRAW_PREFIX)
}

export const getHeatmapSourceMetadata = (style: ExtendedStyle, id: string) => {
  return style?.metadata?.generatorsMetadata?.[id]
}
