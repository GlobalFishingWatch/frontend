import React from 'react'
import cx from 'classnames'
import Tippy from '@tippyjs/react'
import styles from './TooltipContainer.module.css'

interface TooltipContainerProps {
  visible: boolean
  children: React.ReactElement
  component: React.ReactElement | null
  className?: string
  onClickOutside?: () => void
}

export function TooltipListContainer({
  children,
}: {
  children: React.ReactElement | React.ReactElement[] | undefined | null
}) {
  return <ul className={styles.listContainer}>{children}</ul>
}

const onClickOutSideFallback = () => {}

function TooltipContainer({
  visible,
  children,
  component,
  className = '',
  onClickOutside = onClickOutSideFallback,
}: TooltipContainerProps) {
  return (
    <Tippy
      interactive
      visible={visible}
      placement="right"
      onClickOutside={onClickOutside}
      render={(attrs) => {
        if (!visible) return null
        return (
          <div className={cx(styles.tooltipContent, className)} tabIndex={-1} {...attrs}>
            {component}
            <div className={styles.tooltipArrow} data-popper-arrow></div>
          </div>
        )
      }}
    >
      {children}
    </Tippy>
  )
}

export default TooltipContainer
