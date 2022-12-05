import { useState, useCallback, useEffect, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { VesselGroupVessel } from '@globalfishingwatch/api-types'
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
} from 'features/vessel-groups/vessel-groups.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  IdField,
  resetVesselGroup,
  createVesselGroupThunk,
  selectCurrentDataviewId,
  selectVesselGroupById,
  selectVesselGroupEditId,
  selectVesselGroupModalOpen,
  selectVesselGroupSearchId,
  selectVesselGroupSearchStatus,
  selectVesselGroupsStatus,
  selectVesselGroupsVessels,
  setVesselGroupSearchId,
  resetVesselGroupStatus,
  setVesselGroupSearchVessels,
  updateVesselGroupThunk,
  searchVesselGroupsVesselsThunk,
  MAX_VESSEL_GROUP_VESSELS,
} from './vessel-groups.slice'
import styles from './VesselGroupModal.module.css'

export type CSV = Record<string, any>[]

// Look for these ID columns by order of preference
export const ID_COLUMN_LOOKUP: IdField[] = ['vesselId', 'mmsi']

const ID_COLUMNS_OPTIONS: SelectOption[] = ID_COLUMN_LOOKUP.map((key) => ({
  id: key,
  label: key.toUpperCase(),
}))

function VesselGroupModal(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isModalOpen = useSelector(selectVesselGroupModalOpen)
  const currentDataviewId = useSelector(selectCurrentDataviewId)
  const searchIdField = useSelector(selectVesselGroupSearchId)
  const editingVesselGroupId = useSelector(selectVesselGroupEditId)
  const vesselGroupVessels = useSelector(selectVesselGroupsVessels)
  const editingVesselGroup = useSelector(selectVesselGroupById(editingVesselGroupId))
  const searchVesselStatus = useSelector(selectVesselGroupSearchStatus)
  const vesselGroupsStatus = useSelector(selectVesselGroupsStatus)
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
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const dispatchSearchVesselsGroupsThunk = useCallback(
    async (vessels: VesselGroupVessel[], idField: IdField = 'vesselId') => {
      return dispatch(searchVesselGroupsVesselsThunk({ vessels, idField }))
    },
    [dispatch]
  )
  const editingVesselGroupVessels = editingVesselGroup?.vessels
  useEffect(() => {
    if (editingVesselGroupVessels?.length > 0) {
      dispatchSearchVesselsGroupsThunk(editingVesselGroupVessels)
    }
  }, [editingVesselGroupVessels, dispatchSearchVesselsGroupsThunk])

  const onGroupNameChange = useCallback((e) => {
    setGroupName(e.target.value)
  }, [])

  const onIdFieldChange = useCallback(
    (option: SelectOption) => {
      dispatch(setVesselGroupSearchId(option.id))
    },
    [dispatch]
  )

  const close = useCallback(() => {
    setError('')
    setGroupName('')
    dispatch(resetVesselGroup(''))
  }, [dispatch])

  const onBackClick = useCallback(
    (action: 'back' | 'close' = 'back') => {
      const confirmed = window.confirm(
        t(
          'vesselGroup.confirmAbort',
          'You will lose any changes made in this vessel group. Are you sure?'
        )
      )
      if (confirmed) {
        if (action === 'back') {
          setError('')
          dispatch(setVesselGroupSearchVessels(undefined))
          dispatch(resetVesselGroupStatus(''))
        } else {
          close()
        }
      }
    },
    [close, dispatch, t]
  )

  const onSearchVesselsClick = useCallback(async () => {
    setShowBackButton(true)
    dispatchSearchVesselsGroupsThunk(vesselGroupVessels, searchIdField)
  }, [dispatchSearchVesselsGroupsThunk, vesselGroupVessels, searchIdField])

  const addVesselGroupToDataviewInstance = useCallback(
    (vesselGroupId: string) => {
      if (currentDataviewId) {
        let config = {
          filters: {
            'vessel-groups': [vesselGroupId],
          },
        }
        const currentDataviewInstance = urlDataviewInstances.find(
          (dvi) => dvi.id === currentDataviewId
        )
        if (currentDataviewInstance) {
          config = {
            filters: {
              ...(currentDataviewInstance.config?.filters || {}),
              'vessel-groups': [
                ...(currentDataviewInstance.config?.filters?.['vessel-groups'] || []),
                vesselGroupId,
              ],
            },
          }
        }
        upsertDataviewInstance({ id: currentDataviewId, config })
      }
    },
    [currentDataviewId, upsertDataviewInstance, urlDataviewInstances]
  )

  const onCreateGroupClick = useCallback(async () => {
    const vessels: VesselGroupVessel[] = vesselGroupSearchVessels.map((vessel) => {
      return {
        vesselId: vessel.id,
        dataset: vessel.dataset,
      }
    })
    let dispatchedAction
    if (editingVesselGroupId) {
      const vesselGroup = {
        id: editingVesselGroupId,
        name: groupName,
        vessels,
      }
      dispatchedAction = await dispatch(updateVesselGroupThunk(vesselGroup))
    } else {
      const vesselGroup = {
        name: groupName,
        vessels,
        public: createAsPublic,
      }
      dispatchedAction = await dispatch(createVesselGroupThunk(vesselGroup))
    }

    if (
      updateVesselGroupThunk.fulfilled.match(dispatchedAction) ||
      createVesselGroupThunk.fulfilled.match(dispatchedAction)
    ) {
      addVesselGroupToDataviewInstance(dispatchedAction.payload.id)
      close()
    }
  }, [
    vesselGroupSearchVessels,
    editingVesselGroupId,
    groupName,
    dispatch,
    createAsPublic,
    addVesselGroupToDataviewInstance,
    close,
  ])

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={t('vesselGroup.vesselGroup', 'Vessel group')}
      isOpen={isModalOpen}
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
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
          {vesselGroupAPIError && (
            <span className={styles.errorMsg}>
              {t('errors.genericShort', 'Something went wrong')}
            </span>
          )}
        </div>
        {hasVesselGroupsVessels && showBackButton && (
          <Button
            type="secondary"
            className={styles.backButton}
            onClick={() => onBackClick('back')}
          >
            {t('common.back', 'back')}
          </Button>
        )}
        {!fullModalLoading && (
          <Button
            disabled={
              loading ||
              hasVesselsOverflow ||
              searchVesselStatus === AsyncReducerStatus.Error ||
              (hasVesselGroupsVessels && groupName === '')
            }
            onClick={hasVesselGroupsVessels ? onCreateGroupClick : onSearchVesselsClick}
            loading={loading}
            tooltip={
              hasVesselsOverflow
                ? t('vesselGroup.tooManyVessels', {
                    count: MAX_VESSEL_GROUP_VESSELS,
                    defaultValue: 'Maximum number of vessels is {{count}}',
                  })
                : hasVesselGroupsVessels && groupName === ''
                ? t('vesselGroup.missingName', 'Vessel group name is mandatory')
                : ''
            }
          >
            {hasVesselGroupsVessels
              ? t('common.confirm', 'Confirm')
              : t('common.continue', 'Continue')}
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default VesselGroupModal
