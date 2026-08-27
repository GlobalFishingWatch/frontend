import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import styles from './Carousel.module.css'

/** Pointer travel before a press turns into a drag, so clicks on items keep working. */
const DRAG_THRESHOLD_PX = 5
/** Fractional scroll offsets never land exactly on the maximum, so allow a pixel of slack. */
const SCROLL_END_TOLERANCE_PX = 1

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
  const scrollerRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<{ x: number; scrollLeft: number } | null>(null)
  const draggedRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [hasContentAfter, setHasContentAfter] = useState(false)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    // Covers both "does not overflow at all" and "scrolled to the end" in one comparison.
    const update = () =>
      setHasContentAfter(el.scrollWidth - el.clientWidth - el.scrollLeft > SCROLL_END_TOLERANCE_PX)

    // The items are observed as well as the scroller: cards settle at their final size once
    // their images load, which changes scrollWidth without resizing the scroller itself.
    const observer = new ResizeObserver(update)
    observer.observe(el)
    Array.from(el.children).forEach((child) => observer.observe(child))
    el.addEventListener('scroll', update, { passive: true })
    update()

    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', update)
    }
  }, [children])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    startRef.current = { x: e.clientX, scrollLeft: scrollerRef.current?.scrollLeft ?? 0 }
    draggedRef.current = false
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const start = startRef.current
    const el = scrollerRef.current
    if (!start || !el) return
    const deltaX = e.clientX - start.x
    if (!draggedRef.current) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return
      draggedRef.current = true
      setIsDragging(true)
      el.setPointerCapture(e.pointerId)
    }
    el.scrollLeft = start.scrollLeft - deltaX
  }

  const onPointerEnd = () => {
    startRef.current = null
    setIsDragging(false)
  }

  const itemsStyle = {
    // Only set when overridden: unset lets the CSS container queries pick the step from the
    // carousel's own width. Fractional is the point — the .5 leaves a card half cut as a hint.
    ...(itemsPerView ? { '--carousel-items-per-view': Math.max(1, itemsPerView) } : {}),
    ...(itemMinWidth ? { '--carousel-item-min-width': itemMinWidth } : {}),
    ...style,
  } as React.CSSProperties

  return (
    // `className` lands here rather than on the scroller so that a consumer bleeding the
    // carousel past its column widens this box too — the fade is positioned against it.
    <div className={cx(styles.root, className)}>
      <div
        id={id}
        ref={scrollerRef}
        className={cx(styles.carousel, { [styles.dragging]: isDragging })}
        style={itemsStyle}
        role="group"
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={(e) => {
          // The drag ended on an item; without this the browser would follow its link.
          if (!draggedRef.current) return
          draggedRef.current = false
          e.preventDefault()
          e.stopPropagation()
        }}
        // Links and images start a native HTML drag that would cancel the scroll gesture.
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cx(styles.fade, { [styles.fadeVisible]: hasContentAfter })}
      />
    </div>
  )
}
