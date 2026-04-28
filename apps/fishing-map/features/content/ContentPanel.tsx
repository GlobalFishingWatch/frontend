import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import cx from 'classnames'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import ContentHeader from 'features/content/ContentHeader'
import EmptyContent from 'features/content/EmptyContent'
import InfoContainer from 'features/content/InfoContainer'
import type { TUserGuideSection } from 'features/content/strapi.types'
import TableOfContents from 'features/content/TableOfContents'
import { Route } from 'routes/_app'

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
    return data.filter((s) => s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q))
  }, [data, searchQuery])

  const listItems = useMemo(
    () => filteredSections.map((s) => ({ id: s.slug || s.id.toString(), label: s.title })),
    [filteredSections]
  )

  const selectedSection = useMemo(() => {
    return sidePanelId
      ? (data.find(
          (s) =>
            s.slug === sidePanelId ||
            s.id.toString() === sidePanelId.toString() ||
            s.title.includes(sidePanelId.toString())
        ) ?? data[0])
      : data[0]
  }, [data, sidePanelId])

  return (
    <div className={cx(styles.container, { [styles.userGuideBackground]: !isTableOfContentsOpen })}>
      <div className={cx(styles.header)}>
        <ContentHeader
          openTableOfContents={() => setIsTableOfContentsOpen(!isTableOfContentsOpen)}
        />
      </div>
      <div
        className={cx(styles.scrollContainer, {
          [styles.tableOfContentsOpen]: isTableOfContentsOpen,
        })}
      >
        {isTableOfContentsOpen ? (
          <TableOfContents
            listItems={listItems}
            activeId={sidePanelId}
            onClick={setIsTableOfContentsOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        ) : (
          <div className={cx(styles.content)}>
            <h2>{selectedSection.title}</h2>
            <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
              {selectedSection.body}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  )
}

function ContentPanel() {
  const { status, data } = Route.useLoaderData()
  const { sidePanelContent } = Route.useSearch()
  const isDatasets = sidePanelContent === 'datasets'

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
  if (!isDatasets && !data) return null

  const isEmpty = !isDatasets && (status === 'empty' || (Array.isArray(data) && data.length === 0))

  return (
    <div className={styles.panel} style={{ width: `${panelWidth}px` }}>
      <div
        role="button"
        tabIndex={0}
        className={cx(styles.panelResizer, { [styles.resizing]: isDragging })}
        onMouseDown={handleMouseDown}
      />
      {isDatasets ? (
        <InfoContainer />
      ) : isEmpty ? (
        <EmptyContent />
      ) : (
        <UserGuideContent data={data as TUserGuideSection[]} />
      )}
    </div>
  )
}

export default ContentPanel
