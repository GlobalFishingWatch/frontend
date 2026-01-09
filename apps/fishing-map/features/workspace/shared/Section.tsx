import type { JSX } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq } from 'es-toolkit'

import type { DataviewCategory } from '@globalfishingwatch/api-types'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'

import { selectScreenshotModalOpen } from 'features/modals/modals.slice'
import { useLocationConnect } from 'routes/routes.hook'

import { selectCollapsedSections } from '../workspace.selectors'

import styles from 'features/workspace/shared/Section.module.css'

interface SectionProps {
  id: DataviewCategory
  title: string | JSX.Element
  hasVisibleDataviews: boolean
  children: JSX.Element | JSX.Element[]
  headerOptions: JSX.Element | JSX.Element[] | null
  className?: string
}

function Section({
  id,
  title,
  hasVisibleDataviews,
  children,
  headerOptions,
  className,
}: SectionProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const collapsedSections = useSelector(selectCollapsedSections)
  const screenshotModalOpen = useSelector(selectScreenshotModalOpen)
  const collapsed = screenshotModalOpen ? false : collapsedSections.includes(id)

  const onCollapse = useCallback(() => {
    const newCollapsedSections = collapsed
      ? collapsedSections.filter((section) => section !== id)
      : [...collapsedSections, id]
    dispatchQueryParams({ collapsedSections: uniq(newCollapsedSections) })
  }, [collapsed, collapsedSections, dispatchQueryParams, id])

  return (
    <section
      className={cx(
        styles.container,
        {
          'print-hidden': !hasVisibleDataviews,
          [styles.containerCollapsed]: collapsed,
          [styles.containerExpanded]: !collapsed,
        },
        className
      )}
    >
      <div className={cx(styles.header, 'print-hidden')}>
        <Tooltip content={collapsed ? t('common.expandSection') : ''} placement="top-start">
          <h2 className={styles.sectionTitle} onClick={collapsed ? onCollapse : undefined}>
            {title}
          </h2>
        </Tooltip>
        {collapsed ? (
          <IconButton
            key="expand"
            tooltip={t('common.expandSection')}
            icon={'section-expand'}
            type="default"
            size="medium"
            onClick={onCollapse}
          />
        ) : (
          <IconButton
            key="collapse"
            tooltip={t('common.collapseSection')}
            icon={'section-collapse'}
            type="default"
            size="medium"
            className={styles.collapseButton}
            onClick={onCollapse}
          />
        )}
        {headerOptions}
      </div>
      {!collapsed && <div className={styles.content}>{children}</div>}
    </section>
  )
}

export default Section
