import React, { useState, useCallback, useEffect, memo } from 'react'
import cx from 'classnames'
import Icon from '../icon'
import styles from './SplitView.module.css'

interface SplitViewProps {
  isOpen?: boolean
  onToggle?: (e: React.MouseEvent) => void
  asideWidth?: string
  aside: React.ReactNode
  main: React.ReactNode
  className?: string
}

function SplitView(props: SplitViewProps) {
  const {
    isOpen = true,
    onToggle,
    aside = null,
    main = null,
    asideWidth = '32rem',
    className,
  } = props
  const [internalOpen, setInternalOpen] = useState<boolean>(isOpen)

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
      <aside className={styles.aside} style={{ width: asideWidth }}>
        <button className={styles.toggleBtn} onClick={handleClick}>
          <Icon icon={internalOpen ? 'arrow-left' : 'arrow-right'} />
        </button>
        {aside}
      </aside>
      <main style={{ left: isOpen ? asideWidth : 0 }} className={styles.main}>
        {main}
      </main>
    </div>
  )
}

export default memo(SplitView)
