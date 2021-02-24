import React from 'react'
import cx from 'classnames'
import { TagList } from '@globalfishingwatch/ui-components'
import { TagItem } from '@globalfishingwatch/ui-components/dist/tag-list'
import { UrlDataviewInstance } from 'types'
import styles from 'features/workspace/shared/LayerPanel.module.css'

type ReportFilterProps = {
  label: UrlDataviewInstance
  taglist: TagItem[]
  color?: string
}

function ReportFilter({ label, taglist, color = '' }: ReportFilterProps): React.ReactElement {
  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: false,
        [styles.noBorder]: false,
      })}
    >
      <div className={styles.properties}>
        <div className={styles.filters}>
          <div className={styles.filter}>
            <label>{label}</label>
            <TagList tags={taglist} color={color} className={cx(styles.tagList)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportFilter
