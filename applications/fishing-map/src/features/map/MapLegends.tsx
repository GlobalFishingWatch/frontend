import React, { useMemo } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { LegendLayer, LegendLayerBivariate } from '@globalfishingwatch/react-hooks'
import { GeneratorType } from '@globalfishingwatch/layer-composer/dist/generators'
import { MapLegend, Tooltip } from '@globalfishingwatch/ui-components'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { useMapControl } from './map-context.hooks'
import styles from './MapLegends.module.css'

type AnyLegend = LegendLayer | LegendLayerBivariate
type LegendTranslated = AnyLegend & { label: string }

const MapLegendWrapper: React.FC<{ legend: LegendTranslated }> = ({ legend }) => {
  const { t } = useTranslation()
  return (
    <MapLegend
      layer={legend}
      className={styles.legend}
      currentValueClassName={styles.currentValue}
      labelComponent={
        <Tooltip content={t('map.legend_help', 'Approximated grid cell area at the Equator')}>
          <span className={styles.legendLabel}>{legend.label}</span>
        </Tooltip>
      }
    />
  )
}

interface MapLegendsProps {
  legends: AnyLegend[]
  portalled?: boolean
}

const MapLegends: React.FC<MapLegendsProps> = ({ legends, portalled = false }: MapLegendsProps) => {
  const { t } = useTranslation()
  const { containerRef } = useMapControl()
  const legendsTranslated = useMemo(() => {
    return legends?.map((legend) => {
      const isSquareKm = (legend.gridArea as number) > 50000
      let label = legend.unit || ''
      if (legend.generatorType === GeneratorType.HeatmapAnimated) {
        const gridArea = isSquareKm ? (legend.gridArea as number) / 1000000 : legend.gridArea
        const gridAreaFormatted = gridArea
          ? formatI18nNumber(gridArea, {
              style: 'unit',
              unit: isSquareKm ? 'kilometer' : 'meter',
              unitDisplay: 'short',
            })
          : ''
        if (legend.unit === 'hours') {
          label = `${t('common.hour_other', 'hours')} / ${gridAreaFormatted}²`
        }
      }
      return { ...legend, label }
    })
  }, [legends, t])
  if (!legends) return null
  return (
    <div ref={containerRef} className={cx({ [styles.legendContainer]: !portalled })}>
      {legendsTranslated?.map((legend: LegendTranslated, i: number) => {
        if (portalled) {
          const legendDomElement = document.getElementById(legend.id as string)
          if (legendDomElement) {
            return createPortal(<MapLegendWrapper legend={legend} key={i} />, legendDomElement)
          }
          return null
        } else {
          return <MapLegendWrapper legend={legend} key={i} />
        }
      })}
    </div>
  )
}

export default MapLegends
