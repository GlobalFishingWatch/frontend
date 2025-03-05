import React, { Fragment, useRef, useState } from 'react'
import type { Placement, UseFloatingOptions } from '@floating-ui/react'
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingFocusManager,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import cx from 'classnames'

import styles from './Popover.module.css'

export type PopoverProps = {
  children: React.ReactNode
  content: React.ReactNode
  placement?: Placement
  ariaLabel?: string
  showArrow?: boolean
  className?: string
  open?: boolean
  initialOpen?: boolean
  strategy?: UseFloatingOptions['strategy']
  onOpenChange?: (open: boolean, event?: MouseEvent, reason?: string) => void
  onClickOutside?: () => void
}

export function Popover({
  children,
  content,
  ariaLabel,
  className = '',
  showArrow = true,
  initialOpen,
  placement,
  strategy = 'fixed',
  open: controlledOpen = false,
  onOpenChange: setControlledOpen,
  onClickOutside,
}: PopoverProps) {
  const arrowRef = useRef<SVGSVGElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const isOpen = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (nextOpen, event, reason) => {
      setOpen(nextOpen)
      if (reason === 'escape-key' || reason === 'outside-press') {
        onClickOutside?.()
      }
    },
    placement,
    strategy,
    middleware: [
      offset(10),
      flip({
        fallbackStrategy: 'initialPlacement',
      }),
      shift(),
      arrow({
        element: arrowRef,
        padding: 0,
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

  return (
    <Fragment>
      {React.isValidElement(children) &&
        React.cloneElement(children, getReferenceProps({ ref: refs.setReference }))}
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={cx(styles.contentContainer, className)}
            ref={refs.setFloating}
            style={floatingStyles}
            {...(ariaLabel && {
              'aria-label': ariaLabel,
            })}
            {...getFloatingProps()}
          >
            {showArrow && <FloatingArrow fill="white" ref={arrowRef} context={context} />}
            {React.isValidElement(content) && content}
          </div>
        </FloatingFocusManager>
      )}
    </Fragment>
  )
}
