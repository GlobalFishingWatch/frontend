import React, { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import cx from 'classnames'

import { Choice } from '../choice'
import { Icon } from '../icon'

import useSmallScreen from './use-small-screen'

import styles from './SplitView.module.css'

export const MAIN_DOM_ID = 'app-main'
export const SIDEBAR_DOM_ID = 'app-sidebar'

const MIN_ASIDE_PCT = 33
const MAX_ASIDE_PCT = 66
const DEFAULT_ASIDE_PCT = 50
const ASIDE_WIDTH_STORAGE_KEY = 'sidebarWidth'

const clampAsidePct = (pct: number) => Math.min(MAX_ASIDE_PCT, Math.max(MIN_ASIDE_PCT, pct))

const asideWidthListeners = new Set<() => void>()

const subscribeAsideWidth = (onChange: () => void) => {
  asideWidthListeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    asideWidthListeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

const getAsideWidthSnapshot = () => {
  const stored = localStorage.getItem(ASIDE_WIDTH_STORAGE_KEY)
  const parsed = stored ? parseFloat(stored) : NaN
  return Number.isNaN(parsed) ? DEFAULT_ASIDE_PCT : clampAsidePct(parsed)
}

const setStoredAsideWidth = (pct: number) => {
  localStorage.setItem(ASIDE_WIDTH_STORAGE_KEY, pct.toString())
  asideWidthListeners.forEach((listener) => listener())
}

interface SplitViewProps {
  isOpen?: boolean
  showToggle?: boolean
  onToggle?: (e: React.MouseEvent) => void
  asideWidth?: string
  resizable?: boolean
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
    resizable = false,
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

  const [isDragging, setIsDragging] = useState(false)
  const widthPct = useSyncExternalStore(
    subscribeAsideWidth,
    getAsideWidthSnapshot,
    () => DEFAULT_ASIDE_PCT
  )

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newPct = clampAsidePct((e.clientX / window.innerWidth) * 100)
    setStoredAsideWidth(newPct)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.body.style.userSelect = ''
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const isResizable = resizable && !isSmallScreen
  const effectiveWidth = isResizable ? `${widthPct}%` : asideWidth

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
        style={isSmallScreen ? {} : { width: effectiveWidth }}
      >
        {isResizable && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Resize sidebar"
            className={cx(styles.resizer, { [styles.resizing]: isDragging })}
            onMouseDown={handleMouseDown}
          />
        )}
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
        data-testid={MAIN_DOM_ID}
        style={{ left: isOpen ? effectiveWidth : 0 }}
        className={cx(styles.main, mainClassName)}
      >
        {main}
      </main>
    </div>
  )
}
