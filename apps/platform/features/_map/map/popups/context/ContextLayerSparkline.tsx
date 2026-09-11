import { useTranslation } from 'react-i18next'

import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { Choice, Spinner } from '@globalfishingwatch/ui-components'

import ReportActivityEvolution from 'features/_reports/tabs/activity/ReportActivityEvolution'

import type { TooltipSparklineOption } from './area-tooltip-timeseries.hooks'
import { useAreaTooltipTimeseries } from './area-tooltip-timeseries.hooks'

import styles from './ContextLayers.module.css'

const SPARKLINE_HEIGHT = 120

const ContextLayerSparkline = ({
  feature,
  option,
  options,
  canSwitch,
  onSelectCategory,
}: {
  feature: ContextPickingObject | UserLayerPickingObject
  option: TooltipSparklineOption
  options: TooltipSparklineOption[]
  canSwitch: boolean
  onSelectCategory: (id: string) => void
}) => {
  const { t } = useTranslation()
  const { loading, timeseries, start, end } = useAreaTooltipTimeseries(feature, option)

  return (
    <div className={styles.sparklineContainer}>
      {canSwitch ? (
        <Choice
          size="small"
          activeOption={option.id}
          options={options}
          onSelect={({ id }) => onSelectCategory(id)}
        />
      ) : (
        <span className={styles.sparklineLabel}>{option.label}</span>
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
