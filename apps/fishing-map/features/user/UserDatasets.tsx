import { useTranslation } from 'react-i18next'
import ReactHtmlParser from 'react-html-parser'
import React, { Fragment, useCallback, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { Button, Spinner, IconButton, Modal } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetCategory, DatasetStatus } from '@globalfishingwatch/api-types'
import { useDatasetModalConnect } from 'features/datasets/datasets.hook'
import {
  deleteDatasetThunk,
  selectDatasetsStatus,
  selectDatasetsStatusId,
} from 'features/datasets/datasets.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import InfoError from 'features/workspace/common/InfoError'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { isGFWUser } from 'features/user/user.slice'
import { getDatasetQueriesArray } from 'features/workspace/common/InfoModal'
import infoModalStyles from 'features/workspace/common/InfoModal.module.css'
import styles from './User.module.css'
import { selectUserDatasetsByCategory } from './user.selectors'

interface UserDatasetsProps {
  datasetCategory: DatasetCategory
}

function UserDatasets({ datasetCategory }: UserDatasetsProps) {
  const [infoDataset, setInfoDataset] = useState<Dataset | undefined>()
  const datasets = useSelector(selectUserDatasetsByCategory(datasetCategory))
  const gfwUser = useSelector(isGFWUser)
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

  const onInfoClick = useCallback((dataset: Dataset) => {
    setInfoDataset(dataset)
  }, [])

  const onEditClick = useCallback(
    (dataset: Dataset) => {
      batch(() => {
        dispatchDatasetModal('edit')
        dispatchEditingDatasetId(dataset.id)
        dispatchDatasetCategory(datasetCategory)
      })
    },
    [datasetCategory, dispatchDatasetModal, dispatchDatasetCategory, dispatchEditingDatasetId]
  )

  const onDeleteClick = useCallback(
    (dataset: Dataset) => {
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
  const infoDatasetQueries = getDatasetQueriesArray(infoDataset)

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
              let infoTooltip = t(`layer.seeDescription`, 'Click to see layer description')
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
                      onClick={() => onInfoClick(dataset)}
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
      <Modal
        appSelector="__next"
        title={getDatasetLabel(infoDataset)}
        isOpen={infoDataset !== undefined}
        onClose={() => setInfoDataset(undefined)}
      >
        <Fragment>
          <p className={infoModalStyles.content}>
            {/**
             * For security reasons, we are only parsing html
             * coming from translated descriptions
             **/}
            {infoDataset?.description.length > 0
              ? ReactHtmlParser(infoDataset.description)
              : infoDataset?.description}
          </p>
          {gfwUser && infoDatasetQueries && (
            <div className={infoModalStyles.content}>
              <h2 className={infoModalStyles.subtitle}>Queries used</h2>
              {infoDatasetQueries?.map((query: string, index: number) => (
                <div key={index}>
                  <a target="_blank" href={query} rel="noreferrer">
                    query {index + 1}
                  </a>
                </div>
              ))}
            </div>
          )}
        </Fragment>
      </Modal>
    </div>
  )
}

export default UserDatasets
