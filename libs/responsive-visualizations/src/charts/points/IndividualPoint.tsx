import { useFloating, offset, flip, shift, useInteractions, useHover, FloatingPortal } from '@floating-ui/react'
import { cloneElement, useState, type ReactElement } from 'react'
import cx from 'classnames'
import type { ResponsiveVisualizationItem } from '../../types'
import { POINT_SIZE } from '../config'
import styles from './IndividualPoint.module.css'

type IndividualPointProps = {
  color?: string
  point: ResponsiveVisualizationItem
  tooltip?: ReactElement
  className?: string
}

export function IndividualPoint({ point, color, tooltip, className }: IndividualPointProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: 'top',
    onOpenChange: setIsOpen,
    middleware: [offset(2), flip(), shift()],
  })

  const hover = useHover(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([hover])

  return (
    <li
      ref={refs.setReference}
      {...getReferenceProps()}
      className={styles.point}
      style={{
        width: POINT_SIZE,
        height: POINT_SIZE,
        ...color && {
          backgroundColor: color,
        }
      }}
    >
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className={cx(styles.tooltip, className)}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {tooltip ? cloneElement(tooltip, { data: point } as any) : point.name}
          </div>
        </FloatingPortal>
      )}
    </li>
  )
}
