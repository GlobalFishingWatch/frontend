import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetStatus } from '@globalfishingwatch/api-types'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import {
  Button,
  Choice,
  Icon,
  IconButton,
  InputText,
  Spinner,
} from '@globalfishingwatch/ui-components'

import {
  getDataviewInstanceByDataset,
  useDatasetModalConfigConnect,
  useDatasetModalOpenConnect,
} from 'features/_map/datasets/datasets.hook'
import {
  deleteDatasetThunk,
  fetchAllDatasetsThunk,
  fetchDatasetsByIdsThunk,
  selectDatasetsStatusId,
} from 'features/_map/datasets/datasets.slice'
import {
  getDatasetLabel,
  getDatasetTypeIcon,
  getGeometryTypeLabel,
  groupDatasetsByGeometryType,
} from 'features/_map/datasets/datasets.utils'
import InfoError from 'features/_map/workspace/shared/InfoError'
import { selectLastVisitedWorkspace } from 'features/_map/workspace/workspace.selectors'
import { selectUserDatasets } from 'features/_user/selectors/user.permissions.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { ROUTE_PATHS } from 'router/routes.utils'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getTimeAgo, getUTCDateTime, sortByCreationDate } from 'utils/dates'
import { getHighlightedText } from 'utils/text'

import styles from './User.module.css'

const ALL_TYPES_OPTION_ID = 'all'

