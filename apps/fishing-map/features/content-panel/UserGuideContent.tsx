import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import cx from 'classnames'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import { IconButton } from '@globalfishingwatch/ui-components'

import type { TUserGuideSection } from 'features/cms/strapi.types'
import ContentHeader from 'features/content-panel/ContentHeader'
import { useSidePanel } from 'features/content-panel/contentPanel.hooks'
import MarkdownLink from 'features/content-panel/MarkdownLink'
import TableOfContents from 'features/content-panel/TableOfContents'
import { Route } from 'routes/_app'

import styles from './ContentPanel.module.css'

type UserGuideContentProps = { data: TUserGuideSection[] }

export const UserGuideContent = ({ data }: UserGuideContentProps) => {
  const { sidePanelId, sidePanelSubcontentId } = Route.useSearch()
  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(!sidePanelId)
  const { openSidePanel } = useSidePanel()
  const { t } = useTranslation()

  const markdownComponents = useMemo(() => ({ a: MarkdownLink }), [])

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
            <div className={styles.titleContainer}>
              <IconButton
                icon="list"
                onClick={() => setIsTableOfContentsOpen(!isTableOfContentsOpen)}
              />
              {t((t) => t.common.userGuide)}
            </div>
          }
        />
      </div>
      <div
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
            <Markdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {selectedSection.body}
            </Markdown>
            {selectedSection.subsections?.map((subsection) => (
              <div
                key={subsection.id}
                id={subsection.slug || subsection.id}
                className={styles.subsection}
              >
                <h3>{subsection.title}</h3>
                <Markdown
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {subsection.body}
                </Markdown>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
