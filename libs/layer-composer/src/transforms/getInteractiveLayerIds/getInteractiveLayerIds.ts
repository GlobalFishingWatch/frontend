import type { ExtendedStyle } from '../../types'

export const getInteractiveLayerIds = (style: ExtendedStyle) => {
  if (!style || !style.layers) return style
  const interactiveLayerIds = style.layers
    .filter((layer) => {
      return layer?.metadata?.interactive === true
    })
    .map((layer) => {
      return layer.id
    })

  const newStyle = { ...style }
  if (!newStyle.metadata) {
    newStyle.metadata = {}
  }
  newStyle.metadata.interactiveLayerIds = interactiveLayerIds
  return newStyle
}
