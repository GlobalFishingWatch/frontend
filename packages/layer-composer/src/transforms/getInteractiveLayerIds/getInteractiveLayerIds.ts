import type { Style } from 'mapbox-gl'

const getInteractiveIds = (style: Style) => {
  if (!style || !style.layers) return style
  const interactiveLayerIds = style.layers
    .filter((layer) => {
      return layer.metadata && layer.metadata.interactive === true
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

export default getInteractiveIds
