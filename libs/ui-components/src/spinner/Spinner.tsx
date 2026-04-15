import React from 'react'
import cx from 'classnames'

import styles from './Spinner.module.css'

interface SpinnerProps {
  color?: string
  size?: 'default' | 'small' | 'tiny'
  className?: string
  inline?: boolean
}

const DEFAULT_SPINNER_COLOR = 'var(--color-primary-blue, rgb(22, 63, 137))'

export function Spinner(props: SpinnerProps) {
  const {
    color = DEFAULT_SPINNER_COLOR,
    size = 'default',
    className = '',
    inline = false,
  } = props
  const radius = size === 'default' ? 20 : 8
  const SvgComponent = (
    <svg
      className={cx(styles.spinner, inline ? className : '')}
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
    >
      <g className={styles.circleContainer}>
        <circle
          className={cx(styles.circle, styles[size])}
          style={{ stroke: color }}
          cx={radius}
          cy={radius}
          r={radius}
        ></circle>
      </g>
    </svg>
  )
  return inline ? (
    SvgComponent
  ) : (
    <div className={cx(styles.centered, className)}>{SvgComponent}</div>
  )
}
