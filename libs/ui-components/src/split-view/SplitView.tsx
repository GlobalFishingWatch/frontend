import React, { useCallback, useEffect, useMemo,useState } from 'react'
import cx from 'classnames'

import { Choice } from '../choice'
import { Icon } from '../icon'

import useSmallScreen from './use-small-screen'

import styles from './SplitView.module.css'

export const MAIN_DOM_ID = 'app-main'
export const SIDEBAR_DOM_ID = 'app-sidebar'

interface SplitViewProps {
  isOpen?: boolean
  showToggle?: boolean
  onToggle?: (e: React.MouseEvent) => void
  asideWidth?: string
  aside: React.ReactNode
  main: React.ReactNode
  showAsideLabel?: string
  showMainLabel?: string
  className?: string
  asideClassName?: string
  mainClassName?: string
}

export function SplitView(props: SplitViewProps) {
  const {
    isOpen = true,
    showToggle = true,
    onToggle,
    aside = null,
    main = null,
    asideWidth = '32rem',
    showAsideLabel = 'Show aside',
    showMainLabel = 'Show main',
    className,
    asideClassName,
    mainClassName,
  } = props
  const panelOptions = useMemo(
    () => [
      {
        id: 'aside',
        label: showAsideLabel,
      },
      {
        id: 'main',
        label: showMainLabel,
      },
    ],
    [showAsideLabel, showMainLabel]
  )
  const [internalOpen, setInternalOpen] = useState<boolean>(isOpen)
  const isSmallScreen = useSmallScreen()

  const handleClick = useCallback(
    (e: any) => {
      setInternalOpen(!internalOpen)
      if (onToggle) {
        onToggle(e)
      }
    },
    [internalOpen, onToggle]
  )

  useEffect(() => {
    setInternalOpen(isOpen)
  }, [isOpen])

  return (
    <div className={cx(styles.container, { [styles.isOpen]: internalOpen }, className)}>
      <aside
        className={cx(styles.aside, asideClassName)}
        style={isSmallScreen ? {} : { width: asideWidth }}
      >
        {isSmallScreen ? (
          <div className={cx('print-hidden', styles.toggleChoice)}>
            <Choice
              size="small"
              options={panelOptions}
              activeOption={internalOpen ? panelOptions[0].id : panelOptions[1].id}
              onSelect={handleClick}
            />
          </div>
        ) : (
          showToggle && (
            <button
              aria-label="Toggle sidebar"
              className={cx('print-hidden', styles.toggleBtn)}
              onClick={handleClick}
            >
              <Icon icon={internalOpen ? 'arrow-left' : 'arrow-right'} />
            </button>
          )
        )}
        {aside}
      </aside>
      <main
        id={MAIN_DOM_ID}
        style={{ left: isOpen ? asideWidth : 0 }}
        className={cx(styles.main, mainClassName)}
      >
        {main}
      </main>
    </div>
  )
}
