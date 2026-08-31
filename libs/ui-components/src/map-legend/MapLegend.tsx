import React from 'react'
import cx from 'classnames'

import { BivariateLegend } from './Bivariate'
import { ColorRampLegend } from './ColorRamp'
import type { ColorRampBrushRange } from './ColorRampBrush'
import { SolidLegend } from './Solid'
import { SymbolsLegend } from './Symbols'
import type {
  UILegend,
  UILegendBivariate,
  UILegendColorRamp,
  UILegendSolid,
  UILegendSymbols,
} from './types'

import styles from './MapLegend.module.css'

interface MapLegendProps {
  className?: string
  currentValueClassName?: string
  layer: UILegend
  labelComponent?: React.ReactNode
  roundValues?: boolean
  brushRange?: ColorRampBrushRange
  onBrushChange?: (range: ColorRampBrushRange) => void
  brushLabel?: string
  brushMinLabel?: string
  brushMaxLabel?: string
  brushRemoveLabel?: string
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
  brushRange,
  onBrushChange,
  brushLabel,
  brushMinLabel,
  brushMaxLabel,
  brushRemoveLabel,
}: MapLegendProps) {
  // TODO: include user context and categorical options
  if (layer.type === 'symbols') {
    return <SymbolsLegend layer={layer as UILegendSymbols} className={className} />
  }
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
        brushRange={brushRange}
        onBrushChange={onBrushChange}
        brushLabel={brushLabel}
        brushMinLabel={brushMinLabel}
        brushMaxLabel={brushMaxLabel}
        brushRemoveLabel={brushRemoveLabel}
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
