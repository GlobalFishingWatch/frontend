import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Button, Spinner } from '@globalfishingwatch/ui-components'
import { ActivityByType } from 'features/vessel/activity/activity-by-type/ActivityByType'
import ActivityByVoyage from 'features/vessel/activity/activity-by-voyage/ActivityByVoyage'
import { selectVesselEventsLoading } from 'features/vessel/activity/vessels-activity.selectors'
import VesselActivityDownload from 'features/vessel/activity/VesselActivityDownload'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselActivityMode } from 'features/vessel/vessel.selectors'
import { VesselProfileActivityMode } from 'types'
import styles from './VesselActivity.module.css'
import { VesselActivitySummary } from './summary/VesselActivitySummary'

const VesselActivity = () => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const activityMode = useSelector(selectVesselActivityMode)
  const eventsLoading = useSelector(selectVesselEventsLoading)

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
  return (
    <Fragment>
      <div className={styles.summaryContainer}>
        <VesselActivitySummary />
        <div className={styles.download}>
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
