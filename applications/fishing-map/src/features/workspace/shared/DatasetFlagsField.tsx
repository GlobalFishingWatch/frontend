import React from 'react'
import { useTranslation } from 'react-i18next'
import TagList from '@globalfishingwatch/ui-components/dist/tag-list'
import { getFlagsByIds } from 'utils/flags'
import { UrlDataviewInstance } from 'types'
import styles from 'features/workspace/shared/LayerPanel.module.css'

type DatasetFlagFieldProps = {
  dataview: UrlDataviewInstance
}

function DatasetFlagField({ dataview }: DatasetFlagFieldProps) {
  const { t } = useTranslation()
  const fishingFiltersOptions = getFlagsByIds(dataview.config?.filters?.flag || [])

  if (!fishingFiltersOptions?.length) {
    return null
  }

  return (
    <div className={styles.filter}>
      <label>{t('layer.flagState_plural', 'Flag States')}</label>
      <TagList
        tags={fishingFiltersOptions}
        color={dataview.config?.color}
        className={styles.tagList}
      />
    </div>
  )
}

export default DatasetFlagField
