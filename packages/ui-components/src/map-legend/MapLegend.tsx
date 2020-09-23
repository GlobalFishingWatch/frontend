import React, { memo } from 'react'
import cx from 'classnames'
import { LayerMetadataLegend } from '@globalfishingwatch/layer-composer/dist/types'
import Solid from './Solid'
import ColorRamp from './ColorRamp'
import Bivariate from './Bivariate'
import styles from './MapLegend.module.css'

// TODO unify this with use-map-legend
export type LegendLayer = LayerMetadataLegend & {
  color: string
}

interface MapLegendProps {
  className?: string
  layers?: LegendLayer[]
}

function MapLegend(props: MapLegendProps) {
  const { className, layers } = props
  return (
    <div className={cx(styles.legend, className)}>
      {layers?.map((layer, index) => {
        // TODO: include user context and categorical options
        if (layer.type === 'solid') {
          return <Solid key={layer.id || index} layer={layer} />
        }
        if (layer.type === 'colorramp') {
          return <ColorRamp key={layer.id || index} layer={layer} />
        }
        if (layer.type === 'bivariate') {
          return <Bivariate key={layer.id || index} layer={layer} />
        }
        return null
      })}
    </div>
  )
}

export default memo(MapLegend)
