import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'

import ContentHeader from 'features/content/ContentHeader'
import type { TDataset, TUserGuideSection } from 'features/content/strapi.types'
import TableOfContents from 'features/content/TableOfContents'
import { Route } from 'routes/_app'
import { htmlSafeParse } from 'utils/html-parser'

import styles from './ContentPanel.module.css'

const MIN_PANEL_WIDTH = 320
const MAX_PANEL_WIDTH = 800
const PANEL_WIDTH_STORAGE_KEY = 'contentPanelWidth'

type UserGuideContentProps = { data: TUserGuideSection[] }

const UserGuideContent = ({ data }: UserGuideContentProps) => {
  const { sidePanelId } = Route.useSearch()
  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(!sidePanelId)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return data
    const q = searchQuery.toLowerCase()
    return data.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.contentBlocks.some((block) => block.body.toLowerCase().includes(q))
    )
  }, [data, searchQuery])

  const listItems = useMemo(
    () => filteredSections.map((s) => ({ id: s.id, label: s.title })),
    [filteredSections]
  )

  const selectedSection = useMemo(() => {
    return sidePanelId
      ? (data.find((s) => s.id.toString() === sidePanelId.toString()) ?? data[0])
      : data[0]
  }, [data, sidePanelId])

  return (
    <div className={cx(styles.container, { [styles.userGuideBackground]: !isTableOfContentsOpen })}>
      <div className={cx(styles.header)}>
        <ContentHeader
          openTableOfContents={() => setIsTableOfContentsOpen(!isTableOfContentsOpen)}
        />
      </div>
      <div className={cx(styles.scrollContainer)}>
        {isTableOfContentsOpen ? (
          <TableOfContents
            listItems={listItems}
            onClick={setIsTableOfContentsOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        ) : (
          <div className={cx(styles.content)}>
            <h2>{selectedSection.title}</h2>
            {selectedSection.contentBlocks.map((block) => htmlSafeParse(block.body))}
          </div>
        )}
      </div>
    </div>
  )
}

function ContentPanel() {
  const { status, data } = Route.useLoaderData()
  const { sidePanelContent } = Route.useSearch()

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

  if (!data || status === 'empty' || status === 'error') return null

  return (
    <div className={styles.panel} style={{ width: `${panelWidth}px` }}>
      <div
        role="button"
        tabIndex={0}
        className={cx(styles.panelResizer, { [styles.resizing]: isDragging })}
        onMouseDown={handleMouseDown}
      />
      {sidePanelContent === 'userGuide' ? (
        <UserGuideContent data={data as TUserGuideSection[]} />
      ) : (
        <div className={cx(styles.container)}>
          <div className={cx(styles.header)}>
            <ContentHeader title={(data[0] as TDataset).name} />
          </div>
          <div className={cx(styles.scrollContainer)}>
            <div className={cx(styles.content)}>
              {htmlSafeParse((data[0] as TDataset).description)}
            </div>
          </div>
          <div className={cx(styles.userGuideBackground)}></div>
        </div>
      )}
    </div>
  )
}

export default ContentPanel
