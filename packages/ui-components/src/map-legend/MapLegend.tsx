import React, { memo, useMemo } from 'react'
import cx from 'classnames'
import { ExtendedStyle, ExtendedLayer } from '@globalfishingwatch/layer-composer/dist/types'
import ColorRamp from './ColorRamp'
import Bivariate from './Bivariate'
import styles from './MapLegend.module.css'

interface MapLegendProps {
  className?: string
  style?: ExtendedStyle
  onClick?: (layer: ExtendedLayer, event: React.MouseEvent) => void
}

function MapLegend(props: MapLegendProps) {
  const { className, style, onClick } = props
  const layersWithLegend = useMemo(() => {
    return style
      ? style?.layers?.filter((layer) => layer.metadata?.legend !== undefined)
      : ([] as ExtendedLayer[])
  }, [style])
  return (
    <div className={cx(styles.legend, className)}>
      {layersWithLegend?.map((layer, index) => {
        if (layer.metadata?.legend?.type === 'colorramp') {
          return <ColorRamp key={layer.id || index} layer={layer} onClick={onClick} />
        }
        if (layer.metadata?.legend?.type === 'bivariate') {
          return <Bivariate key={layer.id || index} layer={layer} onClick={onClick} />
        }
        return null
      })}
    </div>
  )
}

export default memo(MapLegend)
