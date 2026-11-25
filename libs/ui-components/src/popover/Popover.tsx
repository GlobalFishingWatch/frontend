import React, { Fragment, useRef, useState } from 'react'
import type { Placement, UseFloatingOptions } from '@floating-ui/react'
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
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
  portal?: boolean
  onOpenChange?: (open: boolean, event?: MouseEvent, reason?: string) => void
  onClickOutside?: () => void
}

// tabbable >= 6.4 (used by FloatingFocusManager) matches `:not([inert] *)`.
// Browsers without complex selectors inside :not() (Chrome < 88, e.g. Tizen TVs) throw a SyntaxError,
// so they get the popover without focus management instead of a crash.
const SUPPORTS_COMPLEX_NOT_SELECTOR = (() => {
  if (typeof document === 'undefined') {
    return true
  }
  try {
    document.querySelector(':not(a b)')
    return true
  } catch {
    return false
  }
})()

function OptionalPortal({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  return enabled ? <FloatingPortal>{children}</FloatingPortal> : <Fragment>{children}</Fragment>
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
  portal = false,
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
      setOpen(nextOpen, event as MouseEvent | undefined, reason)
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
        padding: { left: 60 },
      }),
      shift({ padding: { left: 60 } }),
      arrow({
        // eslint-disable-next-line react-hooks/refs
        element: arrowRef.current,
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
        <OptionalPortal enabled={portal}>
          <FloatingFocusManager
            context={context}
            modal={false}
            disabled={!SUPPORTS_COMPLEX_NOT_SELECTOR}
          >
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
        </OptionalPortal>
      )}
    </Fragment>
  )
}
