import { Viewport } from '@deck.gl/core'
import { GraticuleLineGroup } from './graticules.types'

const SCALERANK_BREAKS = [9, 25, 50, 150]

export const checkScaleRankByViewport = (scaleRank: GraticuleLineGroup, viewport: Viewport) => {
  const bounds = viewport.getBounds()
  const viewportSize = {
    width: Math.abs(bounds[0] - bounds[2]),
    height: Math.abs(bounds[1] - bounds[3]),
  }
  const viewportMinSize =
    viewportSize.height < viewportSize.width ? viewportSize.height : viewportSize.width
  if (viewportMinSize >= SCALERANK_BREAKS[3]) {
    return scaleRank >= 90
  }
  if (viewportMinSize >= SCALERANK_BREAKS[2] && viewportMinSize < SCALERANK_BREAKS[3]) {
    return scaleRank >= 30
  }
  if (viewportMinSize >= SCALERANK_BREAKS[1] && viewportMinSize < SCALERANK_BREAKS[2]) {
    return scaleRank >= 10
  }
  if (viewportMinSize >= SCALERANK_BREAKS[0] && viewportMinSize < SCALERANK_BREAKS[1]) {
    return scaleRank >= 5
  }
  return true
}
