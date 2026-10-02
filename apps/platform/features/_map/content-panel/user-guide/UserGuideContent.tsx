import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useGetUserGuideQuery } from 'queries/map/user-guide-api'

import { Button, Icon, IconButton, InputText, Spinner } from '@globalfishingwatch/ui-components'

import ContentHeader from 'features/_map/content-panel/ContentHeader'
import ContentMarkdown from 'features/_map/content-panel/ContentMarkdown'
import { useSidePanel, useSidePanelItem } from 'features/_map/content-panel/contentPanel.hooks'
import EmptyContent from 'features/_map/content-panel/EmptyContent'
import TableOfContents from 'features/_map/content-panel/user-guide/TableOfContents'
import { toContentLocale } from 'features/i18n/i18n.config'

import styles from '../ContentPanel.module.css'

export const UserGuideContentComponent = () => {
  const { id: sidePanelId, subcontentId: sidePanelSubcontentId } = useSidePanelItem()
  const { i18n, t } = useTranslation()

  const {
    data = [],
    isLoading,
    isError,
  } = useGetUserGuideQuery({
    locale: toContentLocale(i18n.language),
  })

  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(!sidePanelId)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolledSubsectionId, setScrolledSubsectionId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { openSidePanel } = useSidePanel()

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const onScroll = () => {
      setIsScrolled(el.scrollTop > 50)
      const containerTop = el.getBoundingClientRect().top
      const passed = Array.from(el.querySelectorAll<HTMLElement>('[data-subsection]')).filter(
        (sub) => sub.getBoundingClientRect().top - containerTop <= 1
      )
      setScrolledSubsectionId(passed.at(-1)?.dataset.subsection ?? null)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [isLoading])

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
  const scrolledSubsection = selectedSection?.subsections?.find(
    (sub) => (sub.slug || sub.id) === scrolledSubsectionId
  )
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
          subcontentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
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

  if (isLoading) {
    return <Spinner />
  }
  if (isError || !data.length) {
    return <EmptyContent />
  }

  return (
    <div
      className={cx(styles.container, {
        [styles.userGuideBackground]: !isTableOfContentsOpen,
      })}
    >
      <div className={cx(styles.header)}>
        <ContentHeader
          title={
            isTableOfContentsOpen ? (
              <InputText
                className={styles.headerSearch}
                inputSize="medium"
                onChange={(e) => setSearchQuery(e.target.value)}
                onCleanButtonClick={() => setSearchQuery('')}
                value={searchQuery}
                type="search"
                placeholder={t((t) => t.search.title)}
              />
            ) : (
              <span className={styles.titleText}>
                <IconButton
                  icon="home"
                  className={styles.homeButton}
                  size="medium"
                  tooltip={t((t) => t.common.userGuide)}
                  onClick={() => {
                    setIsTableOfContentsOpen(true)
                    openSidePanel({
                      type: 'userGuide',
                      id: undefined,
                      subcontentId: undefined,
                    })
                  }}
                />
                {isScrolled && !isTableOfContentsOpen && selectedSection && (
                  <>
                    <Icon icon="arrow-right" className={cx(styles.separator, styles.secondary)} />
                    <span
                      className={cx(styles.pointer, styles.secondary)}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        scrollContainerRef.current?.scrollTo({
                          top: 0,
                          behavior: 'smooth',
                        })
                      }
                    >{`${selectedSection.title}`}</span>
                    {scrolledSubsection && (
                      <>
                        <Icon
                          icon="arrow-right"
                          className={cx(styles.separator, styles.secondary)}
                        />
                        <span
                          className={cx(styles.pointer, styles.secondary)}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            document
                              .getElementById(scrolledSubsection.slug || scrolledSubsection.id)
                              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        >
                          {scrolledSubsection.title}
                        </span>
                      </>
                    )}
                  </>
                )}
              </span>
            )
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
            searchQuery={searchQuery}
            activeId={sidePanelId}
            onClick={(id) => {
              openSidePanel({ type: 'userGuide', id: id })
              setIsTableOfContentsOpen(false)
            }}
            onSubItemClick={(sectionId, subId) => {
              openSidePanel({
                type: 'userGuide',
                id: sectionId,
                subcontentId: subId,
              })
              setIsTableOfContentsOpen(false)
            }}
          />
        ) : (
          <div className={cx(styles.content)}>
            <h2 className={styles.sectionTitle}>{selectedSection.title}</h2>
            <ContentMarkdown>{selectedSection.body}</ContentMarkdown>
            {selectedSection.subsections?.map((subsection) => (
              <div
                key={subsection.id}
                id={subsection.slug || subsection.id}
                data-subsection={subsection.slug || subsection.id}
                className={styles.subsection}
              >
                <h3 className={styles.subsectionTitle}>{subsection.title}</h3>
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
                      scrollContainerRef.current?.scrollTo({
                        top: 0,
                        behavior: 'instant',
                      })
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
                      scrollContainerRef.current?.scrollTo({
                        top: 0,
                        behavior: 'instant',
                      })
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

export default UserGuideContentComponent
