import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import { fetchUserGuideContent } from 'features/cms/content.queries'
import type { TUserGuideSection } from 'features/cms/strapi.types'
import InfoContainer from 'features/content-panel/InfoContainer'
import UserDatasetContent from 'features/content-panel/UserDatasetContent'
import { UserGuideContent } from 'features/content-panel/UserGuideContent'
import { Route } from 'routes/_app'
import type { Locale } from 'types'

import styles from './ContentPanel.module.css'

const MIN_PANEL_WIDTH = 320
const MAX_PANEL_WIDTH = 800
const PANEL_WIDTH_STORAGE_KEY = 'contentPanelWidth'

function ContentPanel() {
  const { status: loaderStatus, data: loaderData } = Route.useLoaderData()
  const { sidePanelContent } = Route.useSearch()
  const { i18n } = useTranslation()
  const isSmallScreen = useSmallScreen()

  const [langData, setLangData] = useState<{
    status: string
    data: TUserGuideSection[]
  } | null>(null)

  useEffect(() => {
    if (sidePanelContent !== 'userGuide') return
    const refetch = async (locale: Locale) => {
      try {
        const response = await fetchUserGuideContent({ locale })
        if (!response?.data?.length) {
          setLangData({ status: 'empty', data: [] })
        } else {
          setLangData({ status: 'success', data: response.data as TUserGuideSection[] })
        }
      } catch {
        setLangData(null)
      }
    }
    i18n.on('languageChanged', refetch)
    return () => i18n.off('languageChanged', refetch)
  }, [i18n, sidePanelContent])

  const status = langData?.status ?? loaderStatus
  const data = langData?.data ?? loaderData

  const [isDragging, setIsDragging] = useState(false)
  const [panelWidth, setPanelWidth] = useState(540)

  const startCursorX = useRef<number | null>(null)
  const startWidth = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (startCursorX.current === null || startWidth.current === null) return
    const cursorXDelta = startCursorX.current - e.clientX
    let newWidth = Math.min(startWidth.current + cursorXDelta, MAX_PANEL_WIDTH)
    newWidth = Math.max(MIN_PANEL_WIDTH, newWidth)
    setPanelWidth(newWidth)
    localStorage.setItem(PANEL_WIDTH_STORAGE_KEY, newWidth.toString())
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

  if (status === 'error') return null

  return (
    <div className={styles.panel} style={isSmallScreen ? undefined : { width: `${panelWidth}px` }}>
      <div
        role="button"
        tabIndex={0}
        className={cx(styles.panelResizer, { [styles.resizing]: isDragging })}
        onMouseDown={handleMouseDown}
      />
      {sidePanelContent === 'userGuide' && <UserGuideContent data={data as TUserGuideSection[]} />}
      {sidePanelContent === 'datasets' && <InfoContainer />}
      {sidePanelContent === 'userDataset' && <UserDatasetContent />}
    </div>
  )
}

export default ContentPanel
