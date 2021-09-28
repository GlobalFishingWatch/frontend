import React from 'react'
import cx from 'classnames'
import { TagList } from '@globalfishingwatch/ui-components'
import { TagItem } from '@globalfishingwatch/ui-components/src/tag-list'
import styles from 'features/workspace/shared/LayerPanel.module.css'

type AnalysisFilterProps = {
  label: string
  taglist: TagItem[]
  color?: string
}

function AnalysisFilter({ label, taglist, color = '' }: AnalysisFilterProps): React.ReactElement {
  return (
    <div className={styles.filter}>
      <label>{label}</label>
      <TagList tags={taglist} color={color} className={cx(styles.tagList)} />
    </div>
  )
}

export default AnalysisFilter
