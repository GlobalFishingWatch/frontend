import React, { memo } from 'react'
import cx from 'classnames'
import { ExtendedLayer } from '@globalfishingwatch/layer-composer/dist/types'
import ColorRamp from './ColorRamp'
import Bivariate from './Bivariate'
import styles from './MapLegend.module.css'

interface MapLegendProps {
  className?: string
  layers?: ExtendedLayer[]
}

function MapLegend(props: MapLegendProps) {
  const { className, layers } = props
  return (
    <div className={cx(styles.legend, className)}>
      {layers?.map((layer, index) => {
        if (layer.metadata?.legend?.type === 'colorramp') {
          return <ColorRamp key={layer.id || index} layer={layer} />
        }
        if (layer.metadata?.legend?.type === 'bivariate') {
          return <Bivariate key={layer.id || index} layer={layer} />
        }
        return null
      })}
    </div>
  )
}

export default memo(MapLegend)
