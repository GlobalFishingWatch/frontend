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
  roundValues?: boolean
}

interface MapLegendsProps extends Omit<MapLegendProps, 'layer'> {
  layers?: LegendLayer[]
}

export function MapLegend({
  layer,
  className,
  currentValueClassName,
  labelComponent,
  roundValues,
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
        roundValues={roundValues}
        currentValueClassName={currentValueClassName}
        labelComponent={labelComponent}
      />
    )
  }
  if (layer.type === 'bivariate') {
    return (
      <Bivariate
        layer={layer as LegendLayerBivariate}
        roundValues={roundValues}
        className={className}
        labelComponent={labelComponent}
      />
    )
  }
  return null
}

function MapLegends(props: MapLegendsProps) {
  const { className, layers, roundValues, labelComponent } = props
  return (
    <div className={cx(styles.legends, className)}>
      {layers?.map((layer, index) => (
        <MapLegend
          layer={layer}
          key={layer.id || index}
          roundValues={roundValues}
          labelComponent={labelComponent}
        />
      ))}
    </div>
  )
}

export default memo(MapLegends)
