import { Fragment, useEffect, useRef, useState } from 'react'
import type { Middleware } from '@floating-ui/react'
import {
  arrow,
  detectOverflow,
  FloatingArrow,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react'
import cx from 'classnames'

import { SCROLL_CONTAINER_DOM_ID } from 'features/sidebar/sidebar.utils'

import styles from './ExpandedContainer.module.css'

interface ExpandedContainerProps {
  visible: boolean
  children: React.ReactElement<any>
  component: React.ReactElement<any>
  className?: string
  arrowClassName?: string
  referenceClassName?: string
  onClickOutside: () => void
  overflowDOMId?: string | null
}

function ExpandedContainer({
  visible,
  children,
  component,
  onClickOutside,
  className = '',
  referenceClassName = '',
  overflowDOMId = SCROLL_CONTAINER_DOM_ID,
}: ExpandedContainerProps) {
  const [isOpen, setIsOpen] = useState(visible)
  const arrowRef = useRef(null)

  const overflowMiddlware: Middleware = {
    name: 'overflow',
    async fn(state) {
      if (!state || !overflowDOMId) {
        return {}
      }
      const overflow = await detectOverflow(state, {
        boundary: document.getElementById(overflowDOMId)!,
      })
      Object.entries(overflow).forEach(([key, value]) => {
        if (value > 0 && (key === 'left' || key === 'right')) {
          // const property = key === 'top' || key === 'bottom' ? 'y' : 'x'
          const property = 'x'
          state[property] = key === 'right' ? state[property] - value : state[property] + value
        }
      })
      if (overflow.bottom > 0 && state.elements.floating) {
        state.elements.floating.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }
      return state
    },
  }
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (nextOpen, event, reason) => {
      setIsOpen(nextOpen)
      if (reason === 'escape-key' || reason === 'outside-press') {
        onClickOutside?.()
      }
    },
    middleware: [
      offset(5),
      ...(overflowDOMId ? [overflowMiddlware] : []),
      arrow({
        element: arrowRef,
      }),
    ],
  })

  useEffect(() => {
    if (visible !== isOpen) {
      setIsOpen(visible)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  return (
    <Fragment>
      <div ref={refs.setReference} {...getReferenceProps()} className={referenceClassName}>
        {children}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className={cx(styles.expandedContainer, className)}
        >
          {component}
          <FloatingArrow
            stroke="rgba(22, 63, 137, .15)" //--var-border
            strokeWidth={0.75}
            className={styles.tooltipArrow}
            ref={arrowRef}
            context={context}
          />
        </div>
      )}
    </Fragment>
  )
}

export default ExpandedContainer
