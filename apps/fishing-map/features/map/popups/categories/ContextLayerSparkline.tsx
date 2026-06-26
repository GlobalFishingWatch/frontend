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

  const activityLabel = t((t) => t.common.activity)
  const detectionsLabel = t((t) => t.common.detections)

  return (
    <div className={styles.sparklineContainer}>
      {canSwitch ? (
        <Choice
          size="small"
          activeOption={category}
          options={[
            { id: 'activity', label: activityLabel },
            { id: 'detections', label: detectionsLabel },
          ]}
          onSelect={(option) => onSelectCategory(option.id as TooltipCategory)}
        />
      ) : (
        <span className={styles.sparklineLabel}>
          {category === 'detections' ? detectionsLabel : activityLabel}
        </span>
      )}
      <div className={styles.sparkline} style={{ height: SPARKLINE_HEIGHT }}>
        {loading ? (
          <Spinner size="small" />
        ) : !timeseries?.timeseries?.length ? (
          <span className={styles.sparklineEmpty}>{t((t) => t.analysis.noDataByArea)}</span>
        ) : (
          <ReportActivityEvolution
            data={timeseries}
            start={start}
            end={end}
            height="100%"
            hideAxes
          />
        )}
      </div>
    </div>
  )
}

export default ContextLayerSparkline
