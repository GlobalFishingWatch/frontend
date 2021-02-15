import React, { useCallback } from 'react'
import cx from 'classnames'
import Tippy from '@tippyjs/react'
import { useSpring, animated } from 'react-spring'
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
  const config = { tension: 200, friction: 15 }
  const initialStyles = { opacity: 0.4, transform: 'scaleY(0) translate(-5px, -5px)' }
  const [props, setSpring] = useSpring(() => initialStyles)
  const onMount = useCallback(() => {
    setSpring({
      opacity: 1,
      transform: 'scaleY(1) translate(-5px, -5px)',
      onRest: function () {
        return
      },
      config,
    })
  }, [])

  const onHide = useCallback(({ unmount }) => {
    setSpring({
      ...initialStyles,
      onRest: unmount,
      config: { ...config, clamp: true },
    })
  }, [])

  return (
    <Tippy
      interactive
      visible={visible}
      animation={true}
      onMount={onMount}
      onHide={onHide}
      placement="bottom-end"
      popperOptions={popperOptions}
      onClickOutside={onClickOutside}
      render={(attrs) => {
        const topPlacement = attrs['data-placement'] === 'top'
        return (
          <animated.div
            style={props}
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
            {visible && (
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
            )}
          </animated.div>
        )
      }}
    >
      <span tabIndex={0}>{children}</span>
    </Tippy>
  )
}

export default ExpandedContainer
