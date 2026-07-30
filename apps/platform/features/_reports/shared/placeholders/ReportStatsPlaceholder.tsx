import cx from 'classnames'

import styles from './placeholders.module.css'

export default function ReportStatsPlaceholder() {
  return (
    <div className={cx(styles.paragraph, styles.stats)}>
      <div className={styles.sentence}>
        <div style={{ width: '20rem' }} className={cx(styles.block, styles.animate, styles.M)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.M)} />
        <div style={{ width: '20rem' }} className={cx(styles.block, styles.animate, styles.M)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.M)} />
        <div style={{ width: '10rem' }} className={cx(styles.block, styles.animate, styles.M)} />
        <div style={{ width: '15rem' }} className={cx(styles.block, styles.animate, styles.M)} />
      </div>
      <div className={styles.sentence}>
        <div style={{ width: '10rem' }} className={cx(styles.block, styles.animate, styles.M)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.M)} />
      </div>
    </div>
  )
}
