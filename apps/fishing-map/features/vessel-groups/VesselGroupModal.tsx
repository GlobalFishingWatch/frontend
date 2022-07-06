import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { parse as parseCSV } from 'papaparse'
import { batch, useSelector } from 'react-redux'
import { VesselGroupVessel } from '@globalfishingwatch/api-types'
import {
  Modal,
  Button,
  Select,
  SelectOption,
  InputText,
  TextArea,
  IconButton,
  Tooltip,
  TransmissionsTimeline,
  SwitchRow,
} from '@globalfishingwatch/ui-components'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { ROOT_DOM_ELEMENT, FIRST_YEAR_OF_DATA } from 'data/config'
import FileDropzone from 'features/common/FileDropzone'
import { readBlobAs } from 'utils/files'
import I18nDate from 'features/i18n/i18nDate'
import { useAppDispatch } from 'features/app/app.hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  IdColumn,
  setCurrentDataviewId,
  setVesselGroupSearchVessels,
  createVesselGroupThunk,
  selectVesselGroupModalOpen,
  selectVesselGroupSearchVessels,
  setVesselGroupsModalOpen,
  selectCurrentDataviewId,
  searchVesselGroupsThunk,
  selectVesselGroupSearchStatus,
  selectVesselGroupsStatus,
  setVesselGroupEditId,
  selectVesselGroupEditId,
  selectVesselGroupById,
  updateVesselGroupThunk,
} from './vessel-groups.slice'
import styles from './VesselGroupModal.module.css'

export type CSV = Record<string, any>[]

// Look for these ID columns by order of preference
const ID_COLUMN_LOOKUP: IdColumn[] = ['id', 'mmsi', 'ssvid']

const ID_COLUMNS_OPTIONS: SelectOption[] = ID_COLUMN_LOOKUP.map((key) => ({
  id: key,
  label: key.toUpperCase(),
}))

