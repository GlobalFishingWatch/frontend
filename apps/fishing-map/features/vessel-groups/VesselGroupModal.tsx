import { useState, useCallback, useEffect, Fragment, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { VesselGroup, VesselGroupVessel } from '@globalfishingwatch/api-types'
import {
  Modal,
  Button,
  Select,
  SelectOption,
  InputText,
  SwitchRow,
  Spinner,
} from '@globalfishingwatch/ui-components'
import { ROOT_DOM_ELEMENT } from 'data/config'
import VesselGroupSearch from 'features/vessel-groups/VesselGroupModalSearch'
import VesselGroupVessels from 'features/vessel-groups/VesselGroupModalVessels'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectAllVesselGroupSearchVessels,
  selectHasVesselGroupSearchVessels,
  selectHasVesselGroupVesselsOverflow,
  selectVesselGroupWorkspaceToNavigate,
  selectWorkspaceVessselGroupsIds,
} from 'features/vessel-groups/vessel-groups.selectors'
import {
  mergeDataviewIntancesToUpsert,
  useDataviewInstancesConnect,
} from 'features/workspace/workspace.hook'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getEventLabel } from 'utils/analytics'
import { updateLocation } from 'routes/routes.actions'
import { ROUTE_TYPES } from 'routes/routes'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { selectSearchQuery } from 'features/search/search.config.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import UserGuideLink from 'features/help/UserGuideLink'
import { getVesselId } from 'features/vessel/vessel.utils'
import { ID_COLUMNS_OPTIONS } from 'features/vessel-groups/vessel-groups.config'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { getVesselGroupDataviewInstance } from 'features/reports/vessel-groups/vessel-group-report.dataviews'
import {
  IdField,
  createVesselGroupThunk,
  selectVesselGroupById,
  selectVesselGroupsStatus,
  VesselGroupConfirmationMode,
  updateVesselGroupVesselsThunk,
  UpdateVesselGroupThunkParams,
} from './vessel-groups.slice'
import styles from './VesselGroupModal.module.css'
import {
  getVesselInVesselGroupThunk,
  MAX_VESSEL_GROUP_VESSELS,
  resetVesselGroupModal,
  resetVesselGroupModalStatus,
  searchVesselGroupsVesselsThunk,
  selectVesselGroupConfirmationMode,
  selectVesselGroupEditId,
  selectVesselGroupModalOpen,
  selectVesselGroupSearchId,
  selectVesselGroupSearchStatus,
  selectVesselGroupsVessels,
  setVesselGroupSearchId,
  setVesselGroupSearchVessels,
} from './vessel-groups-modal.slice'

