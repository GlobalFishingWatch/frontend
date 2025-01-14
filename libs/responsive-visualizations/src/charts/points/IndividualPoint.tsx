import {
  useFloating,
  offset,
  flip,
  shift,
  useInteractions,
  useHover,
  FloatingPortal,
} from '@floating-ui/react'
import { cloneElement, useState, type ReactElement } from 'react'
import cx from 'classnames'
import type { ResponsiveVisualizationItem } from '../../types'
import { DEFAULT_POINT_SIZE } from '../config'
import styles from './IndividualPoint.module.css'

type IndividualPointProps = {
  color?: string
  point: ResponsiveVisualizationItem
  tooltip?: ReactElement
  className?: string
  icon?: ReactElement
  pointSize?: number
}

export function IndividualPoint({
  point,
  color,
  tooltip,
  className,
  icon,
  pointSize = DEFAULT_POINT_SIZE,
}: IndividualPointProps) {
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
      className={cx(styles.point, { [styles.withIcon]: icon })}
      style={{
        width: pointSize,
        height: pointSize,
        ...(color &&
          !icon && {
            backgroundColor: color,
          }),
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
            {tooltip
              ? cloneElement(tooltip, { ...(tooltip.props || {}), data: point } as any)
              : point.name}
          </div>
        </FloatingPortal>
      )}
      {icon && <span className={styles.icon}>{icon}</span>}
    </li>
  )
}
