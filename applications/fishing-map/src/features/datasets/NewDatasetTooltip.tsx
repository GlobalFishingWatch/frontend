import React, { useEffect } from 'react'
import cx from 'classnames'
import { useTranslation, Trans } from 'react-i18next'
import { batch, useDispatch, useSelector } from 'react-redux'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { Dataset, DatasetCategory } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { AsyncReducerStatus } from 'utils/async-slice'
import { isGuestUser, selectUserDatasetsNotUsed } from 'features/user/user.selectors'
import { useDatasetModalConnect, useNewDatasetConnect } from './datasets.hook'
import styles from './NewDatasetTooltip.module.css'
import {
  fetchAllDatasetsThunk,
  selectAllDatasetsRequested,
  selectDatasetsStatus,
} from './datasets.slice'

interface NewDatasetTooltipProps {
  datasetCategory: DatasetCategory
  onSelect?: (dataset?: Dataset) => void
}

function NewDatasetTooltip({ onSelect, datasetCategory }: NewDatasetTooltipProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { dispatchDatasetModal, dispatchDatasetCategory } = useDatasetModalConnect()
  const { addNewDatasetToWorkspace } = useNewDatasetConnect()
  const datasets = useSelector(selectUserDatasetsNotUsed(datasetCategory))
  const guestuser = useSelector(isGuestUser)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const allDatasetsRequested = useSelector(selectAllDatasetsRequested)

  useEffect(() => {
    if (!allDatasetsRequested) {
      dispatch(fetchAllDatasetsThunk())
    }
  }, [allDatasetsRequested, dispatch])

  const onAddNewClick = async () => {
    batch(() => {
      dispatchDatasetModal('new')
      dispatchDatasetCategory(datasetCategory)
    })
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

  if (guestuser) {
    return (
      <div className={styles.container}>
        <div className={styles.contentPlaceholder}>
          <p>
            <Trans i18nKey="dataset.uploadLogin">
              You need to
              <a className={styles.link} href={GFWAPI.getLoginUrl(window.location.toString())}>
                login
              </a>
              to upload datasets
            </Trans>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <ul className={styles.listContainer}>
        <li className={cx(styles.dataset, styles.create)} onClick={onAddNewClick}>
          {datasetCategory === DatasetCategory.Context
            ? t('dataset.uploadNewContext', 'Upload new context areas')
            : t('dataset.uploadNewEnviroment', 'Upload new environment dataset')}
        </li>
        {datasetsStatus === AsyncReducerStatus.Loading ? (
          <li className={styles.loadingPlaceholder}>
            <Spinner size="small" />
          </li>
        ) : datasets?.length > 0 ? (
          datasets.map((dataset) => (
            <li key={dataset.id} className={styles.dataset} onClick={() => onSelectClick(dataset)}>
              {dataset.name}
            </li>
          ))
        ) : (
          <li className={cx(styles.dataset, styles.empty)}>
            {t('dataset.notUploadedYet', 'No context layers uploaded yet')}
          </li>
        )}
      </ul>
    </div>
  )
}

export default NewDatasetTooltip
