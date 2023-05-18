import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { MapLegend, Tooltip } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { useTimeCompareTimeDescription } from 'features/reports/reports-timecomparison.hooks'
import styles from './MapLegends.module.css'
import { AnyLegend, LegendTranslated, useLegendsTranslated } from './map-legends.hooks'

const MapLegendWrapper: React.FC<{ legend: LegendTranslated }> = ({ legend }) => {
  const { t } = useTranslation()
  return (
    <MapLegend
      layer={legend}
      className={styles.legend}
      roundValues={legend.category !== DataviewCategory.Environment}
      currentValueClassName={styles.currentValue}
      labelComponent={
        legend.label.includes('²') ? (
          <Tooltip content={t('map.legend_help', 'Approximated grid cell area at the Equator')}>
            <span className={cx(styles.legendLabel, styles.help)}>{legend.label}</span>
          </Tooltip>
        ) : (
          <span className={styles.legendLabel}>{legend.label}</span>
        )
      }
    />
  )
}

interface MapLegendsProps {
  legends: AnyLegend[]
  portalled?: boolean
}

const MapLegends: React.FC<MapLegendsProps> = ({ legends, portalled = false }: MapLegendsProps) => {
  // Assuming only timeComparison heatmap is visible, so timerange description apply to all
  const timeCompareTimeDescription = useTimeCompareTimeDescription()
  const legendsTranslated = useLegendsTranslated(legends, portalled)

  if (!legends || !legends.length) return null

  return (
    <div className={cx({ [styles.legendContainer]: !portalled })}>
      {timeCompareTimeDescription && !portalled && <div>{timeCompareTimeDescription}</div>}
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
