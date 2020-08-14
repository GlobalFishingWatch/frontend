import React from 'react'
import cx from 'classnames'
import styles from './Spinner.module.css'

type SpinnerColor = string
type SpinnerSize = 'default' | 'small'

interface SpinnerProps {
  color?: SpinnerColor
  size?: SpinnerSize
}

const Spinner: React.FC<SpinnerProps> = (props) => {
  const {
    color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-blue'),
    size = 'default',
  } = props
  const radius = size === 'default' ? 20 : 10
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
