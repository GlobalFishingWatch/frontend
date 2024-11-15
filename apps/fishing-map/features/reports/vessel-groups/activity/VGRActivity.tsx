import { Fragment } from 'react'
import ReportActivity from 'features/reports/shared/activity/ReportActivity'
import VGRActivitySubsectionSelector from 'features/reports/vessel-groups/activity/VGRActivitySubsectionSelector.tsx'
import styles from 'features/reports/vessel-groups/activity/VGRActivity.module.css'

function VGRActivity() {
  return (
    <Fragment>
      <div className={styles.container}>
        <VGRActivitySubsectionSelector />
      </div>
      <ReportActivity />
    </Fragment>
  )
}

export default VGRActivity
