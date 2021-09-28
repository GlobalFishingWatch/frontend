import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import Button from '@globalfishingwatch/ui-components/src/button'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'
import { Dataset, DatasetCategory, DatasetStatus } from '@globalfishingwatch/api-types'
import Spinner from '@globalfishingwatch/ui-components/src/spinner'
import { useDatasetModalConnect } from 'features/datasets/datasets.hook'
import {
  deleteDatasetThunk,
  selectDatasetsStatus,
  selectDatasetsStatusId,
} from 'features/datasets/datasets.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import InfoError from 'features/workspace/common/InfoError'
import styles from './User.module.css'
import { selectUserDatasetsByCategory } from './user.selectors'

interface UserDatasetsProps {
  datasetCategory: DatasetCategory
}

function UserDatasets({ datasetCategory }: UserDatasetsProps) {
  const datasets = useSelector(selectUserDatasetsByCategory(datasetCategory))
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const datasetStatusId = useSelector(selectDatasetsStatusId)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { dispatchDatasetModal, dispatchDatasetCategory, dispatchEditingDatasetId } =
    useDatasetModalConnect()

  const onNewDatasetClick = useCallback(async () => {
    batch(() => {
      dispatchDatasetModal('new')
      dispatchDatasetCategory(datasetCategory)
    })
  }, [datasetCategory, dispatchDatasetModal, dispatchDatasetCategory])

  const onEditClick = useCallback(
    async (dataset: Dataset) => {
      batch(() => {
        dispatchDatasetModal('edit')
        dispatchEditingDatasetId(dataset.id)
        dispatchDatasetCategory(datasetCategory)
      })
    },
    [datasetCategory, dispatchDatasetModal, dispatchDatasetCategory, dispatchEditingDatasetId]
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
      <div className={styles.viewsHeader}>
        <label>
          {datasetCategory === DatasetCategory.Context
            ? t('common.context_area_other', 'Context areas')
            : t('common.environment', 'Environment')}
        </label>
        <Button disabled={loading} type="secondary" onClick={onNewDatasetClick}>
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
                    <InfoError
                      error={datasetError}
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
                    <IconButton
                      icon="delete"
                      type="warning"
                      loading={dataset.id === datasetStatusId}
                      tooltip={t('dataset.remove', 'Remove dataset')}
                      onClick={() => onDeleteClick(dataset)}
                    />
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
