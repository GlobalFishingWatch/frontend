import type React from 'react'
import cx from 'classnames'

import styles from './Carousel.module.css'

export interface CarouselProps {
  id?: string
  children?: React.ReactNode
  className?: string
  label?: string
}

export function Carousel({ id, children, className, label }: CarouselProps) {
  return (
    <div id={id} className={cx(styles.carousel, className)} role="group" aria-label={label}>
      {children}
    </div>
  )
}
