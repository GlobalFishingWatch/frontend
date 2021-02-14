import React from 'react'
import cx from 'classnames'
import Tippy from '@tippyjs/react'
import { Options } from '@popperjs/core'
import styles from './ExpandedContainer.module.css'

interface ExpandedContainerProps {
  visible: boolean
  children: React.ReactElement
  component: React.ReactElement
  className?: string
  arrowClassName?: string
  onClickOutside: () => void
}

const popperOptions: Partial<Options> = {
  modifiers: [
    {
      name: 'flip',
      enabled: false,
    },
    {
      name: 'sameWidth',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: ({ state }) => {
        // state.styles.popper.width = `${state.rects.reference.width}px`
        state.styles.popper.left = '0px'
      },
      effect: ({ state }) => {
        state.elements.popper.style.left = '0px'
        // state.elements.popper.style.width = `${
        //   state.elements.reference.getBoundingClientRect().width
        // }px`
      },
    },
  ],
}

function ExpandedContainer({
  visible,
  children,
  component,
  onClickOutside,
  className = '',
  arrowClassName = '',
}: ExpandedContainerProps) {
  return (
    <Tippy
      interactive
      // appendTo="parent"
      visible={visible}
      placement="bottom-end"
      popperOptions={popperOptions}
      onClickOutside={onClickOutside}
      render={(attrs) => {
        const topPlacement = attrs['data-placement'] === 'top'
        return (
          <div
            className={cx(
              styles.expandedContainer,
              {
                [styles.expandedContainerOpen]: visible,
                [styles.expandedContainerTop]: topPlacement,
              },
              className
            )}
            tabIndex={-1}
            {...attrs}
          >
            {visible && component}
            <div
              className={cx(
                styles.tooltipArrow,
                {
                  [styles.tooltipArrowTop]: topPlacement,
                },
                arrowClassName
              )}
              data-popper-arrow
            ></div>
          </div>
        )
      }}
    >
      {children}
    </Tippy>
  )
}

export default ExpandedContainer
