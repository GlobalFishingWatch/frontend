import type { MouseEventHandler, ReactNode } from 'react'
import cx from 'classnames'

import styles from '../timebar.module.css'

export function TimebarToolWrapper({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      className={cx('print-hidden', styles.uiButton, { [styles.noAction]: onClick === undefined })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
