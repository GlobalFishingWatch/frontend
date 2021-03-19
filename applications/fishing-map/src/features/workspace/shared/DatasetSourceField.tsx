import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import TagList, { TagItem } from '@globalfishingwatch/ui-components/dist/tag-list'
import { UrlDataviewInstance } from 'types'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { getSourcesSelectedInDataview } from '../heatmaps/heatmaps.utils'

type DatasetFilterSourceProps = {
  dataview: UrlDataviewInstance
}

function DatasetFilterSource({ dataview }: DatasetFilterSourceProps) {
  const { t } = useTranslation()

  const sourcesOptions: TagItem[] = getSourcesSelectedInDataview(dataview)
  const nonVmsSources = sourcesOptions.filter((source) => !source.label.includes('VMS'))
  const vmsSources = sourcesOptions.filter((source) => source.label.includes('VMS'))
  let mergedSourceOptions: TagItem[] = []
  if (vmsSources?.length > 1) {
    mergedSourceOptions = [
      ...nonVmsSources,
      {
        id: 'vms-grouped',
        label: `VMS (${vmsSources.length} ${t('common.country_plural', 'countries')})`,
        tooltip: vmsSources.map((source) => source.label).join(', '),
      },
    ]
  }

  if (!sourcesOptions?.length) {
    return null
  }

  return (
    <div className={styles.filter}>
      <label>{t('layer.source', 'Sources')}</label>
      <TagList
        tags={sourcesOptions}
        color={dataview.config?.color}
        className={cx(styles.tagList, {
          [styles.hidden]: mergedSourceOptions?.length > 0,
        })}
      />
      {mergedSourceOptions.length > 0 && (
        <TagList
          tags={mergedSourceOptions}
          color={dataview.config?.color}
          className={styles.mergedTagList}
        />
      )}
    </div>
  )
}

export default DatasetFilterSource
