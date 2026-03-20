import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { VesselGroup, VesselGroupVessel } from '@globalfishingwatch/api-types'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import {
  Button,
  Icon,
  IconButton,
  InputDate,
  InputText,
  Modal,
  MultiSelect,
  Spinner,
  SwitchRow,
} from '@globalfishingwatch/ui-components'

import { AVAILABLE_END, AVAILABLE_START, ROOT_DOM_ELEMENT } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectVesselGroupCompatibleDatasets } from 'features/datasets/datasets.selectors'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectPresenceDataview } from 'features/dataviews/selectors/dataviews.static.selectors'
import UserGuideLink from 'features/help/UserGuideLink'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { getVesselGroupDataviewInstance } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import {
  fetchVesselGroupReportThunk,
  resetVesselGroupReportData,
} from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { selectSearchQuery } from 'features/search/search.config.selectors'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import {
  selectHasVesselGroupSearchVessels,
  selectHasVesselGroupVesselsOverflow,
  selectVesselGroupModalDatasetsWithoutEventsRelated,
  selectVesselGroupsModalSearchIds,
  selectVesselGroupWorkspaceToNavigate,
  selectWorkspaceVessselGroupsIds,
} from 'features/vessel-groups/vessel-groups.selectors'
import VesselGroupSearch from 'features/vessel-groups/VesselGroupModalSearch'
import VesselGroupVessels from 'features/vessel-groups/VesselGroupModalVessels'
import {
  mergeDataviewIntancesToUpsert,
  useDataviewInstancesConnect,
} from 'features/workspace/workspace.hook'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'
import { type ROUTE_TYPES, SEARCH, VESSEL_GROUP_REPORT, WORKSPACE_SEARCH } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { useLocationConnect } from 'routes/routes.hook'
import { selectIsVesselGroupReportLocation, selectLocationQuery } from 'routes/routes.selectors'
import { getEventLabel } from 'utils/analytics'
import { AsyncReducerStatus } from 'utils/async-slice'
import { listAsSentence } from 'utils/shared'

import type { IdField, UpdateVesselGroupThunkParams } from './vessel-groups.slice'
import {
  createVesselGroupThunk,
  resetVesselGroupStatus,
  selectVesselGroupById,
  selectVesselGroupsError,
  selectVesselGroupsStatus,
  updateVesselGroupVesselsThunk,
} from './vessel-groups.slice'
import {
  calculateVMSVesselsPercentage,
  getVesselGroupUniqVessels,
  getVesselGroupVesselsCount,
} from './vessel-groups.utils'
import type { VesselGroupConfirmationMode, VesselGroupCsvData } from './vessel-groups-modal.slice'
import {
  getVesselInVesselGroupThunk,
  MAX_VESSEL_GROUP_VESSELS,
  resetVesselGroupModal,
  resetVesselGroupModalSearchStatus,
  searchVesselGroupsVesselsThunk,
  selectIsOwnedByUser,
  selectVesselGroupConfirmationMode,
  selectVesselGroupEditId,
  selectVesselGroupModalCsvColumns,
  selectVesselGroupModalCsvData,
  selectVesselGroupModalName,
  selectVesselGroupModalOpen,
  selectVesselGroupModalSearchIdField,
  selectVesselGroupModalSources,
  selectVesselGroupModalVessels,
  selectVesselGroupSearchStatus,
  setVesselGroupModalName,
  setVesselGroupModalSources,
  setVesselGroupModalVessels,
} from './vessel-groups-modal.slice'

import styles from './VesselGroupModal.module.css'

