import React, { useEffect } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Spinner } from '@globalfishingwatch/ui-components'
import { Dataset } from '@globalfishingwatch/api-types/dist'
import { AsyncReducerStatus } from 'types'
import { selectUserDatasetsNotUsed } from 'features/user/user.selectors'
import { useDatasetModalConnect, useNewDatasetConnect } from './datasets.hook'
import styles from './NewDatasetTooltip.module.css'
import {
  fetchAllDatasetsThunk,
  selectAllDatasetsRequested,
  selectDatasetsStatus,
} from './datasets.slice'

function NewDatasetTooltip({ onSelect }: { onSelect?: (dataset?: Dataset) => void }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { dispatchDatasetModal } = useDatasetModalConnect()
  const { addNewDatasetToWorkspace } = useNewDatasetConnect()
  const datasets = useSelector(selectUserDatasetsNotUsed)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const allDatasetsRequested = useSelector(selectAllDatasetsRequested)

  useEffect(() => {
    if (!allDatasetsRequested) {
      dispatch(fetchAllDatasetsThunk())
    }
  }, [allDatasetsRequested, dispatch])

  const onAddNewClick = async () => {
    dispatchDatasetModal('new')
    if (onSelect) {
      onSelect()
    }
  }

  const onSelectClick = async (dataset: any) => {
    addNewDatasetToWorkspace(dataset)
    if (onSelect) {
      onSelect(dataset)
    }
  }

  return (
    <div className={styles.container}>
      <ul className={styles.listContainer}>
        <li className={cx(styles.dataset, styles.create)} onClick={onAddNewClick}>
          {t('dataset.uploadNewContex', 'Upload new context areas')}
        </li>
        {datasetsStatus === AsyncReducerStatus.Loading ? (
          <li className={styles.loadingPlaceholder}>
            <Spinner size="small" />
          </li>
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
