import { useFloating, offset, flip, shift, useInteractions, useHover } from '@floating-ui/react'
import { cloneElement, useState, type ReactElement } from 'react'
import cx from 'classnames'
import type { ResponsiveVisualizationItem } from '../../types'
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
      style={color ? { backgroundColor: color } : {}}
    >
      {isOpen && (
        <div
          ref={refs.setFloating}
          className={cx(styles.tooltip, className)}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {tooltip ? cloneElement(tooltip, { data: point } as any) : point.name}
        </div>
      )}
    </li>
  )
}
