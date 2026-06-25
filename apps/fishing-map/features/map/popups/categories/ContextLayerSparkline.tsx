import { useTranslation } from 'react-i18next'

import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { Choice, Spinner } from '@globalfishingwatch/ui-components'

import ReportActivityEvolution from 'features/reports/tabs/activity/ReportActivityEvolution'

import type { TooltipCategory } from './area-tooltip-timeseries.hooks'
import { useAreaTooltipTimeseries } from './area-tooltip-timeseries.hooks'

import styles from './ContextLayers.module.css'

const SPARKLINE_HEIGHT = 120

const ContextLayerSparkline = ({
  feature,
  category,
  canSwitch,
  onSelectCategory,
}: {
  feature: ContextPickingObject | UserLayerPickingObject
  category: TooltipCategory
  canSwitch: boolean
  onSelectCategory: (category: TooltipCategory) => void
}) => {
  const { t } = useTranslation()
  const { loading, timeseries, start, end } = useAreaTooltipTimeseries(feature, category)

  const label =
    category === 'detections' ? t((t) => t.common.detections) : t((t) => t.common.activity)

  return (
    <div className={styles.sparklineContainer}>
      <div>
        {canSwitch ? (
          <Choice
            size="small"
            activeOption={category}
            options={[
              { id: 'activity', label: t((t) => t.common.activity) },
              { id: 'detections', label: t((t) => t.common.detections) },
            ]}
            onSelect={(option) => onSelectCategory(option.id as TooltipCategory)}
          />
        ) : (
          <span className={styles.sparklineLabel}>{label}</span>
        )}
      </div>
      {loading ? (
        <div className={styles.sparkline} style={{ height: SPARKLINE_HEIGHT }}>
          <Spinner size="small" />
        </div>
      ) : !timeseries?.timeseries?.length ? (
        <div className={styles.sparklineEmpty}>{t((t) => t.analysis.noDataByArea)}</div>
      ) : (
        <div className={styles.sparkline}>
          <ReportActivityEvolution
            data={timeseries}
            start={start}
            end={end}
            height={SPARKLINE_HEIGHT}
            hideAxes
          />
        </div>
      )}
    </div>
  )
}

export default ContextLayerSparkline
