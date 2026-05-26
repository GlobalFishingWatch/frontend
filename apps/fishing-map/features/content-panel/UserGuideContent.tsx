import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { Button, Icon } from '@globalfishingwatch/ui-components'

import { fetchUserGuideContent } from 'features/cms/content.queries'
import type { TUserGuideSection } from 'features/cms/strapi.types'
import ContentHeader from 'features/content-panel/ContentHeader'
import ContentMarkdown from 'features/content-panel/ContentMarkdown'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'
import EmptyContent from 'features/content-panel/EmptyContent'
import TableOfContents from 'features/content-panel/TableOfContents'
import { Route } from 'routes/_app'
import type { Locale } from 'types'

import styles from './ContentPanel.module.css'

export const UserGuideContent = () => {
  const { status: loaderStatus, data: loaderData } = Route.useLoaderData()
  const { sidePanelId, sidePanelSubcontentId } = Route.useSearch()
  const { i18n, t } = useTranslation()

  const [langData, setLangData] = useState<{
    status: string
    data: TUserGuideSection[]
  } | null>(null)

  useEffect(() => {
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
  }, [i18n])

  const status = langData?.status ?? loaderStatus
  const data = (langData?.data ?? loaderData) as TUserGuideSection[]

  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(!sidePanelId)
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { openSidePanel } = useSidePanel()

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const onScroll = () => setIsScrolled(el.scrollTop > 50)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const selectedSectionIndex = useMemo(() => {
    if (!sidePanelId) return 0
    const idx = data.findIndex(
      (s) =>
        s.slug === sidePanelId ||
        s.id.toString() === sidePanelId.toString() ||
        s.title.includes(sidePanelId.toString())
    )
    return idx >= 0 ? idx : 0
  }, [data, sidePanelId])

  const selectedSection = data[selectedSectionIndex]
  const prevSection = data[selectedSectionIndex - 1] ?? null
  const nextSection = data[selectedSectionIndex + 1] ?? null

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

  if (status === 'error' || status === 'empty' || !data?.length) return <EmptyContent />

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
                onClick={() => {
                  setIsTableOfContentsOpen(true)
                  openSidePanel({ type: 'userGuide', id: undefined, subcontentId: undefined })
                }}
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
            {(prevSection || nextSection) && (
              <div className={styles.sectionsNav}>
                {prevSection && (
                  <Button
                    type="border-secondary"
                    size="medium"
                    className={styles.nextSectionLink}
                    onClick={() => {
                      openSidePanel({
                        type: 'userGuide',
                        id: prevSection.slug || prevSection.id.toString(),
                      })
                      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' })
                    }}
                  >
                    <Icon icon="arrow-left" type="default" />
                    <span className={styles.sectionLinkLabel}>{prevSection.title}</span>
                  </Button>
                )}
                {nextSection && (
                  <Button
                    type="border-secondary"
                    size="medium"
                    className={cx(styles.nextSectionLink, {
                      [styles.nextSectionLinkAlignRight]: !prevSection,
                    })}
                    onClick={() => {
                      openSidePanel({
                        type: 'userGuide',
                        id: nextSection.slug || nextSection.id.toString(),
                      })
                      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' })
                    }}
                  >
                    <span className={styles.sectionLinkLabel}>{nextSection.title}</span>
                    <Icon icon="arrow-right" type="default" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
