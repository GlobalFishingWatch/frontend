import type { JSX } from 'react'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq } from 'es-toolkit'

import type { DataviewCategory } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useLocationConnect } from 'routes/routes.hook'

import { selectCollapsedSections } from '../workspace.selectors'

import styles from 'features/workspace/shared/Section.module.css'

interface SectionProps {
  id: DataviewCategory
  title: string | JSX.Element
  hasVisibleDataviews: boolean
  children: JSX.Element | JSX.Element[]
  headerOptions: JSX.Element | JSX.Element[] | null
}

function Section({
  id,
  title,
  hasVisibleDataviews,
  children,
  headerOptions,
}: SectionProps): React.ReactElement<any> {
  const { dispatchQueryParams } = useLocationConnect()
  const collapsedSections = useSelector(selectCollapsedSections)
  const collapsed = collapsedSections.includes(id)

  const onCollapse = useCallback(() => {
    const newCollapsedSections = collapsed
      ? collapsedSections.filter((section) => section !== id)
      : [...collapsedSections, id]
    dispatchQueryParams({ collapsedSections: uniq(newCollapsedSections) })
  }, [collapsed, collapsedSections, dispatchQueryParams, id])

  return (
    <div
      className={cx(styles.container, {
        'print-hidden': !hasVisibleDataviews,
        [styles.containerCollapsed]: collapsed,
        [styles.containerExpanded]: !collapsed,
      })}
    >
      <div className={cx(styles.header, 'print-hidden')}>
        <IconButton
          icon={collapsed ? 'arrow-right' : 'arrow-down'}
          type="default"
          size="small"
          className={styles.collapseButton}
          onClick={onCollapse}
        />
        <span className={styles.sectionTitle} onClick={onCollapse}>
          {title}
        </span>
        {headerOptions}
      </div>
      <div className={styles.content}>{children} </div>
    </div>
  )
}

export default Section
