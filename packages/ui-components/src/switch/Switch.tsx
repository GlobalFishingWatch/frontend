import React from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Tooltip from '../tooltip'
import styles from './Switch.module.css'

interface SwitchProps {
  active: boolean
  disabled?: boolean
  onClickFn: (event: React.MouseEvent<HTMLButtonElement>) => void
  color?: string
  tooltip?: React.ReactChild | React.ReactChild[] | string
  tooltipPlacement?: Placement
  className?: string
}

const Switch: React.FC<SwitchProps> = (props) => {
  const {
    active = false,
    disabled = false,
    color,
    onClickFn,
    tooltip,
    tooltipPlacement = 'auto',
    className,
  } = props
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        type="button"
        role="switch"
        aria-checked={active}
        disabled={disabled}
        data-color={color}
        onClick={onClickFn}
        className={cx(styles.Switch, { [styles.customColor]: color }, className)}
        {...(color && { style: { color } })}
      >
        <span className={styles.nib}></span>
      </button>
    </Tooltip>
  )
}

export default Switch
