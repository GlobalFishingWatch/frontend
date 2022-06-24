import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { TagList, TagItem } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import {
  getSourcesOptionsInDataview,
  getSourcesSelectedInDataview,
} from 'features/workspace/activity/activity.utils'
import { dataviewWithPrivateDatasets } from 'features/dataviews/dataviews.utils'

type DatasetFilterSourceProps = {
  dataview: UrlDataviewInstance
  hideColor?: boolean
}

function DatasetFilterSource({ dataview, hideColor }: DatasetFilterSourceProps) {
  const { t } = useTranslation()
  const sourcesOptions: TagItem[] = getSourcesOptionsInDataview(dataview)
  const sourcesSelected: TagItem[] = getSourcesSelectedInDataview(dataview)
  const nonVmsSources = sourcesSelected.filter((source) => !source.label.includes('VMS'))
  const vmsSources = sourcesSelected.filter((source) => source.label.includes('VMS'))
  const hasPrivateDatasets = dataviewWithPrivateDatasets(dataview as UrlDataviewInstance)
  let mergedSourceOptions: TagItem[] = []
  if (!hasPrivateDatasets && vmsSources?.length > 1) {
    mergedSourceOptions = [
      ...nonVmsSources,
      {
        id: 'vms-grouped',
        label: `VMS (${vmsSources.length} ${t('common.country_other', 'countries')})`,
        tooltip: vmsSources.map((source) => source.label).join(', '),
      },
    ]
  }

  if (!sourcesSelected?.length || sourcesOptions?.length <= 1) {
    return null
  }

  return (
    <div className={styles.filter}>
      <label>{t('layer.source', 'Sources')}</label>
      <TagList
        tags={sourcesSelected}
        color={hideColor ? null : dataview.config?.color}
        className={cx(styles.tagList, {
          [styles.hidden]: mergedSourceOptions?.length > 0,
        })}
      />
      {mergedSourceOptions.length > 0 && (
        <TagList
          tags={mergedSourceOptions}
          color={hideColor ? null : dataview.config?.color}
          className={styles.mergedTagList}
        />
      )}
    </div>
  )
}

export default DatasetFilterSource
