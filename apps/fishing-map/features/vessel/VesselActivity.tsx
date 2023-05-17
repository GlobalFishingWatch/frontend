import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import { Button } from '@globalfishingwatch/ui-components'
import { VesselActivitySummary } from 'features/vessel/VesselActivitySummary'
import { VesselActivityList } from 'features/vessel/VesselActivityList'
import styles from './VesselActivity.module.css'

const VesselActivity = () => {
  const { t } = useTranslation()
  return (
    <Fragment>
      <div className={styles.summaryContainer}>
        <label>{t('common.summary', 'Summary')}</label>
        <VesselActivitySummary />
      </div>
      <div className={styles.activityTitleContainer}>
        <label>{t('vessel.activityByVoyages', 'Timeline by voyages')}</label>
        <Button className={styles.actionButton}>
          {t('vessel.activityGroupByType', 'Group by type')}
        </Button>
      </div>
      <VesselActivityList />
    </Fragment>
  )
}

export default VesselActivity
