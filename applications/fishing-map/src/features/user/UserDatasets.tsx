import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { Dataset, DatasetStatus } from '@globalfishingwatch/api-types'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import EditDataset from 'features/datasets/EditDataset'
import { useDatasetModalConnect } from 'features/datasets/datasets.hook'
import {
  deleteDatasetThunk,
  selectDatasetsStatus,
  selectDatasetsStatusId,
} from 'features/datasets/datasets.slice'
import { AsyncReducerStatus } from 'types'
import styles from './User.module.css'
import { selectUserDatasets } from './user.selectors'

function UserDatasets() {
  const datasets = useSelector(selectUserDatasets)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const datasetStatusId = useSelector(selectDatasetsStatusId)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    datasetModal,
    editingDatasetId,
    dispatchDatasetModal,
    dispatchEditingDatasetId,
  } = useDatasetModalConnect()

  const onEditClick = useCallback(
    async (dataset: Dataset) => {
      dispatchEditingDatasetId(dataset.id)
      dispatchDatasetModal('edit')
    },
    [dispatchDatasetModal, dispatchEditingDatasetId]
  )

  const onDeleteClick = useCallback(
    async (dataset: Dataset) => {
      const confirmation = window.confirm(
        `${t(
          'dataset.confirmRemove',
          'Are you sure you want to permanently delete this dataset?'
        )}\n${dataset.name}`
      )
      if (confirmation) {
        dispatch(deleteDatasetThunk(dataset.id))
      }
    },
    [dispatch, t]
  )

  const loading = datasetsStatus === AsyncReducerStatus.Loading

  return (
    <div className={styles.views}>
      {datasetModal === 'edit' && editingDatasetId !== undefined && <EditDataset />}
      <div className={styles.viewsHeader}>
        <label>{t('dataset.title_plural', 'Datasets')}</label>
        <Button disabled={loading} type="secondary" onClick={() => dispatchDatasetModal('new')}>
          {t('dataset.new', 'New dataset') as string}
        </Button>
      </div>
      {loading ? (
        <div className={styles.placeholder}>
          <Spinner size="small" />
        </div>
      ) : (
        <ul>
          {datasets && datasets.length > 0 ? (
            datasets?.map((dataset) => {
              const datasetError = dataset.status === DatasetStatus.Error
              const datasetImporting = dataset.status === DatasetStatus.Importing
              let infoTooltip = dataset?.description
              if (datasetImporting) {
                infoTooltip = t('dataset.importing', 'Dataset is being imported')
              }
              if (datasetError) {
                infoTooltip = `${t(
                  'errors.uploadError',
                  'There was an error uploading your dataset'
                )} - ${dataset.importLogs}`
              }
              return (
                <li className={styles.dataset} key={dataset.id}>
                  {dataset.name}
                  <div>
                    <IconButton
                      icon={datasetError ? 'warning' : 'info'}
                      type={datasetError ? 'warning' : 'default'}
                      loading={datasetImporting}
                      tooltip={infoTooltip}
                    />
                    {!datasetImporting && !datasetError && (
                      <IconButton
                        icon="edit"
                        tooltip={t('dataset.edit', 'Edit dataset')}
                        onClick={() => onEditClick(dataset)}
                      />
                    )}
                    {!datasetImporting && (
                      <IconButton
                        icon="delete"
                        type="warning"
                        loading={dataset.id === datasetStatusId}
                        tooltip={t('dataset.remove', 'Remove dataset')}
                        onClick={() => onDeleteClick(dataset)}
                      />
                    )}
                  </div>
                </li>
              )
            })
          ) : (
            <div className={styles.placeholder}>
              {t('dataset.emptyState', 'Your datasets will appear here')}
            </div>
          )}
        </ul>
      )}
    </div>
  )
}

export default UserDatasets
