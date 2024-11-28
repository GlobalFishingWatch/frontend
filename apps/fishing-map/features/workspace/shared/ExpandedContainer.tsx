import { useCallback } from 'react'
import cx from 'classnames'
import Tippy from '@tippyjs/react'
import type { Options } from '@popperjs/core'
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

function ExpandedContainer({
  visible,
  children,
  component,
  onClickOutside,
  className = '',
  arrowClassName = '',
}: ExpandedContainerProps) {
  const onMount = useCallback(({ popper }: any) => {
    const { y, height } = popper.getBoundingClientRect()
    if (y + height >= window.innerHeight) {
      popper.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }
  }, [])

  return (
    <div>
      <Tippy
        interactive
        visible={visible}
        animation={true}
        onMount={onMount}
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
            </div>
          )
        }}
      >
        <span tabIndex={0}>{children}</span>
      </Tippy>
    </div>
  )
}

export default ExpandedContainer
