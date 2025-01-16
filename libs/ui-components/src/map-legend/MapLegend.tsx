import React from 'react'
import cx from 'classnames'

import { BivariateLegend } from './Bivariate'
import { ColorRampLegend } from './ColorRamp'
import { SolidLegend } from './Solid'
import type { UILegend, UILegendBivariate, UILegendColorRamp, UILegendSolid } from './types'

import styles from './MapLegend.module.css'

interface MapLegendProps {
  className?: string
  currentValueClassName?: string
  layer: UILegend
  labelComponent?: React.ReactNode
  roundValues?: boolean
}

interface MapLegendsProps extends Omit<MapLegendProps, 'layer'> {
  layers?: UILegend[]
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
    return <SolidLegend layer={layer as UILegendSolid} className={className} />
  }
  if (layer.type === 'colorramp' || layer.type === 'colorramp-discrete') {
    return (
      <ColorRampLegend
        layer={layer as UILegendColorRamp}
        className={className}
        roundValues={roundValues}
        currentValueClassName={currentValueClassName}
        labelComponent={labelComponent}
      />
    )
  }
  if (layer.type === 'bivariate') {
    return (
      <BivariateLegend
        layer={layer as UILegendBivariate}
        roundValues={roundValues}
        className={className}
        labelComponent={labelComponent}
      />
    )
  }
  return null
}

export function MapLegends(props: MapLegendsProps) {
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
