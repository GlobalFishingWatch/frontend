import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { LegendType, MapLegend, Tooltip, UILegend } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DeckLegendAtom, useGetDeckLayerLegend } from '@globalfishingwatch/deck-layer-composer'
import {
  selectActivityMergedDataviewId,
  selectDetectionsMergedDataviewId,
} from 'features/dataviews/selectors/dataviews.selectors'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { t } from 'features/i18n/i18n'
import MapLegendPlaceholder from 'features/workspace/common/MapLegendPlaceholder'
import styles from './MapLegend.module.css'

const getLegendLabelTranslated = (legend?: DeckLegendAtom, tFn = t) => {
  if (!legend) {
    return {} as DeckLegendAtom
  }
  let label =
    legend.unit === 'hours'
      ? tFn('common.hour_other', 'hours').toLowerCase()
      : legend.unit === 'detections'
      ? tFn('common.detections', 'detections').toLowerCase()
      : legend.label

  if (legend.label?.includes('²')) {
    const isSquareKm = (legend.gridArea as number) > 50000
    const gridArea = isSquareKm ? (legend.gridArea as number) / 1000000 : legend.gridArea
    const gridAreaFormatted = gridArea
      ? formatI18nNumber(gridArea, {
          style: 'unit',
          unit: isSquareKm ? 'kilometer' : 'meter',
          unitDisplay: 'short',
        })
      : ''
    label = `${label} / ${gridAreaFormatted}²`
  }
  return { ...legend, label } as DeckLegendAtom
}

const MapLegendWrapper = ({ dataview }: { dataview: UrlDataviewInstance }) => {
  const { t } = useTranslation()
  // TODO: restore useTimeCompareTimeDescription and delete the component in the map folder
  const activityMergedDataviewId = useSelector(selectActivityMergedDataviewId)
  const detectionsMergedDataviewId = useSelector(selectDetectionsMergedDataviewId)
  const dataviewId =
    dataview.category === DataviewCategory.Environment
      ? dataview.id
      : dataview.category === DataviewCategory.Detections
      ? detectionsMergedDataviewId
      : activityMergedDataviewId
  const deckLegend = getLegendLabelTranslated(useGetDeckLayerLegend(dataviewId))
  const isBivariate = deckLegend?.type === LegendType.Bivariate

  if (!deckLegend) {
    return null
  }
  const legendSublayerIndex = deckLegend?.sublayers?.findIndex(
    (sublayer) => sublayer.id === dataview.id
  )
  if (legendSublayerIndex < 0 || (isBivariate && legendSublayerIndex !== 0) || !deckLegend.ranges) {
    return <MapLegendPlaceholder />
  }

  const colors = isBivariate
    ? (deckLegend.ranges as string[])
    : (deckLegend.ranges[legendSublayerIndex] as string[])
  const uiLegend: UILegend = {
    id: deckLegend.id,
    type: isBivariate ? LegendType.Bivariate : LegendType.ColorRampDiscrete,
    values: deckLegend.domain as number[],
    colors,
    currentValue: isBivariate
      ? deckLegend.currentValues
      : deckLegend.currentValues?.[legendSublayerIndex],
    label: deckLegend.label || '',
  }

  return (
    <MapLegend
      layer={uiLegend}
      className={styles.legend}
      roundValues={dataview.category !== DataviewCategory.Environment}
      currentValueClassName={styles.currentValue}
      labelComponent={
        uiLegend.label?.includes('²') ? (
          <Tooltip content={t('map.legend_help', 'Approximated grid cell area at the Equator')}>
            <span className={cx(styles.legendLabel, styles.help)}>{uiLegend.label}</span>
          </Tooltip>
        ) : (
          <span className={styles.legendLabel}>{uiLegend.label}</span>
        )
      }
    />
  )
}

export default MapLegendWrapper
