import { ExtendedStyle } from '@globalfishingwatch/layer-composer'

export const getSourceMetadata = (style: ExtendedStyle, id: string) => {
  return style?.metadata?.generatorsMetadata?.[id]
}
