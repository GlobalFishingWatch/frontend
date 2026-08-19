import type React from 'react'
import cx from 'classnames'

import styles from './Carousel.module.css'

export interface CarouselProps {
  id?: string
  children?: React.ReactNode
  className?: string
  label?: string
  /** Overrides the width-driven step count. Fractional values are intended, e.g. 4.5. */
  itemsPerView?: number
  itemMinWidth?: string
  style?: React.CSSProperties
}

export function Carousel({
  id,
  children,
  className,
  label,
  itemsPerView,
  itemMinWidth,
  style,
}: CarouselProps) {
  const itemsStyle = {
    // Only set when overridden: unset lets the CSS container queries pick the step from the
    // carousel's own width. Fractional is the point — the .5 leaves a card half cut as a hint.
    ...(itemsPerView ? { '--carousel-items-per-view': Math.max(1, itemsPerView) } : {}),
    ...(itemMinWidth ? { '--carousel-item-min-width': itemMinWidth } : {}),
    ...style,
  } as React.CSSProperties

  return (
    <div
      id={id}
      className={cx(styles.carousel, className)}
      style={itemsStyle}
      role="group"
      aria-label={label}
    >
      {children}
    </div>
  )
}
