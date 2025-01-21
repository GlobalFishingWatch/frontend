import { Fragment, useCallback, useEffect, useRef,useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { VesselGroup, VesselGroupVessel } from '@globalfishingwatch/api-types'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import {
  Button,
  Icon,
  InputText,
  Modal,
  MultiSelect,
  Select,
  Spinner,
  SwitchRow,
} from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectVesselGroupCompatibleDatasets } from 'features/datasets/datasets.selectors'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import UserGuideLink from 'features/help/UserGuideLink'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { getVesselGroupDataviewInstance } from 'features/reports/vessel-groups/vessel-group-report.dataviews'
import {
  fetchVesselGroupReportThunk,
  resetVesselGroupReportData,
} from 'features/reports/vessel-groups/vessel-group-report.slice'
import { selectSearchQuery } from 'features/search/search.config.selectors'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { DEFAULT_VESSEL_IDENTITY_DATASET } from 'features/vessel/vessel.config'
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
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'
import type { ROUTE_TYPES } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { selectIsVesselGroupReportLocation } from 'routes/routes.selectors'
import { getEventLabel } from 'utils/analytics'
import { AsyncReducerStatus } from 'utils/async-slice'

import { ID_COLUMNS_OPTIONS } from './vessel-groups.config'
import type {
  IdField,
  UpdateVesselGroupThunkParams,
  VesselGroupConfirmationMode,
} from './vessel-groups.slice'
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
import {
  getVesselInVesselGroupThunk,
  MAX_VESSEL_GROUP_VESSELS,
  resetVesselGroupModal,
  resetVesselGroupModalSearchStatus,
  searchVesselGroupsVesselsThunk,
  selectVesselGroupConfirmationMode,
  selectVesselGroupEditId,
  selectVesselGroupModalOpen,
  selectVesselGroupModalSearchIdField,
  selectVesselGroupModalVessels,
  selectVesselGroupSearchStatus,
  setVesselGroupModalVessels,
  setVesselGroupSearchIdField,
} from './vessel-groups-modal.slice'

import styles from './VesselGroupModal.module.css'

