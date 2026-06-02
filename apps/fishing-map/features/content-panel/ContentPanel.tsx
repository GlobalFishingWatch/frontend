import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import cx from 'classnames'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import InfoContainer from 'features/content-panel/InfoContainer'
import UserDatasetContent from 'features/content-panel/UserDatasetContent'
import UserGuideContent from 'features/content-panel/UserGuideContent'
import { Route } from 'routes/_app'

import styles from './ContentPanel.module.css'

const MIN_PANEL_WIDTH = 320
const MAX_PANEL_WIDTH = 800
const DEFAULT_PANEL_WIDTH = 540
const PANEL_WIDTH_STORAGE_KEY = 'contentPanelWidth'

const clampPanelWidth = (width: number) =>
  Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, width))

// localStorage-backed store read via useSyncExternalStore so it stays SSR-safe
// (server falls back to the default) without a setState effect.
const panelWidthListeners = new Set<() => void>()

const subscribePanelWidth = (onChange: () => void) => {
  panelWidthListeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    panelWidthListeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

const getPanelWidthSnapshot = () => {
  const stored = localStorage.getItem(PANEL_WIDTH_STORAGE_KEY)
  const parsed = stored ? parseFloat(stored) : NaN
  return Number.isNaN(parsed) ? DEFAULT_PANEL_WIDTH : clampPanelWidth(parsed)
}

const setStoredPanelWidth = (width: number) => {
  localStorage.setItem(PANEL_WIDTH_STORAGE_KEY, width.toString())
  panelWidthListeners.forEach((listener) => listener())
}

function ContentPanel() {
  const { sidePanelContent } = Route.useSearch()
  const isSmallScreen = useSmallScreen()

  const [isDragging, setIsDragging] = useState(false)
  const panelWidth = useSyncExternalStore(
    subscribePanelWidth,
    getPanelWidthSnapshot,
    () => DEFAULT_PANEL_WIDTH
  )

  const startCursorX = useRef<number | null>(null)
  const startWidth = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (startCursorX.current === null || startWidth.current === null) return
    const cursorXDelta = startCursorX.current - e.clientX
    setStoredPanelWidth(clampPanelWidth(startWidth.current + cursorXDelta))
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    startCursorX.current = null
    startWidth.current = null
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startCursorX.current = e.clientX
    startWidth.current = panelWidth
    setIsDragging(true)
  }

  return (
    <div
      className={cx(styles.panel, { [styles.hidden]: !sidePanelContent })}
      style={
        (isSmallScreen
          ? {
              width: `100vw`,
              '--panel-width': `100vw`,
            }
          : {
              width: `${panelWidth}px`,
              '--panel-width': `${panelWidth}px`,
            }) as React.CSSProperties
      }
    >
      <div
        role="button"
        tabIndex={0}
        className={cx(styles.panelResizer, { [styles.resizing]: isDragging })}
        onMouseDown={handleMouseDown}
      />
      {sidePanelContent === 'userGuide' && <UserGuideContent />}
      {sidePanelContent === 'datasets' && <InfoContainer />}
      {sidePanelContent === 'userDataset' && <UserDatasetContent />}
    </div>
  )
}

export default ContentPanel
