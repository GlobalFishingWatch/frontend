import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { Bbox } from '@globalfishingwatch/data-transforms'
import { StatFields } from '@globalfishingwatch/api-types'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { FIT_BOUNDS_ANALYSIS_PADDING } from 'data/config'

type ActivityFitBoundsProps = {
  stats: StatFields
  loading: boolean
}

function ActivityFitBounds({ stats, loading }: ActivityFitBoundsProps): React.ReactElement {
  const { t } = useTranslation()
  const fitMapBounds = useMapFitBounds()
  const statsBbox = stats && ([stats.minLon, stats.minLat, stats.maxLon, stats.maxLat] as Bbox)

  const onFitBoundsHandle = () => {
    fitMapBounds(statsBbox, { padding: FIT_BOUNDS_ANALYSIS_PADDING })
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
