import React, { memo } from 'react'
import { ExtendedLayer } from '@globalfishingwatch/layer-composer/dist/types'

type BivariateLegendProps = {
  layer: ExtendedLayer
  onClick?: (layer: ExtendedLayer, event: React.MouseEvent) => void
}

function BivariateLegend({ layer, onClick }: BivariateLegendProps) {
  // TODO
  return null
}

export default memo(BivariateLegend)