function UserDatasets() {
  const datasets = useSelector(selectUserDatasets)
  const datasetStatusId = useSelector(selectDatasetsStatusId)
  const lastVisitedWorkspace = useSelector(selectLastVisitedWorkspace)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { dispatchDatasetModalOpen } = useDatasetModalOpenConnect()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()
  const [searchQuery, setSearchQuery] = useState('')
  const [geometryTypeFilter, setGeometryTypeFilter] = useState(ALL_TYPES_OPTION_ID)

  const datasetsByGeometryType = useMemo(() => groupDatasetsByGeometryType(datasets), [datasets])

  const geometryTypeOptions: ChoiceOption[] = useMemo(
    () => [
      { id: ALL_TYPES_OPTION_ID, label: t((t) => t.selects.allSelected) },
      ...Object.entries(datasetsByGeometryType)
        .filter(([, geometryDatasets]) => geometryDatasets.length > 0)
        .map(([geometryType]) => ({ id: geometryType, label: getGeometryTypeLabel(geometryType) })),
    ],
    [datasetsByGeometryType, t]
  )

  const filteredDatasets = useMemo(
    () =>
      geometryTypeFilter === ALL_TYPES_OPTION_ID
        ? datasets
        : datasetsByGeometryType[geometryTypeFilter] || [],
    [datasets, datasetsByGeometryType, geometryTypeFilter]
  )

  // The slice status is global, so on mount it reads Idle/Finished from whatever fetched datasets
  // last and the empty state flashes before this component's own request even starts
  const [fetchStatus, setFetchStatus] = useState<AsyncReducerStatus>(AsyncReducerStatus.Loading)

  const fetchDatasets = useCallback(() => {
    dispatch(fetchAllDatasetsThunk({ fetchUserDatasetsMode: 'user-only' })).then((action) => {
      // ponytail: a duplicate dispatch is skipped by the thunk's `condition` and the in-flight one
      // settles the status. Holds while this is the only 'user-only' caller mounted on the route —
      // if another component starts fetching it too, this one would sit on the spinner
      if (fetchAllDatasetsThunk.rejected.match(action) && action.meta.condition) {
        return
      }
      // fetchAllDatasetsThunk fulfills even when the request fails — it just forwards the inner
      // action — so a rejection is only visible in the payload
      const failed =
        fetchAllDatasetsThunk.rejected.match(action) ||
        fetchDatasetsByIdsThunk.rejected.match(action.payload)
      setFetchStatus(failed ? AsyncReducerStatus.Error : AsyncReducerStatus.Finished)
    })
  }, [dispatch])

  useEffect(() => {
    fetchDatasets()
  }, [fetchDatasets])

  const onRetryFetch = useCallback(() => {
    setFetchStatus(AsyncReducerStatus.Loading)
    fetchDatasets()
  }, [fetchDatasets])

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
        to = ROUTE_PATHS.MAP,
        params,
        search = { dataviewInstances: [] },
      } = lastVisitedWorkspace || {}

      router.navigate({
        to,
        params,
        search: {
          ...search,
          dataviewInstances: [...(search.dataviewInstances || []), dataviewInstanceWithDataset],
        },
      })
    },
    [lastVisitedWorkspace, router]
  )

  const onEditClick = useCallback(
    (dataset: Dataset) => {
      dispatchDatasetModalOpen(true)
      dispatchDatasetModalConfig({
        id: dataset?.id,
        type: getDatasetConfigurationProperty({ dataset, property: 'geometryType' }),
      })
    },
    [dispatchDatasetModalOpen, dispatchDatasetModalConfig]
  )

  const onDeleteClick = useCallback(
    (dataset: Dataset) => {
      const confirmation = window.confirm(`${t((t) => t.dataset.confirmRemove)}\n${dataset.name}`)
      if (confirmation) {
        dispatch(deleteDatasetThunk(dataset.id))
      }
    },
    [dispatch, t]
  )

  const loading = fetchStatus === AsyncReducerStatus.Loading
  const fetchError = fetchStatus === AsyncReducerStatus.Error

  return (
    <Fragment>
      <div className={styles.search}>
        <InputText
          className={styles.searchInput}
          type="search"
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search"
        />
        <Choice
          containerClassName={styles.searchTypeFilter}
          options={geometryTypeOptions}
          activeOption={geometryTypeFilter}
          onSelect={(option) => setGeometryTypeFilter(option.id)}
          testId="user-datasets-type-filter"
        />
      </div>
      <div className={styles.views}>
        <div className={styles.viewsHeader}>
          <label>{t((t) => t.user.datasets)}</label>
          <Button disabled={loading} type="secondary" onClick={onNewDatasetClick}>
            {t((t) => t.dataset.new) as string}
          </Button>
        </div>
        {loading ? (
          <div className={styles.placeholder} data-testid="datasets-spinner">
            <Spinner size="small" />
          </div>
        ) : (
          <Fragment>
            {fetchError && (
              <div className={styles.placeholder}>
                {t((t) => t.dataset.loadError)}{' '}
                <button className={styles.link} onClick={onRetryFetch}>
                  {t((t) => t.dataset.loadRetry)}
                </button>
              </div>
            )}
            <ul>
              {filteredDatasets.length > 0 ? (
                sortByCreationDate<Dataset>(filteredDatasets).map((dataset) => {
                  const label = getDatasetLabel(dataset)
                  if (!label.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return null
                  }
                  const datasetError = dataset.status === DatasetStatus.Error
                  const datasetImporting = dataset.status === DatasetStatus.Importing
                  const importLogs =
                    getDatasetConfiguration(dataset, 'userContextLayerV1').importLogs || ''
                  const infoTooltip: string = datasetImporting
                    ? t((t) => t.dataset.importing)
                    : datasetError
                      ? `${t((t) => t.errors.uploadError)} ${importLogs ? `- ${importLogs}` : ''}`
                      : ''
                  const datasetIcon = getDatasetTypeIcon(dataset)
                  const createdAgo = dataset.createdAt
                    ? getTimeAgo(getUTCDateTime(dataset.createdAt), t)
                    : ''
                  return (
                    <li className={styles.dataset} key={dataset.id}>
                      <span>
                        <span className={styles.datasetName}>
                          {datasetIcon && (
                            <Icon icon={datasetIcon} style={{ transform: 'translateY(25%)' }} />
                          )}
                          {getHighlightedText(label as string, searchQuery, styles)}
                        </span>
                        <span className={styles.datasetMeta}>{createdAgo}</span>
                      </span>
                      <div>
                        {!datasetError && (
                          <IconButton
                            icon="arrow-right"
                            onClick={() => onDatasetClick(dataset)}
                            tooltip={t((t) => t.user.seeDataset)}
                          />
                        )}
                        {(datasetError || datasetImporting) && (
                          <InfoError
                            size="default"
                            error={datasetError}
                            loading={datasetImporting}
                            tooltip={infoTooltip}
                          />
                        )}
                        {!datasetImporting && !datasetError && (
                          <IconButton
                            icon="edit"
                            tooltip={t((t) => t.dataset.edit)}
                            onClick={() => onEditClick(dataset)}
                          />
                        )}
                        <IconButton
                          testId={`delete-dataset-${dataset.id}`}
                          icon="delete"
                          type="warning"
                          loading={dataset.id === datasetStatusId}
                          tooltip={t((t) => t.dataset.remove)}
                          onClick={() => onDeleteClick(dataset)}
                        />
                      </div>
                    </li>
                  )
                })
              ) : fetchError ? null : (
                // "no datasets yet" would contradict the error above
                <div className={styles.placeholder}>{t((t) => t.dataset.emptyState)}</div>
              )}
            </ul>
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

export default UserDatasets
