import { Fragment } from 'react'
import cx from 'classnames'

import styles from './placeholders.module.css'

export default function VGRTitlePlaceholder() {
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
      </div>
    </Fragment>
  )
}
