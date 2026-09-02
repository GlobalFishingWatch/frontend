import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import { IS_CHATBOT_ENABLED } from 'data/map/config'
import { useSidePanel } from 'features/_map/content-panel/contentPanel.hooks'
import { useAppSearch } from 'router/routes.hook'

import styles from './ContentPanel.module.css'

const ChatContainer = lazy(() => import('features/_map/content-panel/chat/ChatContainer'))
const DataTerminologyContent = lazy(
  () => import('features/_map/content-panel/data-terminology/DataTerminologyContent')
)
const DatasetInfoContainer = lazy(
  () => import('features/_map/content-panel/datasets-info/DatasetInfoContainer')
)
const UserDatasetInfoContainer = lazy(
  () => import('features/_map/content-panel/datasets-info/UserDatasetInfoContainer')
)
const UserGuideContent = lazy(
  () => import('features/_map/content-panel/user-guide/UserGuideContent')
)

const MIN_PANEL_WIDTH = 320
const MAX_PANEL_WIDTH = 800
const DEFAULT_PANEL_WIDTH = 540

const clampPanelWidth = (width: number) =>
  Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, width))

function ContentPanel({
  initialPanelWidth,
  initialScreenWidth,
  onPanelWidthChange,
}: {
  initialPanelWidth?: number
  initialScreenWidth?: number
  onPanelWidthChange?: (width: number) => void
}) {
  const { sidePanelContent } = useAppSearch()
  const { closeSidePanel } = useSidePanel()
  const isSmallScreen = useSmallScreen(undefined, { initialScreenWidth })

  const [isDragging, setIsDragging] = useState(false)
  const [panelWidth, setPanelWidth] = useState(
    clampPanelWidth(initialPanelWidth ?? DEFAULT_PANEL_WIDTH)
  )

  const startCursorX = useRef<number | null>(null)
  const startWidth = useRef<number | null>(null)

  useEffect(() => {
    if (sidePanelContent === 'chat' && !IS_CHATBOT_ENABLED) {
      closeSidePanel()
    }
  }, [sidePanelContent, closeSidePanel])

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
              width: `100%`,
              '--panel-width': `100%`,
            }
          : {
              width: `${panelWidth}px`,
              '--panel-width': `${panelWidth}px`,
            }) as React.CSSProperties
      }
    >
      {!isSmallScreen && (
        <div
          role="button"
          tabIndex={0}
          className={cx(styles.panelResizer, { [styles.resizing]: isDragging })}
          onMouseDown={handleMouseDown}
        />
      )}
      <Suspense fallback={null}>
        {sidePanelContent === 'userGuide' && <UserGuideContent />}
        {sidePanelContent === 'datasets' && <DatasetInfoContainer />}
        {sidePanelContent === 'userDataset' && <UserDatasetInfoContainer />}
        {sidePanelContent === 'dataTerminology' && <DataTerminologyContent />}
        {sidePanelContent === 'chat' && IS_CHATBOT_ENABLED && <ChatContainer />}
      </Suspense>
    </div>
  )
}

export default ContentPanel
