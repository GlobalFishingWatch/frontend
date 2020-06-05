import type { Style, Layer } from 'mapbox-gl'
import { Group, Dictionary, ExtendedStyle, ExtendedLayer, StyleTransformation } from '../../types'

const GROUP_ORDER = [
  Group.Background,
  Group.Basemap,
  Group.Heatmap,
  Group.OutlinePolygonsBackground,
  Group.OutlinePolygons,
  Group.OutlinePolygonsHighlighted,
  Group.BasemapFill,
  Group.Default,
  Group.Track,
  Group.TrackHighlightedEvent,
  Group.TrackHighlighted,
  Group.Point,
  Group.BasemapForeground,
  Group.Tool,
  Group.Label,
  Group.Overlay,
]

const GROUP_FROM_LEGACY: Dictionary<Group> = {
  'basemap-background': Group.Basemap,
  static: Group.OutlinePolygons,
  temporal: Group.Point,
  tracks: Group.Track,
  'basemap-foreground': Group.BasemapForeground,
  tools: Group.Overlay,
}

export const convertLegacyGroups = (style: Style): ExtendedStyle => {
  const newStyle = { ...style }
  newStyle.layers =
    newStyle.layers &&
    newStyle.layers.map((layer: Layer) => {
      const legacyGroup = layer.metadata && layer.metadata['mapbox:group']
      if (legacyGroup) {
        layer.metadata.group = GROUP_FROM_LEGACY[legacyGroup]
      }
      return layer
    })
  return newStyle
}

const sort: StyleTransformation = (style) => {
  const newStyle = { ...style }
  newStyle.layers = newStyle.layers?.sort((a: ExtendedLayer, b: ExtendedLayer) => {
    const aGroup = a.metadata?.group || Group.Default
    const bGroup = b.metadata?.group || Group.Default
    const aPos = GROUP_ORDER.indexOf(aGroup)
    const bPos = GROUP_ORDER.indexOf(bGroup)
    return aPos - bPos
  })
  return newStyle
}

export default sort
