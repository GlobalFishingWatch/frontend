import cx from 'classnames'

import styles from './placeholders.module.css'

export default function ReportTitlePlaceholder() {
  return (
    <div className={styles.sentence}>
      <div style={{ width: '20rem' }} className={cx(styles.block, styles.animate, styles.large)} />
      <div style={{ width: '15rem' }} className={cx(styles.block, styles.animate, styles.large)} />
    </div>
  )
}
