import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { Dataset, DatasetGeometryType } from '@globalfishingwatch/api-types'
import { DatasetStatus } from '@globalfishingwatch/api-types'
import {
  Button,
  Icon,
  IconButton,
  InputText,
  Modal,
  Spinner,
} from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import DatasetLabel from 'features/datasets/DatasetLabel'
import {
  getDataviewInstanceByDataset,
  useDatasetModalConfigConnect,
  useDatasetModalOpenConnect,
} from 'features/datasets/datasets.hook'
import {
  deleteDatasetThunk,
  selectDatasetsStatus,
  selectDatasetsStatusId,
} from 'features/datasets/datasets.slice'
import { getDatasetLabel, getDatasetTypeIcon } from 'features/datasets/datasets.utils'
import { selectUserDatasets } from 'features/user/selectors/user.permissions.selectors'
import InfoError from 'features/workspace/shared/InfoError'
import InfoModalContent from 'features/workspace/shared/InfoModalContent'
import { selectLastVisitedWorkspace } from 'features/workspace/workspace.selectors'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { AsyncReducerStatus } from 'utils/async-slice'
import { sortByCreationDate } from 'utils/dates'
import { getHighlightedText } from 'utils/text'

import styles from './User.module.css'

function UserDatasets() {
  const [infoDataset, setInfoDataset] = useState<Dataset | undefined>()
  const datasets = useSelector(selectUserDatasets)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const datasetStatusId = useSelector(selectDatasetsStatusId)
  const lastVisitedWorkspace = useSelector(selectLastVisitedWorkspace)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchDatasetModalOpen } = useDatasetModalOpenConnect()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()
  const [searchQuery, setSearchQuery] = useState('')

  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const onNewDatasetClick = useCallback(async () => {
    dispatchDatasetModalOpen(true)
  }, [dispatchDatasetModalOpen])

  const onDatasetClick = useCallback(
    (dataset: Dataset) => {
      const dataviewInstanceWithDataset = getDataviewInstanceByDataset(dataset)
      if (!dataviewInstanceWithDataset) {
        return
      }
      const {
        type = HOME,
        query = { dataviewInstances: [] },
        payload = {},
      } = lastVisitedWorkspace || {}
      const locationParams = {
        payload,
        query: {
          ...query,
          dataviewInstances: [...(query.dataviewInstances || []), dataviewInstanceWithDataset],
        },
        replaceQuery: false,
      }
      dispatch(updateLocation(type, locationParams))
    },
    [dispatch, lastVisitedWorkspace]
  )

  const onInfoClick = useCallback((dataset: Dataset) => {
    setInfoDataset(dataset)
  }, [])

  const onEditClick = useCallback(
    (dataset: Dataset) => {
      dispatchDatasetModalOpen(true)
      dispatchDatasetModalConfig({
        id: dataset?.id,
        type:
          (dataset?.configuration?.configurationUI?.geometryType as DatasetGeometryType) ||
          dataset?.configuration?.geometryType,
      })
    },
    [dispatchDatasetModalOpen, dispatchDatasetModalConfig]
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

  return (
    <Fragment>
      <div className={styles.search}>
        <InputText
          type="search"
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search"
        />
      </div>
      <div className={styles.views}>
        <div className={styles.viewsHeader}>
          <label>{t('user.datasets', 'User datasets')}</label>
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
              sortByCreationDate<Dataset>(datasets).map((dataset) => {
                const label = getDatasetLabel(dataset)
                if (!label.toLowerCase().includes(searchQuery.toLowerCase())) {
                  return null
                }
                const datasetError = dataset.status === DatasetStatus.Error
                const datasetImporting = dataset.status === DatasetStatus.Importing
                const datasetDescription = dataset.description !== dataset.name
                let infoTooltip: string = t(
                  `layer.seeDescription`,
                  'Click to see layer description'
                )
                if (datasetImporting) {
                  infoTooltip = t('dataset.importing', 'Dataset is being imported')
                }
                if (datasetError) {
                  infoTooltip = `${t(
                    'errors.uploadError',
                    'There was an error uploading your dataset'
                  )} - ${dataset.importLogs}`
                }
                const datasetIcon = getDatasetTypeIcon(dataset)
                return (
                  <li className={styles.dataset} key={dataset.id}>
                    <span>
                      {datasetIcon && (
                        <Icon icon={datasetIcon} style={{ transform: 'translateY(25%)' }} />
                      )}
                      {getHighlightedText(label as string, searchQuery, styles)}
                    </span>
                    <div>
                      {!datasetError && (
                        <IconButton
                          icon="arrow-right"
                          onClick={() => onDatasetClick(dataset)}
                          tooltip={t('user.seeDataset', 'See on map')}
                        />
                      )}
                      {(datasetError || datasetDescription) && (
                        <InfoError
                          error={datasetError}
                          loading={datasetImporting}
                          tooltip={infoTooltip}
                          onClick={() => !datasetError && onInfoClick(dataset)}
                        />
                      )}
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
          appSelector={ROOT_DOM_ELEMENT}
          title={<DatasetLabel dataset={infoDataset} />}
          isOpen={infoDataset !== undefined}
          onClose={() => setInfoDataset(undefined)}
        >
          {infoDataset && <InfoModalContent dataset={infoDataset} />}
        </Modal>
      </div>
    </Fragment>
  )
}

export default UserDatasets
