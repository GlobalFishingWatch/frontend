import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { Spinner } from '@globalfishingwatch/ui-components'

import { htmlSafeParse } from 'utils/html-parser'

import { useUserGuidePanel, useUserGuideSections } from './content.hooks'
import type { UserGuideSection } from './strapi.types'

import styles from './UserGuide.module.css'

function UserGuide() {
  const { t } = useTranslation()
  const { isOpen, close, selectedSectionId, selectSection } = useUserGuidePanel()
  const { data, loading, error } = useUserGuideSections()

  const sections = useMemo(() => data?.data ?? [], [data?.data])

  const activeSection = useMemo(() => {
    if (sections.length === 0) return null
    if (selectedSectionId) {
      const selected = sections.find((s) => s.documentId === selectedSectionId)
      return selected || sections[0]
    }
    return sections[0]
  }, [sections, selectedSectionId])

  const handleSectionClick = useCallback(
    (section: UserGuideSection) => {
      selectSection(section.documentId)
    },
    [selectSection]
  )

  const handleClose = useCallback(() => {
    close()
  }, [close])

  if (!isOpen) return null
  // todo: handle if strappi had error fetching/no content

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      )}

      {!loading && !error && sections.length > 0 && (
        <>
          <nav className={styles.sidebar}>
            <ul className={styles.tocList}>
              {sections.map((section) => (
                <li key={section.documentId}>
                  <button
                    type="button"
                    className={cx(styles.tocItem, {
                      [styles.tocItemActive]: activeSection?.documentId === section.documentId,
                    })}
                    onClick={() => handleSectionClick(section)}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <article className={styles.content}>
            {activeSection && (
              <>
                <h1 className={styles.sectionTitle}>{activeSection.title}</h1>
                <div className={styles.sectionContent}>
                  {activeSection.contentBlocks?.map((block) => (
                    <div key={block.id} className={styles.contentBlock}>
                      {typeof block.body === 'string' ? htmlSafeParse(block.body) : block.body}
                    </div>
                  ))}
                </div>
              </>
            )}
          </article>
        </>
      )}
    </div>
  )
}

export default UserGuide
