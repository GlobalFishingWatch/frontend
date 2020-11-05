import React, { memo } from 'react'
import cx from 'classnames'
import Solid from './Solid'
import ColorRamp from './ColorRamp'
import Bivariate from './Bivariate'
import styles from './MapLegend.module.css'
import { LegendLayer, LegendLayerBivariate } from '.'

interface MapLegendProps {
  className?: string
  currentValueClassName?: string
  layer: LegendLayer | LegendLayerBivariate
  labelComponent?: React.ReactNode
}

interface MapLegendsProps {
  className?: string
  currentValueClassName?: string
  layers?: LegendLayer[]
}

export function MapLegend({
  layer,
  className,
  currentValueClassName,
  labelComponent,
}: MapLegendProps) {
  // TODO: include user context and categorical options
  if (layer.type === 'solid') {
    return <Solid layer={layer as LegendLayer} className={className} />
  }
  if (layer.type === 'colorramp' || layer.type === 'colorramp-discrete') {
    return (
      <ColorRamp
        layer={layer as LegendLayer}
        className={className}
        currentValueClassName={currentValueClassName}
        labelComponent={labelComponent}
      />
    )
  }
  if (layer.type === 'bivariate') {
    return (
      <Bivariate
        layer={layer as LegendLayerBivariate}
        className={className}
        labelComponent={labelComponent}
      />
    )
  }
  return null
}

function MapLegends(props: MapLegendsProps) {
  const { className, layers } = props
  return (
    <div className={cx(styles.legend, className)}>
      {layers?.map((layer, index) => (
        <MapLegend layer={layer} key={layer.id || index} />
      ))}
    </div>
  )
}

export default memo(MapLegends)
