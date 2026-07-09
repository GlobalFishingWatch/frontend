import type React from 'react'
import cx from 'classnames'

import styles from '../timebar.module.css'

export function TimebarToolbarWrapper({ children }: { children?: React.ReactNode }) {
  return <div className={cx('print-hidden', styles.timeActions)}>{children}</div>
}
