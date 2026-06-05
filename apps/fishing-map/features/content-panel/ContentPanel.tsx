import { useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import DataTerminologyContent from 'features/content-panel/DataTerminologyContent'
import InfoContainer from 'features/content-panel/InfoContainer'
import UserDatasetContent from 'features/content-panel/UserDatasetContent'
import UserGuideContent from 'features/content-panel/UserGuideContent'
import { Route } from 'routes/_app'

import styles from './ContentPanel.module.css'

const MIN_PANEL_WIDTH = 320
const MAX_PANEL_WIDTH = 800
const DEFAULT_PANEL_WIDTH = 540

const clampPanelWidth = (width: number) =>
  Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, width))

function ContentPanel({
  initialPanelWidth,
  onPanelWidthChange,
}: {
  initialPanelWidth?: number
  onPanelWidthChange?: (width: number) => void
}) {
  const { sidePanelContent } = Route.useSearch()
  const isSmallScreen = useSmallScreen()

  const [isDragging, setIsDragging] = useState(false)
  const [panelWidth, setPanelWidth] = useState(
    clampPanelWidth(initialPanelWidth ?? DEFAULT_PANEL_WIDTH)
  )

  const startCursorX = useRef<number | null>(null)
  const startWidth = useRef<number | null>(null)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (startCursorX.current === null || startWidth.current === null) return
      const cursorXDelta = startCursorX.current - e.clientX
      const newWidth = clampPanelWidth(startWidth.current + cursorXDelta)
      setPanelWidth(newWidth)
      onPanelWidthChange?.(newWidth)
    },
    [onPanelWidthChange]
  )

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
      {sidePanelContent === 'dataTerminology' && <DataTerminologyContent />}
    </div>
  )
}

export default ContentPanel
