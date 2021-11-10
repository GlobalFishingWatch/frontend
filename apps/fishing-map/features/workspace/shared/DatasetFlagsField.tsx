import React from 'react'
import { useTranslation } from 'react-i18next'
import { TagList } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getFlagsByIds } from 'utils/flags'
import styles from 'features/workspace/shared/LayerPanel.module.css'

type DatasetFlagFieldProps = {
  dataview: UrlDataviewInstance
  showWhenEmpty?: boolean
}

function DatasetFlagField({ dataview, showWhenEmpty = false }: DatasetFlagFieldProps) {
  const { t } = useTranslation()
  let fishingFiltersOptions = getFlagsByIds(dataview.config?.filters?.flag || [])

  if (!fishingFiltersOptions?.length) {
    if (showWhenEmpty) {
      fishingFiltersOptions = [
        {
          id: 'all',
          label: 'All',
        },
      ]
    } else return null
  }

  return (
    <div className={styles.filter}>
      <label>{t('layer.flagState_other', 'Flag States')}</label>
      <TagList
        tags={fishingFiltersOptions}
        color={dataview.config?.color}
        className={styles.tagList}
      />
    </div>
  )
}

export default DatasetFlagField
