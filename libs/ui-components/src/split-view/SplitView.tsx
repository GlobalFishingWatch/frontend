import React, { useState, useCallback, useEffect, useMemo } from 'react'
import cx from 'classnames'
import { Icon } from '../icon'
import { Choice } from '../choice'
import useSmallScreen from './use-small-screen'
import styles from './SplitView.module.css'

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
  } = props
  const panelOptions = useMemo(
    () => [
      {
        id: 'aside',
        title: showAsideLabel,
      },
      {
        id: 'main',
        title: showMainLabel,
      },
    ],
    [showAsideLabel, showMainLabel]
  )
  const [internalOpen, setInternalOpen] = useState<boolean>(isOpen)
  const isSmallScreen = useSmallScreen()

  const handleClick = useCallback(
    (e) => {
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
      <aside className={styles.aside} style={isSmallScreen ? {} : { width: asideWidth }}>
        {isSmallScreen ? (
          <div className={cx('print-hidden', styles.toggleChoice)}>
            <Choice
              size="small"
              options={panelOptions}
              activeOption={internalOpen ? panelOptions[0].id : panelOptions[1].id}
              onOptionClick={handleClick}
            />
          </div>
        ) : (
          showToggle && (
            <button className={cx('print-hidden', styles.toggleBtn)} onClick={handleClick}>
              <Icon icon={internalOpen ? 'arrow-left' : 'arrow-right'} />
            </button>
          )
        )}
        {aside}
      </aside>
      <main style={{ left: isOpen ? asideWidth : 0 }} className={styles.main}>
        {main}
      </main>
    </div>
  )
}
