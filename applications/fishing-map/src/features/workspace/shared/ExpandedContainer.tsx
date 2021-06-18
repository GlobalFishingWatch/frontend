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
      // To avoid the default 5px margin popper leaves between popper and reference
      // https://popper.js.org/docs/v2/modifiers/prevent-overflow/#padding
      name: 'preventOverflow',
      options: {
        padding: 0,
      },
    },
    {
      name: 'flip',
      enabled: false,
    },
  ],
}

const config = { tension: 300, friction: 50, velocity: 40 }
const initialStyles = { transform: 'translate(0, -20px)' }

function ExpandedContainer({
  visible,
  children,
  component,
  onClickOutside,
  className = '',
  arrowClassName = '',
}: ExpandedContainerProps) {
  const [props, setSpring] = useSpring(() => initialStyles)

  const onMount = useCallback(
    ({ popper }) => {
      const { y, height } = popper.getBoundingClientRect()
      if (y + height >= window.innerHeight) {
        popper.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
      }
      setSpring({
        transform: 'translateY(0, -5px)',
        onRest: function () {
          return
        },
        config,
      })
    },
    [setSpring]
  )

  const onHide = useCallback(
    ({ unmount }) => {
      setSpring({
        ...initialStyles,
        onRest: unmount,
        config: { ...config, clamp: true },
      })
    },
    [setSpring]
  )

  return (
    <div>
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
    </div>
  )
}

export default ExpandedContainer