function VesselGroupModal(): React.ReactElement<any> {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [buttonLoading, setButtonLoading] = useState<VesselGroupConfirmationMode | ''>('')
  const isModalOpen = useSelector(selectVesselGroupModalOpen)
  const confirmationMode = useSelector(selectVesselGroupConfirmationMode)
  const searchIdField = useSelector(selectVesselGroupModalSearchIdField)
  const csvData = useSelector(selectVesselGroupModalCsvData)
  const selectedCsvColumns = useSelector(selectVesselGroupModalCsvColumns)
  const editingVesselGroupId = useSelector(selectVesselGroupEditId)
  const userIsVesselGroupOwner = useSelector(selectIsOwnedByUser)
  const vesselGroupModalSearchIds = useSelector(selectVesselGroupsModalSearchIds)
  const editingVesselGroup = useSelector(selectVesselGroupById(editingVesselGroupId as string))
  const searchVesselStatus = useSelector(selectVesselGroupSearchStatus)
  const vesselGroupsStatus = useSelector(selectVesselGroupsStatus)
  const vesselGroupsError = useSelector(selectVesselGroupsError)
  const workspaceToNavigate = useSelector(selectVesselGroupWorkspaceToNavigate)
  const searchQuery = useSelector(selectSearchQuery)
  const loading =
    searchVesselStatus === AsyncReducerStatus.Loading ||
    vesselGroupsStatus === AsyncReducerStatus.Loading ||
    vesselGroupsStatus === AsyncReducerStatus.LoadingUpdate
  const fullModalLoading = searchVesselStatus === AsyncReducerStatus.Loading
  const vesselGroupAPIError =
    vesselGroupsStatus === AsyncReducerStatus.Error ||
    searchVesselStatus === AsyncReducerStatus.Error
  const [error, setError] = useState('')

  const groupName = useSelector(selectVesselGroupModalName)
  const [showBackButton, setShowBackButton] = useState(false)
  const [createAsPublic, setCreateAsPublic] = useState(true)
  const [transmissionDateFrom, setTransmissionDateFrom] = useState<string>('')
  const [transmissionDateTo, setTransmissionDateTo] = useState<string>('')
  const vesselGroupVessels = useSelector(selectVesselGroupModalVessels)
  const hasVesselsOverflow = useSelector(selectHasVesselGroupVesselsOverflow)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const hasVesselGroupsVessels = useSelector(selectHasVesselGroupSearchVessels)
  const vesselGroupsInWorkspace = useSelector(selectWorkspaceVessselGroupsIds)
  const presenceDataview = useSelector(selectPresenceDataview)
  const query = useSelector(selectLocationQuery)
  const datasetsWithoutRelatedEvents = useSelector(
    selectVesselGroupModalDatasetsWithoutEventsRelated
  )
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const searchVesselGroupsVesselsRef = useRef<any>(undefined)
  const searchVesselGroupsVesselsAllowed = vesselGroupModalSearchIds
    ? vesselGroupModalSearchIds?.length < MAX_VESSEL_GROUP_VESSELS
    : true

  const workspace = useSelector(selectWorkspace)
  const { dispatchLocation } = useLocationConnect()

  const vesselDatasets = useSelector(selectVesselGroupCompatibleDatasets)

  useEffect(() => {
    if (editingVesselGroup?.name) {
      dispatch(setVesselGroupModalName(editingVesselGroup?.name))
    }
  }, [editingVesselGroup?.name])

  const sourceOptions = useMemo(
    () =>
      vesselDatasets.map((d) => ({
        id: d.id,
        label: getDatasetLabel(d),
      })),
    [vesselDatasets]
  )
  const vesselGroupModalSources = useSelector(selectVesselGroupModalSources)

  const sourcesSelected = useMemo(
    () => sourceOptions.filter((s) => vesselGroupModalSources?.includes(s.id)),
    [sourceOptions, vesselGroupModalSources]
  )

  const setGroupName = useCallback(
    (name: string) => {
      dispatch(setVesselGroupModalName(name))
    },
    [dispatch]
  )

  const setSourcesSelected = useCallback(
    (sources: string[]) => {
      dispatch(setVesselGroupModalSources(sources))
    },
    [dispatch]
  )

  const onSelectSourceClick = useCallback(
    (source: SelectOption) => {
      setSourcesSelected([...(vesselGroupModalSources || []), source.id])
    },
    [setSourcesSelected, vesselGroupModalSources]
  )

  const onRemoveSourceClick = useCallback(
    (source: SelectOption) => {
      setSourcesSelected((vesselGroupModalSources || []).filter((s) => s !== source.id))
    },
    [setSourcesSelected, vesselGroupModalSources]
  )

  const dispatchSearchVesselsGroupsThunk = useCallback(
    async ({
      ids,
      idField,
      csvData,
      csvColumns,
    }: {
      ids?: string[]
      idField?: IdField
      csvData?: VesselGroupCsvData[]
      csvColumns?: string[]
    }) => {
      const datasets = sourcesSelected.length
        ? sourcesSelected.map(({ id }) => id)
        : sourceOptions.map(({ id }) => id)
      searchVesselGroupsVesselsRef.current = dispatch(
        searchVesselGroupsVesselsThunk({
          ids,
          idField,
          csvData,
          csvColumns,
          datasets,
          transmissionDateFrom,
          transmissionDateTo,
        })
      )
      const action = await searchVesselGroupsVesselsRef.current
      if (searchVesselGroupsVesselsThunk.fulfilled.match(action)) {
        if (action.payload?.length) {
          setError('')
          setShowBackButton(true)
        } else {
          setError(t((t) => t.vesselGroup.searchNotFound))
        }
      } else {
        setError((action.payload as any)?.message || '')
      }
    },
    [dispatch, sourcesSelected, sourceOptions, t, transmissionDateFrom, transmissionDateTo]
  )

  useEffect(() => {
    if (editingVesselGroup && editingVesselGroup.vessels?.length > 0) {
      dispatch(getVesselInVesselGroupThunk({ vesselGroup: editingVesselGroup }))
    }
  }, [dispatch, editingVesselGroup])

  useEffect(() => {
    if (!hasVesselGroupsVessels && showBackButton) {
      setShowBackButton(false)
    }
  }, [showBackButton, hasVesselGroupsVessels])

  const onGroupNameChange = useCallback(
    (e: any) => {
      setGroupName(e.target.value)
    },
    [setGroupName]
  )

  const abortSearch = useCallback(() => {
    if (searchVesselGroupsVesselsRef.current?.abort) {
      searchVesselGroupsVesselsRef.current.abort()
    }
  }, [])

  const close = useCallback(() => {
    setError('')
    setGroupName('')
    dispatch(resetVesselGroupModal())
    dispatch(resetVesselGroupStatus(''))
    abortSearch()
  }, [abortSearch, dispatch, setGroupName])

  const onBackClick = useCallback(
    (action: 'back' | 'close' = 'back') => {
      const confirmed = hasVesselGroupsVessels
        ? window.confirm(t((t) => t.vesselGroup.confirmAbort))
        : true
      if (confirmed) {
        if (action === 'back') {
          setError('')
          dispatch(setVesselGroupModalVessels(null))
          dispatch(resetVesselGroupModalSearchStatus())
          abortSearch()
          setShowBackButton(false)
        } else {
          close()
        }
      }
    },
    [hasVesselGroupsVessels, t, dispatch, abortSearch, close]
  )

  const onSearchVesselsClick = useCallback(async () => {
    if (vesselGroupModalSearchIds?.length && searchIdField) {
      dispatchSearchVesselsGroupsThunk({ ids: vesselGroupModalSearchIds, idField: searchIdField })
    }
    if (csvData?.length && selectedCsvColumns?.length) {
      dispatchSearchVesselsGroupsThunk({ csvData, csvColumns: selectedCsvColumns })
    }
  }, [
    dispatchSearchVesselsGroupsThunk,
    vesselGroupModalSearchIds,
    searchIdField,
    csvData,
    selectedCsvColumns,
  ])

  const onCreateGroupClick = useCallback(
    async (
      e: React.MouseEvent<Element, MouseEvent>,
      { addToDataviews = true, removeVessels = false, navigateToWorkspace = false } = {}
    ) => {
      setButtonLoading(navigateToWorkspace ? 'saveAndSeeInWorkspace' : 'save')
      const vessels: VesselGroupVessel[] = getVesselGroupUniqVessels(vesselGroupVessels)
      let dispatchedAction
      if (editingVesselGroupId && userIsVesselGroupOwner) {
        const vesselGroup: UpdateVesselGroupThunkParams = {
          id: editingVesselGroupId,
          name: groupName,
          vessels,
          override: true,
        }
        dispatchedAction = await dispatch(updateVesselGroupVesselsThunk(vesselGroup))
      } else {
        const vesselGroup = {
          name: groupName,
          vessels,
          public: createAsPublic,
        }
        dispatchedAction = await dispatch(createVesselGroupThunk(vesselGroup))
      }
      if (
        updateVesselGroupVesselsThunk.fulfilled.match(dispatchedAction) ||
        createVesselGroupThunk.fulfilled.match(dispatchedAction)
      ) {
        const vesselGroupId = updateVesselGroupVesselsThunk.fulfilled.match(dispatchedAction)
          ? (dispatchedAction.payload?.payload as VesselGroup)?.id
          : dispatchedAction.payload?.id
        const isVesselGroupInWorkspace = vesselGroupsInWorkspace.includes(vesselGroupId)
        const presenceDatasets = presenceDataview?.datasetsConfig?.map(
          (dataset) => dataset.datasetId
        )
        const dataviewInstance = !isVesselGroupInWorkspace
          ? getVesselGroupDataviewInstance(vesselGroupId, presenceDatasets)
          : undefined

        if (isVesselGroupReportLocation && vesselGroupId !== editingVesselGroupId) {
          dispatch(
            updateLocation(VESSEL_GROUP_REPORT, {
              payload: {
                category: workspace?.category,
                workspaceId: workspace?.id,
                vesselGroupId: vesselGroupId,
              },
              query,
            })
          )
        } else if (navigateToWorkspace && dataviewInstance) {
          if (workspaceToNavigate) {
            const { type, ...rest } = workspaceToNavigate
            const { query, payload } = rest
            const dataviewInstancesMerged = mergeDataviewIntancesToUpsert(
              dataviewInstance,
              rest.query.dataviewInstances!
            )

            dispatch(
              updateLocation(type as ROUTE_TYPES, {
                query: { ...query, dataviewInstances: dataviewInstancesMerged },
                payload,
              })
            )
            dispatch(setWorkspaceSuggestSave(true))
          } else if (searchQuery) {
            // TODO check if is search location and navigate back to workspace
            upsertDataviewInstance(dataviewInstance)
            // dispatchQueryParams({ query: undefined })
          }
          resetSidebarScroll()
        } else if (addToDataviews && dataviewInstance) {
          // if (removeVessels) {
          //   const dataviewsToDelete = vesselDataviews.flatMap((d) =>
          //     d.config?.visible ? { id: d.id, deleted: true } : []
          //   )
          //   upsertDataviewInstance([...dataviewsToDelete, dataviewInstance])
          // } else {
          upsertDataviewInstance(dataviewInstance)
          // }
        }
        if (editingVesselGroupId && isVesselGroupReportLocation) {
          dispatch(resetVesselGroupReportData())
          dispatch(fetchVesselGroupReportThunk({ vesselGroupId: editingVesselGroupId }))
        }
        close()
        setButtonLoading('')
        trackEvent({
          category: TrackCategory.VesselGroups,
          action: `${editingVesselGroupId ? 'Edit' : 'Create new'} vessel group`,
          label: getEventLabel([
            `vessel_id: ${vesselGroupId}`,
            calculateVMSVesselsPercentage(vesselGroupVessels),
          ]),
          value: `number of vessels: ${vessels.length}`,
        })
      }
    },
    [
      vesselGroupVessels,
      editingVesselGroupId,
      userIsVesselGroupOwner,
      groupName,
      dispatch,
      createAsPublic,
      vesselGroupsInWorkspace,
      isVesselGroupReportLocation,
      close,
      workspace?.category,
      workspace?.id,
      query,
      workspaceToNavigate,
      searchQuery,
      upsertDataviewInstance,
      presenceDataview,
    ]
  )

  const searchingByCsvMissingParams =
    csvData === null ||
    csvData.length === 0 ||
    !selectedCsvColumns ||
    selectedCsvColumns.length === 0 ||
    (selectedCsvColumns.length === 1 && selectedCsvColumns[0].toLowerCase() === 'flag')
  const searchingByIdMissingParams = searchIdField === '' || !vesselGroupModalSearchIds?.length

  const missesRequiredParams = hasVesselGroupsVessels
    ? groupName === ''
    : searchingByIdMissingParams && searchingByCsvMissingParams

  const confirmButtonDisabled =
    loading || hasVesselsOverflow || !searchVesselGroupsVesselsAllowed || missesRequiredParams

  let confirmButtonTooltip: string = hasVesselsOverflow
    ? t((t) => t.vesselGroup.tooManyVessels, {
        count: MAX_VESSEL_GROUP_VESSELS,
      })
    : ''
  if (hasVesselGroupsVessels) {
    if (groupName === '') {
      confirmButtonTooltip = t((t) => t.vesselGroup.missingParam, {
        param: t((t) => t.common.name).toLowerCase(),
      })
    }
  } else {
    confirmButtonTooltip =
      searchIdField === ''
        ? t((t) => t.vesselGroup.missingParam, {
            param: t((t) => t.vesselGroup.idField).toLowerCase(),
          })
        : selectedCsvColumns?.length === 0
          ? t((t) => t.vesselGroup.columnSelection)
          : searchVesselStatus === AsyncReducerStatus.Loading
            ? t((t) => t.common.loading)
            : t((t) => t.vesselGroup.searchVesselsRequired)
  }

  const onSearchClick = useCallback(() => {
    onBackClick('close')
    if (workspace?.id) {
      dispatchLocation(WORKSPACE_SEARCH, {
        payload: {
          category: workspace.category,
          workspaceId: workspace.id,
        },
      })
    } else {
      dispatchLocation(SEARCH)
    }
  }, [onBackClick, dispatchLocation, workspace])

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={t((t) => t.vesselGroup.vesselGroup)}
      isOpen={isModalOpen}
      className={styles.modal}
      contentClassName={styles.modalContainer}
      onClose={() => onBackClick('close')}
      size="fullscreen"
    >
      <div className={styles.modalContent}>
        <div className={styles.parameters}>
          <InputText
            id="groupName"
            label={t((t) => t.vesselGroup.groupName)}
            type={'text'}
            value={groupName}
            onChange={onGroupNameChange}
          />
          {!fullModalLoading && !hasVesselGroupsVessels && (
            <Fragment>
              <MultiSelect
                label={t((t) => t.layer.sources)}
                placeholder={getPlaceholderBySelections({
                  selection: sourcesSelected.map(({ id }) => id),
                  options: sourceOptions,
                })}
                options={sourceOptions}
                selectedOptions={sourcesSelected}
                onSelect={onSelectSourceClick}
                onRemove={sourcesSelected?.length > 1 ? onRemoveSourceClick : undefined}
              />
              <div>
                <InputDate
                  value={transmissionDateTo || ''}
                  max={AVAILABLE_END.slice(0, 10) as string}
                  min={AVAILABLE_START.slice(0, 10) as string}
                  label={t((t) => t.common.active_after)}
                  onChange={(e) => {
                    setTransmissionDateTo(e.target.value)
                  }}
                  onRemove={() => {
                    setTransmissionDateTo('')
                  }}
                />
              </div>
              <div>
                <InputDate
                  value={transmissionDateFrom || ''}
                  max={AVAILABLE_END.slice(0, 10) as string}
                  min={AVAILABLE_START.slice(0, 10) as string}
                  label={t((t) => t.common.active_before)}
                  onChange={(e) => {
                    setTransmissionDateFrom(e.target.value)
                  }}
                  onRemove={() => {
                    setTransmissionDateFrom('')
                  }}
                />
              </div>
            </Fragment>
          )}
          {editingVesselGroup && hasVesselGroupsVessels && (
            <p className={styles.searchLink}>
              <span className={styles.searchLinkText}>
                {t((t) => t.vesselGroup.searchLink)}
                <IconButton size="small" icon="search" type="border" onClick={onSearchClick} />
              </span>
            </p>
          )}
        </div>
        {fullModalLoading ? (
          <Spinner />
        ) : hasVesselGroupsVessels ? (
          <Fragment>
            <label>
              {editingVesselGroup
                ? `${t((t) => t.common.vessel, {
                    count: getVesselGroupVesselsCount({
                      vessels: vesselGroupVessels,
                    } as VesselGroup),
                  })}:  ${getVesselGroupVesselsCount({
                    vessels: vesselGroupVessels,
                  } as VesselGroup)}`
                : t((t) => t.vesselGroup.searchResultsTable, {
                    field: selectedCsvColumns ? listAsSentence(selectedCsvColumns) : searchIdField,
                    timeRange:
                      transmissionDateFrom && transmissionDateTo
                        ? ` ${t((t) => t.common.active)} ${t((t) => t.common.dateRange, {
                            start: formatI18nDate(transmissionDateTo),
                            end: formatI18nDate(transmissionDateFrom),
                          })}`
                        : transmissionDateFrom
                          ? ` ${t((t) => t.common.active_before)} ${formatI18nDate(transmissionDateFrom)}`
                          : transmissionDateTo
                            ? ` ${t((t) => t.common.active_after)} ${formatI18nDate(transmissionDateTo)}`
                            : '',
                    number: getVesselGroupVesselsCount({
                      vessels: vesselGroupVessels,
                    } as VesselGroup),
                  })}
            </label>
            <div className={styles.vesselsTableContainer}>
              <VesselGroupVessels searchIdField={searchIdField || 'imo'} />
            </div>
          </Fragment>
        ) : (
          <VesselGroupSearch onError={setError} />
        )}
      </div>
      <div className={styles.modalFooter}>
        {!editingVesselGroup && (
          <SwitchRow
            className={styles.row}
            label={t((t) => t.vesselGroup.uploadPublic)}
            active={createAsPublic}
            onClick={() => setCreateAsPublic((createAsPublic) => !createAsPublic)}
          />
        )}
      </div>
      <div className={styles.modalFooter}>
        <UserGuideLink section="vesselGroups" />
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
          {datasetsWithoutRelatedEvents.length >= 1 && (
            <div className={styles.disclaimerFooter}>
              <Icon icon="warning" type="warning" />
              {t((t) => t.vesselGroup.disclaimerFeaturesNotAvailable, {
                features: t((t) => t.vesselGroup.disclaimerFeaturesNotAvailableGenericPrefix),
                datasets: Array.from(datasetsWithoutRelatedEvents)
                  .map((d) => getDatasetLabel(d))
                  .join(', '),
              })}
            </div>
          )}
          {!searchVesselGroupsVesselsAllowed && (
            <span className={styles.errorMsg}>
              {t((t) => t.vesselGroup.searchLimit, {
                limit: MAX_VESSEL_GROUP_VESSELS,
              })}
            </span>
          )}
          {vesselGroupAPIError && !error && (
            <span className={styles.errorMsg}>
              {vesselGroupsError?.message || t((t) => t.errors.genericShort)}
            </span>
          )}
        </div>
        {showBackButton && (
          <Button
            type="secondary"
            disabled={loading}
            className={styles.backButton}
            onClick={() => onBackClick('back')}
          >
            {t((t) => t.common.back)}
          </Button>
        )}
        {!fullModalLoading &&
          (confirmationMode === 'save' || confirmationMode === 'update' ? (
            <Button
              disabled={confirmButtonDisabled}
              onClick={hasVesselGroupsVessels ? (e) => onCreateGroupClick(e) : onSearchVesselsClick}
              loading={loading}
              tooltip={confirmButtonTooltip}
            >
              {hasVesselGroupsVessels
                ? confirmationMode === 'update'
                  ? t((t) => t.common.update)
                  : t((t) => t.common.confirm)
                : t((t) => t.common.continue)}
            </Button>
          ) : (
            <Fragment>
              <Button
                className={styles.footerButton}
                disabled={confirmButtonDisabled}
                onClick={(e) => onCreateGroupClick(e)}
                loading={loading && buttonLoading === 'save'}
                type={workspaceToNavigate ? 'secondary' : 'default'}
                tooltip={
                  confirmButtonTooltip ||
                  t((t) => t.vesselGroup.saveForLaterTooltip, {
                    defaultValue:
                      "You'll find the group in the activity layers filters or your user panel button",
                  })
                }
              >
                {t((t) => t.vesselGroup.saveForLater)}
              </Button>
              {workspaceToNavigate && (
                <Button
                  className={styles.footerButton}
                  disabled={confirmButtonDisabled}
                  onClick={(e) => onCreateGroupClick(e, { navigateToWorkspace: true })}
                  loading={loading && buttonLoading === 'saveAndSeeInWorkspace'}
                  tooltip={confirmButtonTooltip}
                >
                  {t((t) => t.vesselGroup.saveAndSeeInWorkspace)}
                </Button>
              )}
            </Fragment>
          ))}
      </div>
    </Modal>
  )
}

export default VesselGroupModal
