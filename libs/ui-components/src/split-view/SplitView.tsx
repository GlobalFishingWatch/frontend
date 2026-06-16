import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'

import { Choice } from '../choice'
import { Icon } from '../icon'

import useSmallScreen from './use-small-screen'

import styles from './SplitView.module.css'

export const SPLIT_VIEW_DOM_ID = 'app-layout-content'
export const MAIN_DOM_ID = 'app-main'
export const SIDEBAR_DOM_ID = 'app-sidebar'

const MIN_ASIDE_PCT = 33
const MAX_ASIDE_PCT = 66
const DEFAULT_ASIDE_PCT = 50

const clampAsidePct = (pct: number) => Math.min(MAX_ASIDE_PCT, Math.max(MIN_ASIDE_PCT, pct))

interface SplitViewProps {
  isOpen?: boolean
  showToggle?: boolean
  onToggle?: (e: React.MouseEvent) => void
  asideWidth?: string
  initialAsideWidthPct?: number
  onAsideWidthChange?: (pct: number) => void
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
    initialAsideWidthPct,
    onAsideWidthChange,
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
  const [widthPct, setWidthPct] = useState(() =>
    clampAsidePct(initialAsideWidthPct ?? DEFAULT_ASIDE_PCT)
  )
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect || rect.width === 0) return
      const newPct = clampAsidePct(((e.clientX - rect.left) / rect.width) * 100)
      setWidthPct(newPct)
      onAsideWidthChange?.(newPct)
    },
    [onAsideWidthChange]
  )

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
    <div
      ref={containerRef}
      className={cx(styles.container, { [styles.isOpen]: internalOpen }, className)}
    >
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
