import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { useGetDeckLayerLegend } from '@globalfishingwatch/deck-layer-composer'
import type { UILegend } from '@globalfishingwatch/ui-components'
import { MapLegend, Tooltip } from '@globalfishingwatch/ui-components'

import { selectActivityMergedDataviewId } from 'features/dataviews/selectors/dataviews.selectors'
import { useTimeCompareTimeDescription } from 'features/reports/tabs/activity/reports-activity-timecomparison.hooks'

import styles from './MapLegends.module.css'

const TimeComparisonLegend = () => {
  // Assuming only timeComparison heatmap is visible, so timerange description apply to all
  const timeCompareTimeDescription = useTimeCompareTimeDescription()
  const { t } = useTranslation()
  const layerId = useSelector(selectActivityMergedDataviewId)
  const legend = useGetDeckLayerLegend(layerId)

  if (!legend || !timeCompareTimeDescription) {
    return null
  }

  const uiLegend: UILegend = {
    id: legend.id,
    type: legend.type,
    values: legend.domain as number[],
    colors: (legend.ranges?.[0] as string[]) || [],
    currentValue: legend.currentValues?.[0],
    label: legend.label || '',
  }

  return (
    <div className={cx({ [styles.legendContainer]: true })}>
      {timeCompareTimeDescription && <div>{timeCompareTimeDescription}</div>}
      <MapLegend
        layer={uiLegend as any}
        className={styles.legend}
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
    </div>
  )
}

export default TimeComparisonLegend
