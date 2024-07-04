import cx from 'classnames'
import Tippy from '@tippyjs/react'
import type { Placement } from 'tippy.js'
import styles from './TooltipContainer.module.css'

interface TooltipContainerProps {
  visible: boolean
  children: React.ReactElement
  component: React.ReactElement | null
  className?: string
  arrowClass?: string
  placement?: Placement
  onClickOutside?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const onClickOutSideFallback = () => {}

function TooltipContainer({
  visible,
  children,
  component,
  className = '',
  arrowClass = '',
  placement,
  onClickOutside = onClickOutSideFallback,
}: TooltipContainerProps) {
  return (
    <Tippy
      interactive
      visible={visible}
      placement={placement || 'auto'}
      onClickOutside={onClickOutside}
      render={(attrs) => {
        if (!visible) return null
        return (
          <div className={cx(styles.tooltipContent, className)} tabIndex={-1} {...attrs}>
            {component}
            <div className={cx(styles.tooltipArrow, arrowClass)} data-popper-arrow></div>
          </div>
        )
      }}
    >
      {children}
    </Tippy>
  )
}

export default TooltipContainer
