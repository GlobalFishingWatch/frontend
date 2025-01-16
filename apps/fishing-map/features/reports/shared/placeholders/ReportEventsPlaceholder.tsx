import { Fragment } from 'react'
import cx from 'classnames'

import ReportActivityPlaceholder from 'features/reports/shared/placeholders/ReportActivityPlaceholder'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'

import styles from './placeholders.module.css'

export default function ReportEventsPlaceholder() {
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.paragraph}>
          <div className={styles.sentence}>
            <div
              style={{ width: '5rem' }}
              className={cx(styles.block, styles.animate, styles.large)}
            />
            <div
              style={{ width: '10rem' }}
              className={cx(styles.block, styles.animate, styles.large)}
            />
            <div
              style={{ width: '15rem' }}
              className={cx(styles.block, styles.animate, styles.large)}
            />
            <div
              style={{ width: '5rem' }}
              className={cx(styles.block, styles.animate, styles.large)}
            />
            <div
              style={{ width: '5rem' }}
              className={cx(styles.block, styles.animate, styles.large)}
            />
            <div
              style={{ width: '10rem' }}
              className={cx(styles.block, styles.animate, styles.large)}
            />
          </div>
          <div className={styles.sentence}>
            <div
              style={{ width: '5rem' }}
              className={cx(styles.block, styles.animate, styles.large)}
            />
            <div
              style={{ width: '10rem' }}
              className={cx(styles.block, styles.animate, styles.large)}
            />
            <div
              style={{ width: '5rem' }}
              className={cx(styles.block, styles.animate, styles.large)}
            />
            <div
              style={{ width: '10rem' }}
              className={cx(styles.block, styles.animate, styles.large)}
            />
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <ReportActivityPlaceholder showHeader={false} />
      </div>
      <ReportVesselsPlaceholder />
    </Fragment>
  )
}
