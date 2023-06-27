import { useTranslation } from 'react-i18next'
import { Fragment, useState } from 'react'
import { Button } from '@globalfishingwatch/ui-components'
import { ActivityByType } from 'features/vessel/activity/activity-by-type/activity-by-type'
import ActivityByVoyage from 'features/vessel/activity/activity-by-voyage/activity-by-voyage'
import styles from './VesselActivity.module.css'
import { VesselActivitySummary } from './summary/VesselActivitySummary'

type activityModeType = 'voyages' | 'type'

const VesselActivity = () => {
  const { t } = useTranslation()
  const [activityMode, setActivityMode] = useState<activityModeType>('type')

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
      {activityMode === 'type' && <ActivityByType onMoveToMap={function (): void {}} />}
      {activityMode === 'voyages' && <ActivityByVoyage onMoveToMap={function (): void {}} />}
    </Fragment>
  )
}

export default VesselActivity
