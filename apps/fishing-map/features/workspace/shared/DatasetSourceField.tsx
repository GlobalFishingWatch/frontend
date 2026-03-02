import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { TagItem } from '@globalfishingwatch/ui-components'
import { IconButton, TagList } from '@globalfishingwatch/ui-components'

import { useMigrateToLatestDataview } from 'features/dataviews/dataviews.hooks'
import { dataviewWithPrivateDatasets } from 'features/dataviews/dataviews.utils'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import styles from 'features/workspace/shared/LayerPanel.module.css'

type DatasetFilterSourceProps = {
  dataview: UrlDataviewInstance
  hideColor?: boolean
  allowDelete?: boolean
  showDeprecatedWarning?: boolean
  className?: string
}

function DatasetFilterSource({
  dataview,
  hideColor,
  className = '',
  allowDelete = false,
  showDeprecatedWarning = false,
}: DatasetFilterSourceProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const sourcesSelected: TagItem[] = getSourcesSelectedInDataview(dataview)
  const { migrateToLatestDataviewInstance } = useMigrateToLatestDataview()
  const nonVmsSources = sourcesSelected.filter((source) => !source.label.includes('VMS'))
  const vmsSources = sourcesSelected.filter((source) => source.label.includes('VMS'))
  const hasPrivateDatasets = dataviewWithPrivateDatasets(dataview as UrlDataviewInstance)
  let mergedSourceOptions: TagItem[] = []
  if (!hasPrivateDatasets && vmsSources?.length > 1) {
    mergedSourceOptions = [
      ...nonVmsSources,
      {
        id: 'vms-grouped',
        label: `VMS (${vmsSources.length} ${t((t) => t.common.country, {
          count: 2,
        })})`,
        tooltip: vmsSources.map((source) => source.label).join(', '),
      },
    ]
  }

  if (!sourcesSelected?.length) {
    return null
  }

  const onRemoveFilterClick = () => {
    if (allowDelete) {
      upsertDataviewInstance({ id: dataview.id, deleted: true })
    }
  }

  return (
    <div className={cx(styles.filter, className)} data-test="source-tags">
      <label>{t((t) => t.layer.source)}</label>
      <div className={styles.flex}>
        {showDeprecatedWarning && (
          <IconButton
            icon="warning"
            type="warning-invert"
            onClick={() => migrateToLatestDataviewInstance(dataview)}
            tooltip={t((t) => t.workspace.deprecatedActivityLayer)}
            size="small"
          />
        )}
        {/* Rendering both so the unmerged one is visible in printing */}
        <TagList
          testId="source-tag-item"
          tags={sourcesSelected}
          onRemove={allowDelete ? onRemoveFilterClick : undefined}
          color={hideColor ? undefined : dataview.config?.color}
          className={cx(styles.tagList, {
            [styles.hidden]: mergedSourceOptions?.length > 0,
          })}
        />
        {mergedSourceOptions.length > 0 && (
          <TagList
            tags={mergedSourceOptions}
            color={hideColor ? undefined : dataview.config?.color}
            onRemove={allowDelete ? onRemoveFilterClick : undefined}
            className={styles.mergedTagList}
          />
        )}
      </div>
    </div>
  )
}

export default DatasetFilterSource
