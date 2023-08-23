import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Button, Spinner } from '@globalfishingwatch/ui-components'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import { ActivityByType } from 'features/vessel/activity/activity-by-type/ActivityByType'
import ActivityByVoyage from 'features/vessel/activity/activity-by-voyage/ActivityByVoyage'
import VesselActivityDownload from 'features/vessel/activity/VesselActivityDownload'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselActivityMode } from 'features/vessel/vessel.config.selectors'
import { VesselProfileActivityMode } from 'types'
import {
  selectVesselEventsResources,
  selectVesselEventsResourcesLoading,
} from 'features/vessel/vessel.selectors'
import VesselActivityFilter from 'features/vessel/activity/VesselActivityFilter'
import styles from './VesselActivity.module.css'
import { VesselActivitySummary } from './VesselActivitySummary'

const VesselActivity = () => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const activityMode = useSelector(selectVesselActivityMode)
  const eventsLoading = useSelector(selectVesselEventsResourcesLoading)
  const eventsResources = useSelector(selectVesselEventsResources)

  const setActivityMode = (vesselActivityMode: VesselProfileActivityMode) => {
    dispatchQueryParams({ vesselActivityMode })
  }

  if (eventsLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }
  const eventsError = eventsResources.some((resource) => resource.status === ResourceStatus.Error)
  if (eventsError) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.error}>
          {t('errors.profileEvents', 'There was an error requesting the vessel events.')}
        </span>
      </div>
    )
  }
  return (
    <Fragment>
      <div className={styles.summaryContainer}>
        <VesselActivitySummary />
        <div className={styles.actions}>
          <VesselActivityFilter />
          <VesselActivityDownload />
        </div>
      </div>
      <div className={styles.activityTitleContainer}>
        <label>
          {activityMode === 'voyage'
            ? t('vessel.activityByVoyages', 'Timeline by voyages')
            : t('vessel.activityByType', 'Activity by type')}
        </label>
        <Button
          className="print-hidden"
          size="small"
          type="border-secondary"
          onClick={(e) => setActivityMode(activityMode === 'type' ? 'voyage' : 'type')}
        >
          {activityMode === 'voyage'
            ? t('vessel.activityGroupByType', 'Group by type')
            : t('vessel.activityGroupByVoyages', 'Group by voyages')}
        </Button>
      </div>
      {eventsLoading && (
        <div className={styles.placeholder}>
          <Spinner />
        </div>
      )}
      {!eventsLoading && activityMode === 'type' && <ActivityByType />}
      {!eventsLoading && activityMode === 'voyage' && <ActivityByVoyage />}
    </Fragment>
  )
}

export default VesselActivity
