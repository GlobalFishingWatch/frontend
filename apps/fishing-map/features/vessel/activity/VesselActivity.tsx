import { useTranslation } from 'react-i18next'
import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Spinner } from '@globalfishingwatch/ui-components'
import { ActivityByType } from 'features/vessel/activity/activity-by-type/ActivityByType'
import ActivityByVoyage from 'features/vessel/activity/activity-by-voyage/ActivityByVoyage'
import { selectVesselEventsLoading } from 'features/vessel/activity/vessels-activity.selectors'
import styles from './VesselActivity.module.css'
import { VesselActivitySummary } from './summary/VesselActivitySummary'

type activityModeType = 'voyages' | 'type'

const VesselActivity = () => {
  const { t } = useTranslation()
  const [activityMode, setActivityMode] = useState<activityModeType>('type')
  const eventsLoading = useSelector(selectVesselEventsLoading)

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
        <label>{t('common.summary', 'Summary')}</label>
        <VesselActivitySummary />
      </div>
      <div className={styles.activityTitleContainer}>
        <label>
          {activityMode === 'voyages'
            ? t('vessel.activityByVoyages', 'Timeline by voyages')
            : t('vessel.activityGroupByType', 'Group by type')}
        </label>
        <Button
          className={styles.actionButton}
          onClick={(e) => setActivityMode(activityMode === 'type' ? 'voyages' : 'type')}
        >
          {activityMode === 'voyages'
            ? t('vessel.activityGroupByType', 'Group by type')
            : t('vessel.activityByVoyages', 'Timeline by voyages')}
        </Button>
      </div>
      {eventsLoading && (
        <div className={styles.placeholder}>
          <Spinner />
        </div>
      )}
      {!eventsLoading && activityMode === 'type' && <ActivityByType />}
      {!eventsLoading && activityMode === 'voyages' && <ActivityByVoyage />}
    </Fragment>
  )
}

export default VesselActivity
