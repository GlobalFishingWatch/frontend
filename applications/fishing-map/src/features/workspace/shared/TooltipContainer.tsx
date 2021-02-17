import React from 'react'
import Tippy from '@tippyjs/react'
import styles from './TooltipContainer.module.css'

interface TooltipContainerProps {
  visible: boolean
  children: React.ReactElement
  component: React.ReactElement
  onClickOutside: () => void
}

function TooltipContainer({ visible, children, component, onClickOutside }: TooltipContainerProps) {
  return (
    <Tippy
      interactive
      visible={visible}
      placement="right"
      onClickOutside={onClickOutside}
      render={(attrs) => {
        if (!visible) return null
        return (
          <div className={styles.tooltipContent} tabIndex={-1} {...attrs}>
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
