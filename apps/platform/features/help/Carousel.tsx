import type { ReactNode } from 'react'
import cx from 'classnames'

import styles from './Carousel.module.css'

type CarouselProps = {
  id: string
  children?: ReactNode
  className?: string
}

// TODO placeholder Carousel
function Carousel({ id, children, className }: CarouselProps) {
  return (
    <div id={id} className={cx(styles.carousel, className)}>
      {children}
    </div>
  )
}

export default Carousel
