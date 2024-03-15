import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  LegendType,
  MapLegend,
  Tooltip,
  UILegendColorRamp,
} from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayerLegend } from '@globalfishingwatch/deck-layer-composer'
import { ColorRange, deckToRgbaColor } from '@globalfishingwatch/deck-layers'
import { useTimeCompareTimeDescription } from 'features/reports/reports-timecomparison.hooks'
import {
  selectActivityMergedDataviewId,
  selectDetectionsMergedDataviewId,
} from 'features/dataviews/selectors/dataviews.selectors'
import styles from './MapLegend.module.css'

const MapLegendWrapper = ({ dataview }: { dataview: UrlDataviewInstance }) => {
  const { t } = useTranslation()
  // TODO: restore useTimeCompareTimeDescription and delete the component in the map folder
  const activityMergedDataviewId = useSelector(selectActivityMergedDataviewId)
  const detectionsMergedDataviewId = useSelector(selectDetectionsMergedDataviewId)
  const dataviewId =
    // TODO: include environment
    dataview.category === DataviewCategory.Activity
      ? activityMergedDataviewId
      : detectionsMergedDataviewId
  const deckLegend = useGetDeckLayerLegend(dataviewId)
  const isBivariate = deckLegend?.type === LegendType.Bivariate

  if (!deckLegend) {
    return null
  }
  const legendSublayerIndex = deckLegend?.sublayers.findIndex(
    (sublayer) => sublayer.id === dataview.id
  )
  if (legendSublayerIndex < 0 || (isBivariate && legendSublayerIndex !== 0)) {
    return null
  }
  const colors = isBivariate
    ? (deckLegend.ranges as string[])
    : (deckLegend.ranges?.[legendSublayerIndex] as ColorRange)?.map((color) => {
        return deckToRgbaColor(color)
      })
  const uiLegend: UILegendColorRamp = {
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
