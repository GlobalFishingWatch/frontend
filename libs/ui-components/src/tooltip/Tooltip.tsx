import type { Placement } from '@floating-ui/react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useInteractions,
  useHover,
  useTransitionStyles,
  FloatingPortal,
} from '@floating-ui/react'
import cx from 'classnames'
import { cloneElement, Children, isValidElement, Fragment, useState } from 'react'
import styles from './Tooltip.module.css'

export type TooltipPlacement = Placement

type TooltipProps = {
  content: React.ReactNode
  children: React.ReactNode
  className?: string
  initialPlacement?: TooltipPlacement
}

const DELAY = 500
const DURATION = 100

function TooltipComponent({
  content,
  children,
  className,
  initialPlacement = 'top',
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: initialPlacement,
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
                onClick: () => {
                  setIsOpen(false)
                  ;(child.props as any).onClick?.()
                },
                ref: refs.setReference,
                ...getReferenceProps(),
              } as any,
              (child.props as any).children
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

export function Tooltip({ content, children, className }: TooltipProps) {
  if (!content) return <Fragment>{children}</Fragment>
  return <TooltipComponent content={content} children={children} className={className} />
}
