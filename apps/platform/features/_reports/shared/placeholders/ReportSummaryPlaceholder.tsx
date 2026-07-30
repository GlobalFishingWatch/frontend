import cx from 'classnames'

import styles from './placeholders.module.css'

export default function ReportSummaryPlaceholder() {
  return (
    <div className={styles.paragraph}>
      <div className={styles.sentence}>
        <div style={{ width: '10rem' }} className={cx(styles.block, styles.animate, styles.L)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.L)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.L)} />
        <div style={{ width: '10rem' }} className={cx(styles.block, styles.animate, styles.L)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.L)} />
        <div style={{ width: '20rem' }} className={cx(styles.block, styles.animate, styles.L)} />
        <div style={{ width: '15rem' }} className={cx(styles.block, styles.animate, styles.L)} />
      </div>
      <div className={styles.sentence}>
        <div style={{ width: '10rem' }} className={cx(styles.block, styles.animate, styles.L)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.L)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.L)} />
        <div style={{ width: '10rem' }} className={cx(styles.block, styles.animate, styles.L)} />
      </div>
    </div>
  )
}
