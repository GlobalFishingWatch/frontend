import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { TagItem } from '@globalfishingwatch/ui-components'
import { TagList } from '@globalfishingwatch/ui-components'

import { dataviewWithPrivateDatasets } from 'features/dataviews/dataviews.utils'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'

import styles from 'features/workspace/shared/LayerPanel.module.css'

type DatasetFilterSourceProps = {
  dataview: UrlDataviewInstance
  hideColor?: boolean
  className?: string
}

function DatasetFilterSource({ dataview, hideColor, className = '' }: DatasetFilterSourceProps) {
  const { t } = useTranslation()
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
        label: `VMS (${vmsSources.length} ${t('common.country_other')})`,
        tooltip: vmsSources.map((source) => source.label).join(', '),
      },
    ]
  }

  if (!sourcesSelected?.length) {
    return null
  }

  return (
    <div className={cx(styles.filter, className)} data-test="source-tags">
      <label>{t('layer.source')}</label>
      {/* Rendering both so the unmerged one is visible in printing */}
      <TagList
        testId="source-tag-item"
        tags={sourcesSelected}
        color={hideColor ? undefined : dataview.config?.color}
        className={cx(styles.tagList, {
          [styles.hidden]: mergedSourceOptions?.length > 0,
        })}
      />
      {mergedSourceOptions.length > 0 && (
        <TagList
          tags={mergedSourceOptions}
          color={hideColor ? undefined : dataview.config?.color}
          className={styles.mergedTagList}
        />
      )}
    </div>
  )
}

export default DatasetFilterSource
