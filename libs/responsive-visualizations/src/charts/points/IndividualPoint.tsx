import {
  useFloating,
  offset,
  flip,
  shift,
  useInteractions,
  useHover,
  FloatingPortal,
} from '@floating-ui/react'
import { cloneElement, useCallback, useState, type ReactElement } from 'react'
import cx from 'classnames'
import type { ResponsiveVisualizationInteractionCallback } from '@globalfishingwatch/responsive-visualizations'
import type { ResponsiveVisualizationItem } from '../../types'
import { DEFAULT_POINT_SIZE } from '../config'
import styles from './IndividualPoint.module.css'

type IndividualPointProps = {
  color?: string
  point: ResponsiveVisualizationItem
  tooltip?: ReactElement
  item?: ReactElement
  className?: string
  icon?: ReactElement
  pointSize?: number
  onClick?: ResponsiveVisualizationInteractionCallback
}

export function IndividualPoint({
  point,
  color,
  tooltip,
  item,
  className,
  icon,
  onClick,
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

  const handleOnCLick = useCallback(() => {
    onClick?.(point)
  }, [onClick, point])

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
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      role="button"
      onClick={onClick ? handleOnCLick : undefined}
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
      {item && cloneElement(item, { ...(item.props || {}), data: point } as any)}
      {icon && <span>{icon}</span>}
    </li>
  )
}
