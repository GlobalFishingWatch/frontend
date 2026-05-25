import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { TUserGuideSection } from 'features/cms/strapi.types'
import ContentHeader from 'features/content-panel/ContentHeader'
import ContentMarkdown from 'features/content-panel/ContentMarkdown'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'
import TableOfContents from 'features/content-panel/TableOfContents'
import { Route } from 'routes/_app'

import styles from './ContentPanel.module.css'

type UserGuideContentProps = { data: TUserGuideSection[] }

export const UserGuideContent = ({ data }: UserGuideContentProps) => {
  const { sidePanelId, sidePanelSubcontentId } = Route.useSearch()
  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(!sidePanelId)
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { openSidePanel } = useSidePanel()
  const { t } = useTranslation()

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const onScroll = () => setIsScrolled(el.scrollTop > 50)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

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

  useEffect(() => {
    if (!sidePanelSubcontentId || isTableOfContentsOpen) return
    let cancelled = false

    requestAnimationFrame(() => {
      const subcontentElement = document.getElementById(sidePanelSubcontentId)
      if (cancelled || !subcontentElement) return

      const performScroll = () => {
        if (!cancelled) {
          subcontentElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }

      const unloadedImages = Array.from(
        (subcontentElement.parentElement || document).querySelectorAll<HTMLImageElement>('img')
      ).filter((img) => !img.complete)

      if (unloadedImages.length === 0) {
        performScroll()
        return
      }

      let pendingImages = unloadedImages.length
      const onImgLoad = () => {
        if (--pendingImages === 0) {
          performScroll()
        }
      }
      unloadedImages.forEach((img) => {
        img.addEventListener('load', onImgLoad, { once: true })
      })
    })

    return () => {
      cancelled = true
    }
  }, [sidePanelSubcontentId, isTableOfContentsOpen, selectedSection])

  return (
    <div className={cx(styles.container, { [styles.userGuideBackground]: !isTableOfContentsOpen })}>
      <div className={cx(styles.header)}>
        <ContentHeader
          title={
            <span className={styles.titleText}>
              <span
                className={cx({ [styles.pointer]: !isTableOfContentsOpen })}
                role="button"
                tabIndex={0}
                onClick={() => setIsTableOfContentsOpen(true)}
              >
                {t((t) => t.common.userGuide)}
              </span>
              {isScrolled && !isTableOfContentsOpen && selectedSection && (
                <>
                  <span className={cx(styles.separator, styles.secondary)}>|</span>
                  <span
                    className={cx(styles.pointer, styles.secondary)}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  >{`${selectedSection.title}`}</span>
                </>
              )}
            </span>
          }
        />
      </div>
      <div
        ref={scrollContainerRef}
        className={cx(styles.scrollContainer, {
          [styles.tableOfContentsOpen]: isTableOfContentsOpen,
        })}
      >
        {isTableOfContentsOpen ? (
          <TableOfContents
            data={data}
            activeId={sidePanelId}
            onClick={(id) => {
              openSidePanel({ type: 'userGuide', id: id })
              setIsTableOfContentsOpen(false)
            }}
            onSubTopicClick={(sectionId, subId) => {
              openSidePanel({ type: 'userGuide', id: sectionId, subcontentId: subId })
              setIsTableOfContentsOpen(false)
            }}
          />
        ) : (
          <div className={cx(styles.content)}>
            <h2>{selectedSection.title}</h2>
            <ContentMarkdown>{selectedSection.body}</ContentMarkdown>
            {selectedSection.subsections?.map((subsection) => (
              <div
                key={subsection.id}
                id={subsection.slug || subsection.id}
                className={styles.subsection}
              >
                <h3>{subsection.title}</h3>
                <ContentMarkdown>{subsection.body}</ContentMarkdown>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
