import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { TagItem } from '@globalfishingwatch/ui-components'
import { IconButton, TagList } from '@globalfishingwatch/ui-components'
import { SOURCE_TAG_TESTID } from '@platform/config/selectors/workspace'

import { useMigrateToLatestDataview } from 'features/_map/dataviews/dataviews.hooks'
import { dataviewWithPrivateDatasets } from 'features/_map/dataviews/dataviews.utils'
import {
  getSourcesSelectedInDataview,
  groupVmsSources,
} from 'features/_map/workspace/activity/activity.utils'
import { useDataviewInstancesConnect } from 'features/_map/workspace/workspace.hook'

import styles from 'features/_map/workspace/shared/LayerPanel.module.css'

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
  const {
    onMigrateDataviewClick,
    getIsDataviewMigrated,
    isLoading: isMigrating,
  } = useMigrateToLatestDataview()
  const hasPrivateDatasets = dataviewWithPrivateDatasets(dataview as UrlDataviewInstance)
  const mergedSourceOptions = hasPrivateDatasets ? [] : groupVmsSources(sourcesSelected)

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
            icon="update-required"
            type="update-required"
            loading={isMigrating}
            disabled={isMigrating}
            onClick={() => onMigrateDataviewClick(dataview)}
            tooltip={
              getIsDataviewMigrated(dataview)
                ? t((t) => t.workspace.deprecatedActivityLayerMigrated)
                : t((t) => t.workspace.deprecatedActivityLayer)
            }
            size="small"
          />
        )}
        {/* Rendering both so the unmerged one is visible in printing */}
        <TagList
          testId={SOURCE_TAG_TESTID}
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