function VesselGroupModal(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [buttonLoading, setButtonLoading] = useState<VesselGroupConfirmationMode | ''>('')
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const isModalOpen = useSelector(selectVesselGroupModalOpen)
  const confirmationMode = useSelector(selectVesselGroupConfirmationMode)
  const searchIdField = useSelector(selectVesselGroupSearchId)
  const editingVesselGroupId = useSelector(selectVesselGroupEditId)
  const vesselGroupVessels = useSelector(selectVesselGroupsVessels)
  const editingVesselGroup = useSelector(selectVesselGroupById(editingVesselGroupId as string))
  const searchVesselStatus = useSelector(selectVesselGroupSearchStatus)
  const vesselGroupsStatus = useSelector(selectVesselGroupsStatus)
  const workspaceToNavigate = useSelector(selectVesselGroupWorkspaceToNavigate)
  const searchQuery = useSelector(selectSearchQuery)
  const loading =
    searchVesselStatus === AsyncReducerStatus.Loading ||
    vesselGroupsStatus === AsyncReducerStatus.Loading ||
    vesselGroupsStatus === AsyncReducerStatus.LoadingUpdate
  const fullModalLoading = editingVesselGroupId && searchVesselStatus === AsyncReducerStatus.Loading
  const vesselGroupAPIError =
    vesselGroupsStatus === AsyncReducerStatus.Error ||
    searchVesselStatus === AsyncReducerStatus.Error
  const [error, setError] = useState('')

  const [groupName, setGroupName] = useState<string>(editingVesselGroup?.name || '')
  const [showBackButton, setShowBackButton] = useState(false)
  const [createAsPublic, setCreateAsPublic] = useState(true)
  const vesselGroupSearchVessels = useSelector(selectAllVesselGroupSearchVessels)
  const hasVesselsOverflow = useSelector(selectHasVesselGroupVesselsOverflow)
  const hasVesselGroupsVessels = useSelector(selectHasVesselGroupSearchVessels)
  const vesselGroupsInWorkspace = useSelector(selectWorkspaceVessselGroupsIds)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const searchVesselGroupsVesselsRef = useRef<any>()
  const searchVesselGroupsVesselsAllowed = vesselGroupVessels
    ? vesselGroupVessels?.length < MAX_VESSEL_GROUP_VESSELS
    : true

  const dispatchSearchVesselsGroupsThunk = useCallback(
    async (vessels: VesselGroupVessel[], idField: IdField = 'vesselId') => {
      searchVesselGroupsVesselsRef.current = dispatch(
        searchVesselGroupsVesselsThunk({ vessels, idField })
      )
      const action = await searchVesselGroupsVesselsRef.current
      if (searchVesselGroupsVesselsThunk.fulfilled.match(action)) {
        setError('')
      } else {
        setError((action.payload as any)?.message || '')
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (editingVesselGroup && editingVesselGroup.vessels?.length > 0) {
      dispatch(getVesselInVesselGroupThunk({ vesselGroup: editingVesselGroup }))
    }
  }, [dispatch, editingVesselGroup])

  const onGroupNameChange = useCallback((e: any) => {
    setGroupName(e.target.value)
  }, [])

  const onIdFieldChange = useCallback(
    (option: SelectOption) => {
      dispatch(setVesselGroupSearchId(option.id))
    },
    [dispatch]
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
          dispatch(setVesselGroupSearchVessels(null))
          dispatch(resetVesselGroupModalStatus())
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
    setShowBackButton(true)
    if (vesselGroupVessels) {
      dispatchSearchVesselsGroupsThunk(vesselGroupVessels, searchIdField)
    }
  }, [dispatchSearchVesselsGroupsThunk, vesselGroupVessels, searchIdField])

  const onCreateGroupClick = useCallback(
    async (
      e: React.MouseEvent<Element, MouseEvent>,
      { addToDataviews = true, removeVessels = false, navigateToWorkspace = false } = {}
    ) => {
      setButtonLoading(navigateToWorkspace ? 'saveAndSeeInWorkspace' : 'save')
      const vessels: VesselGroupVessel[] = vesselGroupSearchVessels.map((vessel) => {
        return {
          vesselId: getVesselId(vessel),
          dataset: vessel.dataset as string,
        }
      })
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
        close()
        setButtonLoading('')
      }
      trackEvent({
        category: TrackCategory.VesselGroups,
        action: `Create new vessel group`,
        label: getEventLabel([
          vessels.length.toString(),
          ...vessels.map((vessel) => vessel.vesselId),
        ]),
      })
    },
    [
      vesselGroupSearchVessels,
      editingVesselGroupId,
      groupName,
      dispatch,
      createAsPublic,
      vesselGroupsInWorkspace,
      close,
      workspaceToNavigate,
      searchQuery,
      upsertDataviewInstance,
      vesselDataviews,
    ]
  )

  const confirmButtonDisabled =
    loading ||
    hasVesselsOverflow ||
    searchVesselStatus === AsyncReducerStatus.Error ||
    !searchVesselGroupsVesselsAllowed ||
    (hasVesselGroupsVessels && groupName === '')
  const confirmButtonTooltip = hasVesselsOverflow
    ? t('vesselGroup.tooManyVessels', {
        count: MAX_VESSEL_GROUP_VESSELS,
        defaultValue: 'Maximum number of vessels is {{count}}',
      })
    : hasVesselGroupsVessels && groupName === ''
    ? t('vesselGroup.missingName', 'Vessel group name is mandatory')
    : ''

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
          {!fullModalLoading &&
            searchVesselStatus !== AsyncReducerStatus.Error &&
            !hasVesselGroupsVessels && (
              <Select
                key="IDfield"
                label={t('vesselGroup.idField', 'ID field')}
                options={ID_COLUMNS_OPTIONS}
                selectedOption={ID_COLUMNS_OPTIONS.find((o) => o.id === searchIdField)}
                onSelect={onIdFieldChange}
                disabled={hasVesselGroupsVessels}
              />
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
              searchVesselStatus !== AsyncReducerStatus.Error && (
                <VesselGroupSearch onError={setError} />
              )
            )}
          </Fragment>
        )}
      </div>
      {!editingVesselGroup && (
        <div className={styles.modalFooter}>
          {vesselGroupSearchVessels?.length > 0 && (
            <label>
              {t('common.vessel_other', 'Vessels')}: {vesselGroupSearchVessels.length}
            </label>
          )}
          <SwitchRow
            className={styles.row}
            label={t(
              'vesselGroup.uploadPublic',
              'Allow other users to see this vessel group when you share a workspace'
            )}
            active={createAsPublic}
            onClick={() => setCreateAsPublic((createAsPublic) => !createAsPublic)}
          />
        </div>
      )}
      <div className={styles.modalFooter}>
        <UserGuideLink section="vesselGroups" />
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
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
              {t('errors.genericShort', 'Something went wrong')}
            </span>
          )}
        </div>
        {searchVesselStatus === AsyncReducerStatus.Finished
          ? showBackButton && hasVesselGroupsVessels
          : showBackButton && (
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
          (confirmationMode === 'save' || confirmationMode === 'saveAndDeleteVessels' ? (
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
                ? t('common.confirm', 'Confirm')
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
