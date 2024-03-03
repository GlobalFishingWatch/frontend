import { AnyDeckLayer } from '@globalfishingwatch/deck-layers'

export function zIndexSortedArray(layersArray: any[]) {
  return layersArray
    .flatMap((l) => {
      if (!l) return []
      if (l?.layers?.length) return recursivelyGetLayers(l.layers)
      return l
    })
    .sort((a, b) => (a.props.zIndex && b.props.zIndex ? a.props.zIndex - b.props.zIndex : 0))
}

function recursivelyGetLayers(layers: any[]) {
  const reducer: any = layers.reduce((acc, layer) => {
    const l =
      layer?.layers?.length && layer.internalState ? recursivelyGetLayers(layer.layers) : [layer]
    return [...acc, ...l]
  }, [])
  return reducer
}
