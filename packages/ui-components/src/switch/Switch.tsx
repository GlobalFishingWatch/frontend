import React from 'react'
import cx from 'classnames'
import styles from './Switch.module.css'

interface SwitchProps {
  active: boolean
  disabled?: boolean
  onClickFn: (event: React.MouseEvent<HTMLButtonElement>) => void
  color?: string
  className?: string
}

const Switch: React.FC<SwitchProps> = (props) => {
  const { active = false, disabled = false, color, onClickFn, className } = props
  return (
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
  )
}

export default Switch
