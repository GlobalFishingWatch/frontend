import type { JSX } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { DataviewCategory } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectWorkspace } from '../workspace.selectors'

import styles from 'features/workspace/shared/Sections.module.css'

interface SectionsProps {
  id?: DataviewCategory
  title: string | JSX.Element
  hasVisibleDataviews: boolean
  children: JSX.Element | JSX.Element[]
  headerOptions: JSX.Element | JSX.Element[] | null
}

function Sections({
  id,
  title,
  hasVisibleDataviews,
  children,
  headerOptions,
}: SectionsProps): React.ReactElement<any> {
  const workspace = useSelector(selectWorkspace)
  const collapsedSections = workspace?.collapsedSections || []
  const [collapsed, setCollapsed] = useState(id ? collapsedSections.includes(id) : false)

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
          onClick={() => setCollapsed(!collapsed)}
        />
        <span className={styles.sectionTitle} onClick={() => setCollapsed(!collapsed)}>
          {title}
        </span>
        {headerOptions}
      </div>
      <div className={styles.content}>{children} </div>
    </div>
  )
}

export default Sections
