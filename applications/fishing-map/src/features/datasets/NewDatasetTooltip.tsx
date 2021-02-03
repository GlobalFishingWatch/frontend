import React, { useEffect } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner } from '@globalfishingwatch/ui-components'
import { Dataset } from '@globalfishingwatch/api-types/dist'
import { selectContextAreasDataviews } from 'features/workspace/workspace.selectors'
import { getContextDataviewInstance } from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { AsyncReducerStatus } from 'types'
import { fetchUserDatasetsThunk, selectUserDatasetsStatus } from 'features/user/user.slice'
import { selectUserDatasets } from 'features/user/user.selectors'
import { useDatasetModalConnect } from './datasets.hook'
import styles from './NewDatasetTooltip.module.css'

function NewDatasetTooltip({ onSelect }: { onSelect?: (dataset: Dataset) => void }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { dispatchDatasetModal } = useDatasetModalConnect()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const datasets = useSelector(selectUserDatasets)
  const dataviews = useSelector(selectContextAreasDataviews)
  const datasetsStatus = useSelector(selectUserDatasetsStatus)

  useEffect(() => {
    if (datasetsStatus === AsyncReducerStatus.Idle) {
      dispatch(fetchUserDatasetsThunk())
    }
  }, [datasetsStatus, dispatch])

  const onAddNewClick = async () => {
    dispatchDatasetModal('new')
  }

  const onSelectClick = async (dataset: any) => {
    const usedColors = dataviews?.flatMap((dataview) => dataview.config?.color || [])

    const dataviewInstance = getContextDataviewInstance(dataset.id, usedColors)
    upsertDataviewInstance(dataviewInstance)
    if (onSelect) {
      onSelect(dataset)
    }
  }

  return (
    <div className={styles.container}>
      <ul>
        <li className={cx(styles.dataset, styles.create)} onClick={onAddNewClick}>
          {t('dataset.uploadNewContex', 'Upload new context areas')}
        </li>
        {datasetsStatus === AsyncReducerStatus.Loading ? (
          <div className={styles.loadingPlaceholder}>
            <Spinner size="small" />
          </div>
        ) : (
          datasets?.map((dataset) => (
            <li key={dataset.id} className={styles.dataset} onClick={() => onSelectClick(dataset)}>
              {dataset.name}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default NewDatasetTooltip
