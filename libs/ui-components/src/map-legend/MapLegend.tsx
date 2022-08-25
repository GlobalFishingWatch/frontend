import React from 'react'
import cx from 'classnames'
import type {
  LayerMetadataLegend,
  LayerMetadataLegendBivariate,
} from '@globalfishingwatch/layer-composer'
import { SolidLegend } from './Solid'
import { ColorRampLegend } from './ColorRamp'
import { BivariateLegend } from './Bivariate'
import styles from './MapLegend.module.css'

type UILayer = {
  color: string
  generatorId: string
  generatorType: string
}

export type LegendLayer = LayerMetadataLegend & UILayer

export type LegendLayerBivariate = LayerMetadataLegendBivariate & UILayer

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
    return <SolidLegend layer={layer as LegendLayer} className={className} />
  }
  if (layer.type === 'colorramp' || layer.type === 'colorramp-discrete') {
    return (
      <ColorRampLegend
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
      <BivariateLegend
        layer={layer as LegendLayerBivariate}
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
