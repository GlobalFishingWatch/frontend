import cx from 'classnames'
import { Fragment } from 'react'
import styles from './placeholders.module.css'

export default function ReportTitlePlaceholder() {
  return (
    <Fragment>
      <div className={styles.paragraph}>
        <div className={styles.sentence}>
          <div
            style={{ width: '3rem' }}
            className={cx(styles.block, styles.animate, styles.large)}
          />
          <div
            style={{ width: '5rem' }}
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
        </div>
      </div>
      <div className={cx(styles.paragraph, styles.paragraphS)}>
        <div className={styles.sentence}>
          <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.S)} />
          <div style={{ width: '20rem' }} className={cx(styles.block, styles.animate, styles.S)} />
          <div style={{ width: '15rem' }} className={cx(styles.block, styles.animate, styles.S)} />
          <div style={{ width: '20rem' }} className={cx(styles.block, styles.animate, styles.S)} />
        </div>
        <div className={styles.sentence}>
          <div style={{ width: '12rem' }} className={cx(styles.block, styles.animate, styles.S)} />
          <div style={{ width: '6rem' }} className={cx(styles.block, styles.animate, styles.S)} />
        </div>
      </div>
    </Fragment>
  )
}
