import type React from 'react'
import cx from 'classnames'

import styles from '../timebar.module.css'

/**
 * Column wrapper that stacks toolbar buttons (TimeRangeSelector, Bookmark) the way the
 * legacy `.timeActions` div did. `position: relative` here anchors the TimeRangeSelector
 * modal. Put any toolbar buttons you want stacked inside it.
 */
export function TimebarControls({ children }: { children?: React.ReactNode }) {
  return <div className={cx('print-hidden', styles.timeActions)}>{children}</div>
}
