import type { PropsWithChildren, PropsWithoutRef } from 'react'
import { Children, cloneElement, Fragment, isValidElement, useState } from 'react'
import type { Placement } from '@floating-ui/react'
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react'
import cx from 'classnames'

import styles from './Tooltip.module.css'

export type TooltipPlacement = Placement

type TooltipProps = {
  content: React.ReactNode
  children: React.ReactNode
  className?: string
  placement?: TooltipPlacement
}

const DELAY = 500
const DURATION = 100

function TooltipComponent({ content, children, className, placement = 'top' }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement,
    onOpenChange: setIsOpen,
    middleware: [offset(1), flip(), shift()],
    whileElementsMounted: autoUpdate,
  })
  const hover = useHover(context, { restMs: DELAY })
  const { getReferenceProps, getFloatingProps } = useInteractions([hover])
  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: {
      open: DURATION,
      close: 100,
    },
  })

  return (
    <Fragment>
      {typeof children === 'string' ? (
        <span
          role="button"
          tabIndex={0}
          ref={refs.setReference}
          onClick={() => setIsOpen(false)}
          {...getReferenceProps()}
        >
          {children}
        </span>
      ) : (
        Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(
              child,
              {
                onClick: (e: MouseEvent) => {
                  setIsOpen(false)
                  ;(child.props as PropsWithoutRef<any>).onClick?.(e)
                },
                ref: refs.setReference,
                ...getReferenceProps(),
              } as PropsWithChildren,
              (child.props as PropsWithChildren).children
            )
          }
        })
      )}
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className={cx(styles.tooltip, className)}
            style={{ ...floatingStyles, ...transitionStyles }}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </Fragment>
  )
}

export function Tooltip({ content, children, className, placement }: TooltipProps) {
  if (!content) return <Fragment>{children}</Fragment>
  return (
    <TooltipComponent
      content={content}
      children={children}
      className={className}
      placement={placement}
    />
  )
}
