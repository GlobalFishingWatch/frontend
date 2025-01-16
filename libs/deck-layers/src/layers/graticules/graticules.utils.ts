import type { Viewport } from '@deck.gl/core'

import type { GraticulesFeature } from './graticules.types'

const SCALERANK_BREAKS = [9, 25, 50, 150]

export const checkScaleRankByViewport = (d: GraticulesFeature, viewport: Viewport) => {
  const bounds = viewport.getBounds()
  const lonDelta = Math.abs(bounds[0] - bounds[2])
  const latDelta = Math.abs(bounds[1] - bounds[3])

  const viewportMinSize = latDelta < lonDelta ? latDelta : lonDelta

  if (viewportMinSize >= SCALERANK_BREAKS[3]) {
    return d.properties.scaleRank >= 90
  }
  if (viewportMinSize >= SCALERANK_BREAKS[2] && viewportMinSize < SCALERANK_BREAKS[3]) {
    return d.properties.scaleRank >= 30
  }
  if (viewportMinSize >= SCALERANK_BREAKS[1] && viewportMinSize < SCALERANK_BREAKS[2]) {
    return d.properties.scaleRank >= 10
  }
  if (viewportMinSize >= SCALERANK_BREAKS[0] && viewportMinSize < SCALERANK_BREAKS[1]) {
    return d.properties.scaleRank >= 5
  }
  return true
}