function VesselGroupModal(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isModalOpen = useSelector(selectVesselGroupModalOpen)
  const currentDataviewId = useSelector(selectCurrentDataviewId)
  const editingVesselGroupId = useSelector(selectVesselGroupEditId)
  const editingVesselGroup = useSelector(selectVesselGroupById(editingVesselGroupId))
  const searchVesselStatus = useSelector(selectVesselGroupSearchStatus)
  const vesselGroupsStatus = useSelector(selectVesselGroupsStatus)
  const loading =
    searchVesselStatus === AsyncReducerStatus.Loading ||
    vesselGroupsStatus === AsyncReducerStatus.Loading ||
    vesselGroupsStatus === AsyncReducerStatus.LoadingUpdate
  const [error, setError] = useState('')

  const [groupName, setGroupName] = useState<string>(editingVesselGroup?.name || '')
  const [showBackButton, setShowBackButton] = useState(false)
  const [createAsPublic, setCreateAsPublic] = useState(true)
  const vessels = useSelector(selectVesselGroupSearchVessels)
  const [vesselIds, setVesselIds] = useState<string[]>([])
  const [selectedIDColumn, setSelectedIDColumn] = useState<IdColumn>('mmsi')
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const hasVesselIds = vesselIds && vesselIds.length > 0

  const onCSVLoaded = useCallback(
    async (file: File) => {
      const fileData = await readBlobAs(file, 'text')
      const { data } = parseCSV(fileData, {
        header: true,
        skipEmptyLines: true,
      })
      if (data.length) {
        const firstRow = data[0]
        const columns = Object.keys(firstRow)
        let foundIdColumn
        // Try to find a CSV column matching preset ids
        for (let i = 0; i < ID_COLUMN_LOOKUP.length; i++) {
          const presetColumn = ID_COLUMN_LOOKUP[i]
          foundIdColumn = columns.find((c) => c.toLowerCase() === presetColumn)
          if (foundIdColumn) {
            setSelectedIDColumn(presetColumn)
            break
          }
        }

        if (columns.length > 1 && !foundIdColumn) {
          setError(
            t(
              'vesselGroup.csvError',
              'Uploaded CSV file has multiple columns and there is no obvious ID column'
            )
          )
          return
        }
        setError('')
        foundIdColumn = foundIdColumn || columns[0]

        if (foundIdColumn) {
          const vesselsIds = data.map((row) => row[foundIdColumn])
          setVesselIds(vesselsIds)
        }
      }
    },
    [t]
  )

  const selectedIDColumnOption = {
    id: selectedIDColumn,
    label: selectedIDColumn,
  }

  const onGroupNameChange = useCallback((e) => {
    setGroupName(e.target.value)
  }, [])

  const onIdFieldChange = useCallback((option: SelectOption) => {
    setSelectedIDColumn(option.id)
  }, [])

  const onIdsTextareaChange = useCallback((e) => {
    const value = e.target.value
    if (value === '') {
      setVesselIds([])
    } else {
      setVesselIds(value.split(/[\s|,]+/))
    }
  }, [])

  const onVesselRemoveClick = useCallback(
    (vesselId: string) => {
      const index = vessels.findIndex((vessel) => vessel.id === vesselId)
      dispatch(
        setVesselGroupSearchVessels([...vessels.slice(0, index), ...vessels.slice(index + 1)])
      )
    },
    [dispatch, vessels]
  )

  const close = useCallback(() => {
    setError('')
    setGroupName('')
    setVesselIds([])
    batch(() => {
      dispatch(setVesselGroupEditId(undefined))
      dispatch(setCurrentDataviewId(undefined))
      dispatch(setVesselGroupSearchVessels(undefined))
      dispatch(setVesselGroupsModalOpen(false))
    })
  }, [dispatch])

  const onClose = useCallback(() => {
    const askConfirm = vessels || hasVesselIds
    let confirmed
    if (askConfirm) {
      confirmed = window.confirm(
        t(
          'vesselGroup.confirmAbort',
          'You will loose any changes made in this vessel group. Are you sure?'
        )
      )
    }
    if (!askConfirm || confirmed) {
      close()
    }
  }, [close, hasVesselIds, t, vessels])

  const onBackClick = useCallback(() => {
    const confirmed = window.confirm(
      t(
        'vesselGroup.confirmAbort',
        'You will loose any changes made in this vessel group. Are you sure?'
      )
    )
    if (confirmed) {
      setError('')
      dispatch(setVesselGroupSearchVessels(undefined))
    }
  }, [dispatch, t])

  const onSearchVesselsClick = useCallback(async () => {
    setShowBackButton(true)
    const dispatchedAction = await dispatch(
      searchVesselGroupsThunk({
        vessels: vesselIds.map((id) => ({ vesselId: id, dataset: '' })),
        columnId: selectedIDColumn,
      })
    )

    if (!searchVesselGroupsThunk.fulfilled.match(dispatchedAction)) {
      setError(t('errors.genericShort', 'Something went wrong'))
    }
  }, [dispatch, vesselIds, selectedIDColumn, t])

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
    const vesselGroupVessels: VesselGroupVessel[] = vessels.map((vessel) => {
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
        vessels: vesselGroupVessels,
      }
      dispatchedAction = await dispatch(updateVesselGroupThunk(vesselGroup))
    } else {
      const vesselGroup = {
        name: groupName,
        vessels: vesselGroupVessels,
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
    } else {
      setError(t('errors.genericShort', 'Something went wrong'))
    }
  }, [
    vessels,
    editingVesselGroupId,
    groupName,
    createAsPublic,
    dispatch,
    addVesselGroupToDataviewInstance,
    close,
    t,
  ])

  const disableIDField = !!vessels

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={t('vesselGroup.vesselGroup', 'Vessel group')}
      isOpen={isModalOpen}
      contentClassName={styles.modalContainer}
      onClose={onClose}
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
          {!vessels?.length && (
            <Select
              key="IDfield"
              label={t('vesselGroup.idField', 'ID field')}
              options={ID_COLUMNS_OPTIONS}
              selectedOption={selectedIDColumnOption}
              onSelect={onIdFieldChange}
              disabled={disableIDField}
            />
          )}
        </div>
        {vessels?.length > 0 ? (
          <div className={styles.vesselsTableContainer}>
            <table className={styles.vesselsTable}>
              <thead>
                <tr>
                  <th>{t('vessel.mmsi', 'MMSI')}</th>
                  <th>{t('common.name', 'Name')}</th>
                  <th>{t('vessel.flag_short', 'iso3')}</th>
                  <th>{t('vessel.gearType_short', 'gear')}</th>
                  <th>{t('vessel.transmissionDates', 'Transmission dates')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {vessels.map((vessel, i) => {
                  const vesselName = formatInfoField(vessel.shipname, 'name')

                  const vesselGearType = `${t(
                    `vessel.gearTypes.${vessel.geartype}` as any,
                    vessel.geartype ?? EMPTY_FIELD_PLACEHOLDER
                  )}`

                  const { mmsi, firstTransmissionDate, lastTransmissionDate } = vessel
                  return (
                    <tr key={i}>
                      <td>{mmsi}</td>
                      <td>{vesselName}</td>
                      <td>
                        <Tooltip content={t(`flags:${vessel.flag as string}` as any)}>
                          <span>{vessel.flag || EMPTY_FIELD_PLACEHOLDER}</span>
                        </Tooltip>
                      </td>
                      <td>{vesselGearType}</td>
                      <td>
                        {firstTransmissionDate && lastTransmissionDate && (
                          // TODO tooltip not working
                          <Tooltip
                            content={
                              <span>
                                from <I18nDate date={firstTransmissionDate} /> to{' '}
                                <I18nDate date={lastTransmissionDate} />
                              </span>
                            }
                          >
                            <TransmissionsTimeline
                              firstTransmissionDate={firstTransmissionDate}
                              lastTransmissionDate={lastTransmissionDate}
                              firstYearOfData={FIRST_YEAR_OF_DATA}
                              shortYears
                            />
                          </Tooltip>
                        )}
                      </td>
                      <td>
                        <IconButton
                          icon={'delete'}
                          style={{
                            color: 'rgb(var(--danger-red-rgb))',
                          }}
                          tooltip={t('vesselGroup.removeVessel', 'Remove vessel from vessel group')}
                          onClick={(e) => onVesselRemoveClick(vessel.id)}
                          size="small"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.vesselGroupInput}>
            <div className={styles.ids}>
              <TextArea
                className={styles.idsArea}
                value={vesselIds?.join(', ')}
                label={
                  hasVesselIds
                    ? `${selectedIDColumnOption.label} (${vesselIds?.length})`
                    : selectedIDColumnOption.label
                }
                placeholder={t('vesselGroup.idsPlaceholder', {
                  field: selectedIDColumnOption.label,
                  defaultValue:
                    'Type here or paste a list of {{field}} separated by commas, spaces or line breaks',
                })}
                onChange={onIdsTextareaChange}
                disabled={!!vessels}
              />
            </div>
            <div className={styles.dropzoneContainer}>
              <FileDropzone
                className={styles.dropzone}
                onFileLoaded={onCSVLoaded}
                fileTypes={['csv']}
              />
            </div>
          </div>
        )}
      </div>
      {!editingVesselGroup && (
        <div className={styles.modalFooter}>
          <SwitchRow
            className={styles.row}
            label={t(
              'vesselGroup.uploadPublic' as any,
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
          <span className={styles.hint}>
            <a
              href="https://globalfishingwatch.org/article-categories/reference-layers/"
              target="_blank"
              rel="noreferrer"
            >
              {t('dataset.hint', 'Find out more about the supported formats')}
            </a>
          </span>
        </div>
        {vessels && showBackButton && (
          <Button type="secondary" className={styles.backButton} onClick={onBackClick}>
            {t('common.back', 'back')}
          </Button>
        )}
        <Button
          disabled={loading || (vessels && !vessels.length) || (vessels && groupName === '')}
          onClick={vessels?.length ? onCreateGroupClick : onSearchVesselsClick}
          loading={loading}
        >
          {vessels?.length > 0 ? t('common.confirm', 'Confirm') : t('common.continue', 'Continue')}
        </Button>
      </div>
    </Modal>
  )
}

export default VesselGroupModal
