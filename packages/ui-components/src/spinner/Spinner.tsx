import React from 'react'
import cx from 'classnames'
import styles from './Spinner.module.css'

interface SpinnerProps {
  color?: string
  size?: 'default' | 'small'
}

const spinnerVarColor = getComputedStyle(document.documentElement).getPropertyValue(
  '--color-primary-blue'
)

const Spinner: React.FC<SpinnerProps> = (props) => {
  const { color = spinnerVarColor || '#22447e', size = 'default' } = props
  const radius = size === 'default' ? 20 : 8
  return (
    <svg
      className={styles.spinner}
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
}

export default Spinner