function VesselGroupModal(): React.ReactElement<any> {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [buttonLoading, setButtonLoading] = useState<VesselGroupConfirmationMode | ''>('')
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const isModalOpen = useSelector(selectVesselGroupModalOpen)
  const confirmationMode = useSelector(selectVesselGroupConfirmationMode)
  const searchIdField = useSelector(selectVesselGroupModalSearchIdField)
  const editingVesselGroupId = useSelector(selectVesselGroupEditId)
  const vesselGroupVesselsToSearch = useSelector(selectVesselGroupsModalSearchIds)
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

  const [groupName, setGroupName] = useState<string>(editingVesselGroup?.name || '')
  const [showBackButton, setShowBackButton] = useState(false)
  const [createAsPublic, setCreateAsPublic] = useState(true)
  const vesselGroupVessels = useSelector(selectVesselGroupModalVessels)
  const hasVesselsOverflow = useSelector(selectHasVesselGroupVesselsOverflow)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const hasVesselGroupsVessels = useSelector(selectHasVesselGroupSearchVessels)
  const vesselGroupsInWorkspace = useSelector(selectWorkspaceVessselGroupsIds)
  const datasetsWithoutRelatedEvents = useSelector(
    selectVesselGroupModalDatasetsWithoutEventsRelated
  )
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const searchVesselGroupsVesselsRef = useRef<any>(undefined)
  const searchVesselGroupsVesselsAllowed = vesselGroupVesselsToSearch
    ? vesselGroupVesselsToSearch?.length < MAX_VESSEL_GROUP_VESSELS
    : true

  const vesselDatasets = useSelector(selectVesselGroupCompatibleDatasets)
  const sourceOptions = vesselDatasets.map((d) => ({
    id: d.id,
    label: getDatasetLabel(d),
  }))
  const defaultSourceSelected = sourceOptions.find((s) =>
    s.id.includes(DEFAULT_VESSEL_IDENTITY_DATASET)
  )
  const [sourcesSelected, setSourcesSelected] = useState<SelectOption[]>(
    defaultSourceSelected ? [defaultSourceSelected] : []
  )

  const onSelectSourceClick = useCallback(
    (source: SelectOption) => {
      setSourcesSelected([...sourcesSelected, source])
    },
    [sourcesSelected]
  )

  const onRemoveSourceClick = useCallback(
    (source: SelectOption) => {
      setSourcesSelected(sourcesSelected.filter((s) => s.id !== source.id))
    },
    [sourcesSelected]
  )

  const dispatchSearchVesselsGroupsThunk = useCallback(
    async (ids: string[], idField: IdField = 'vesselId') => {
      searchVesselGroupsVesselsRef.current = dispatch(
        searchVesselGroupsVesselsThunk({
          ids,
          idField,
          datasets: sourcesSelected.map(({ id }) => id),
        })
      )
      const action = await searchVesselGroupsVesselsRef.current
      if (searchVesselGroupsVesselsThunk.fulfilled.match(action)) {
        if (action.payload?.length) {
          setError('')
          setShowBackButton(true)
        } else {
          setError(t('vesselGroup.searchNotFound', 'No vessels found'))
        }
      } else {
        setError((action.payload as any)?.message || '')
      }
    },
    [dispatch, sourcesSelected, t]
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

  const onGroupNameChange = useCallback((e: any) => {
    setGroupName(e.target.value)
  }, [])

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
  }, [abortSearch, dispatch])

  const onBackClick = useCallback(
    (action: 'back' | 'close' = 'back') => {
      const confirmed = hasVesselGroupsVessels
        ? window.confirm(
            t(
              'vesselGroup.confirmAbort',
              'You will lose any changes made in this vessel group. Are you sure?'
            )
          )
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
    if (vesselGroupVesselsToSearch && searchIdField) {
      dispatchSearchVesselsGroupsThunk(vesselGroupVesselsToSearch, searchIdField)
    }
  }, [dispatchSearchVesselsGroupsThunk, vesselGroupVesselsToSearch, searchIdField])

  const onCreateGroupClick = useCallback(
    async (
      e: React.MouseEvent<Element, MouseEvent>,
      { addToDataviews = true, removeVessels = false, navigateToWorkspace = false } = {}
    ) => {
      setButtonLoading(navigateToWorkspace ? 'saveAndSeeInWorkspace' : 'save')
      const vessels: VesselGroupVessel[] = getVesselGroupUniqVessels(vesselGroupVessels)
      let dispatchedAction
      if (editingVesselGroupId) {
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
        const dataviewInstance = !isVesselGroupInWorkspace
          ? getVesselGroupDataviewInstance(vesselGroupId)
          : undefined
        if (navigateToWorkspace && dataviewInstance) {
          if (workspaceToNavigate) {
            const { type, ...rest } = workspaceToNavigate
            const { query, payload, replaceQuery } = rest
            const dataviewInstancesMerged = mergeDataviewIntancesToUpsert(
              dataviewInstance,
              rest.query.dataviewInstances
            )

            dispatch(
              updateLocation(type as ROUTE_TYPES, {
                query: { ...query, dataviewInstances: dataviewInstancesMerged },
                payload,
                replaceQuery,
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
          if (removeVessels) {
            const dataviewsToDelete = vesselDataviews.flatMap((d) =>
              d.config?.visible ? { id: d.id, deleted: true } : []
            )
            upsertDataviewInstance([...dataviewsToDelete, dataviewInstance])
          } else {
            upsertDataviewInstance(dataviewInstance)
          }
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
            vesselGroupId,
            calculateVMSVesselsPercentage(vesselGroupVessels).toString(),
          ]),
          value: `number of vessel identities: ${vessels.length}`,
        })
      }
    },
    [
      vesselGroupVessels,
      editingVesselGroupId,
      groupName,
      dispatch,
      createAsPublic,
      vesselGroupsInWorkspace,
      isVesselGroupReportLocation,
      close,
      workspaceToNavigate,
      searchQuery,
      upsertDataviewInstance,
      vesselDataviews,
    ]
  )

  const missesRequiredParams = hasVesselGroupsVessels
    ? groupName === ''
    : searchIdField === '' || !vesselGroupVesselsToSearch?.length || !sourcesSelected?.length
  const confirmButtonDisabled =
    loading || hasVesselsOverflow || !searchVesselGroupsVesselsAllowed || missesRequiredParams
  let confirmButtonTooltip = hasVesselsOverflow
    ? t('vesselGroup.tooManyVessels', {
        count: MAX_VESSEL_GROUP_VESSELS,
        defaultValue: 'Maximum number of vessels is {{count}}',
      })
    : ''
  if (hasVesselGroupsVessels) {
    if (groupName === '') {
      confirmButtonTooltip = t('vesselGroup.missingParam', {
        defaultValue: 'Vessel group {{param}} is mandatory',
        param: t('common.name', 'name').toLowerCase(),
      })
    }
  } else {
    confirmButtonTooltip =
      searchIdField === ''
        ? t('vesselGroup.missingParam', {
            defaultValue: 'Vessel group {{param}} is mandatory',
            param: t('vesselGroup.idField', 'ID field').toLowerCase(),
          })
        : searchVesselStatus === AsyncReducerStatus.Loading
        ? t('common.loading', 'Loading')
        : t('vesselGroup.searchVesselsRequired', 'Search for vessels to create a vessel group')
  }

  const onIdFieldChange = useCallback(
    (option: SelectOption) => {
      dispatch(setVesselGroupSearchIdField(option.id))
    },
    [dispatch]
  )

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={t('vesselGroup.vesselGroup', 'Vessel group')}
      isOpen={isModalOpen}
      className={styles.modal}
      contentClassName={styles.modalContainer}
      onClose={() => onBackClick('close')}
      fullScreen={true}
    >
      <div className={styles.modalContent}>
        <div className={styles.parameters}>
          <InputText
            id="groupName"
            label={t('vesselGroup.groupName', 'Group name')}
            type={'text'}
            value={groupName}
            onChange={onGroupNameChange}
          />
          {!fullModalLoading && !hasVesselGroupsVessels && (
            <Fragment>
              <MultiSelect
                label={t('layer.source_other', 'Sources')}
                placeholder={getPlaceholderBySelections({
                  selection: sourcesSelected.map(({ id }) => id),
                  options: sourceOptions,
                })}
                options={sourceOptions}
                selectedOptions={sourcesSelected}
                onSelect={onSelectSourceClick}
                onRemove={sourcesSelected?.length > 1 ? onRemoveSourceClick : undefined}
              />
              <Select
                label={t('vesselGroup.idField', 'ID field')}
                options={ID_COLUMNS_OPTIONS}
                selectedOption={ID_COLUMNS_OPTIONS.find((o) => o.id === searchIdField)}
                onSelect={onIdFieldChange}
                disabled={hasVesselGroupsVessels}
              />
            </Fragment>
          )}
        </div>
        {fullModalLoading ? (
          <Spinner />
        ) : (
          <Fragment>
            {hasVesselGroupsVessels ? (
              <div className={styles.vesselsTableContainer}>
                <VesselGroupVessels />
              </div>
            ) : (
              <VesselGroupSearch onError={setError} />
            )}
          </Fragment>
        )}
      </div>
      <div className={styles.modalFooter}>
        {vesselGroupVessels && vesselGroupVessels?.length > 0 && (
          <label>
            {t('common.vessel_other', 'Vessels')}:{' '}
            {getVesselGroupVesselsCount({ vessels: vesselGroupVessels } as VesselGroup)}
          </label>
        )}
        {!editingVesselGroup && (
          <SwitchRow
            className={styles.row}
            label={t(
              'vesselGroup.uploadPublic',
              'Allow other users to see this vessel group when you share a workspace'
            )}
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
              {t('vesselGroup.disclaimerFeaturesNotAvailable', {
                defaultValue:
                  '{{features}} are only available for AIS vessels and your group contains vessels from {{datasets}}.',
                features: t(
                  'vesselGroup.disclaimerFeaturesNotAvailableGenericPrefix',
                  'Some features'
                ),
                datasets: Array.from(datasetsWithoutRelatedEvents)
                  .map((d) => getDatasetLabel(d))
                  .join(', '),
              })}
            </div>
          )}
          {!searchVesselGroupsVesselsAllowed && (
            <span className={styles.errorMsg}>
              {t('vesselGroup.searchLimit', {
                defaultValue: 'Search is limited up to {{limit}} vessels',
                limit: MAX_VESSEL_GROUP_VESSELS,
              })}
            </span>
          )}
          {vesselGroupAPIError && !error && (
            <span className={styles.errorMsg}>
              {vesselGroupsError?.message || t('errors.genericShort', 'Something went wrong')}
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
            {t('common.back', 'back')}
          </Button>
        )}
        {!fullModalLoading &&
          (confirmationMode === 'save' ||
          confirmationMode === 'update' ||
          confirmationMode === 'saveAndDeleteVessels' ? (
            <Button
              disabled={confirmButtonDisabled}
              onClick={
                hasVesselGroupsVessels
                  ? (e) =>
                      onCreateGroupClick(e, {
                        removeVessels: confirmationMode === 'saveAndDeleteVessels',
                      })
                  : onSearchVesselsClick
              }
              loading={loading}
              tooltip={confirmButtonTooltip}
            >
              {hasVesselGroupsVessels
                ? confirmationMode === 'update'
                  ? t('common.update', 'Update')
                  : t('common.confirm', 'Confirm')
                : t('common.continue', 'Continue')}
            </Button>
          ) : (
            <Fragment>
              <Button
                className={styles.footerButton}
                disabled={confirmButtonDisabled}
                onClick={(e) => onCreateGroupClick(e, { addToDataviews: false })}
                loading={loading && buttonLoading === 'save'}
                type={workspaceToNavigate ? 'secondary' : 'default'}
                tooltip={
                  confirmButtonTooltip ||
                  t(
                    'vesselGroup.saveForLaterTooltip',
                    "You'll find the group in the activity layers filters or your user panel button"
                  )
                }
              >
                {t('vesselGroup.saveForLater', 'Save for later')}
              </Button>
              {workspaceToNavigate && (
                <Button
                  className={styles.footerButton}
                  disabled={confirmButtonDisabled}
                  onClick={(e) => onCreateGroupClick(e, { navigateToWorkspace: true })}
                  loading={loading && buttonLoading === 'saveAndSeeInWorkspace'}
                  tooltip={confirmButtonTooltip}
                >
                  {t('vesselGroup.saveAndSeeInWorkspace', 'Save and see in workspace')}
                </Button>
              )}
            </Fragment>
          ))}
      </div>
    </Modal>
  )
}

export default VesselGroupModal
