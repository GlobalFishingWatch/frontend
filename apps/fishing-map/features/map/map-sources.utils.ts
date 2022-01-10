import { ExtendedStyle } from '@globalfishingwatch/layer-composer'

export const getSourceMetadata = (style: ExtendedStyle, id: string) => {
  const generatorsMetadata = style?.metadata?.generatorsMetadata
  if (!generatorsMetadata) return null

  const activityHeatmapMetadata = generatorsMetadata[id]
  return activityHeatmapMetadata
}
