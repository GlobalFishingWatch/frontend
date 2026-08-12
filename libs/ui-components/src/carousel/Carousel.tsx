import type React from 'react'
import cx from 'classnames'

import styles from './Carousel.module.css'

export interface CarouselProps {
  id?: string
  children?: React.ReactNode
  className?: string
  label?: string
  itemsPerView?: number
  itemMinWidth?: string
  style?: React.CSSProperties
}

export function Carousel({
  id,
  children,
  className,
  label,
  itemsPerView = 4,
  itemMinWidth,
  style,
}: CarouselProps) {
  const itemsStyle = {
    '--carousel-items-per-view': Math.max(1, Math.round(itemsPerView)),
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
