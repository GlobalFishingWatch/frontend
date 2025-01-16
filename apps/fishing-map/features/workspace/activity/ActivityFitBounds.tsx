import { useTranslation } from 'react-i18next'

import type { StatFields } from '@globalfishingwatch/api-types'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import { IconButton } from '@globalfishingwatch/ui-components'

import { FIT_BOUNDS_REPORT_PADDING } from 'data/config'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'

type ActivityFitBoundsProps = {
  stats: StatFields
  loading: boolean
}

function ActivityFitBounds({ stats, loading }: ActivityFitBoundsProps) {
  const { t } = useTranslation()
  const fitMapBounds = useMapFitBounds()
  const statsBbox = stats && ([stats.minLon, stats.minLat, stats.maxLon, stats.maxLat] as Bbox)

  const onFitBoundsHandle = () => {
    fitMapBounds(statsBbox, { padding: FIT_BOUNDS_REPORT_PADDING })
  }

  return statsBbox ? (
    <IconButton
      icon="target"
      tooltip={t('layer.activityFitBounds', 'Center view on activity')}
      loading={loading}
      tooltipPlacement="top"
      size="small"
      onClick={onFitBoundsHandle}
    />
  ) : null
}

export default ActivityFitBounds
