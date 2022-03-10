import { ExtendedStyle } from '@globalfishingwatch/layer-composer'

export const getHeatmapSourceMetadata = (style: ExtendedStyle, id: string) => {
  return style?.metadata?.generatorsMetadata?.[id]
}
