import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { parse as parseCSV } from 'papaparse'
import { useSelector } from 'react-redux'
import {
  EndpointId,
  VesselSearch,
  VesselGroupVessel,
  VesselGroupUpsert,
  APIPagination,
  DatasetStatus,
} from '@globalfishingwatch/api-types'
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
  MultiSelect,
} from '@globalfishingwatch/ui-components'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { ROOT_DOM_ELEMENT, FIRST_YEAR_OF_DATA } from 'data/config'
import FileDropzone from 'features/common/FileDropzone'
import { readBlobAs } from 'utils/files'
import I18nDate from 'features/i18n/i18nDate'
import {
  selectAdvancedSearchDatasets,
  selectAllSearchDatasetsByType,
} from 'features/search/search.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import styles from './VesselGroupModal.module.css'
import {
  setVesselGroupVessels,
  createVesselGroupThunk,
  selectVesselGroupModalOpen,
  selectVesselGroupVessels,
  setVesselGroupsModalOpen,
  selectVesselGroupSources,
  setVesselGroupSources,
  selectVesselGroupSourcesDisabled,
} from './vessel-groups.slice'

export type CSV = Record<string, any>[]

type IdColumn = 'id' | 'mmsi' | 'ssvid'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [groupName, setGroupName] = useState<string>()
  const [showBackButton, setShowBackButton] = useState(false)
  const [IDs, setIDs] = useState<string[]>([])
  const [selectedIDColumn, setSelectedIDColumn] = useState<IdColumn>('mmsi')
  const vessels = useSelector(selectVesselGroupVessels)
  const searchDatasetsInWorkspace = useSelector(selectAdvancedSearchDatasets)
  const allSearchDatasets = useSelector(selectAllSearchDatasetsByType('advanced'))
  const searchDatasets = searchDatasetsInWorkspace?.length
    ? searchDatasetsInWorkspace
    : allSearchDatasets

  const sourceOptions = (searchDatasets || []).map((d) => ({
    id: d.id,
    label: getDatasetLabel(d),
  }))
  const sourcesOptions = useSelector(selectVesselGroupSources)
  const sourcesOptionsDisabled = useSelector(selectVesselGroupSourcesDisabled)

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
          setIDs(data.map((row) => row[foundIdColumn]))
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
    if (value === '') setIDs([])
    else setIDs(value.split(/[\s|,]+/))
  }, [])

  const onVesselRemoveClick = useCallback(
    (vesselId: string) => {
      const index = vessels.findIndex((vessel) => vessel.id === vesselId)
      dispatch(setVesselGroupVessels([...vessels.slice(0, index), ...vessels.slice(index + 1)]))
    },
    [dispatch, vessels]
  )

  const close = useCallback(() => {
    setIDs([])
    setError('')
    setGroupName('')
    setLoading(false)
    dispatch(setVesselGroupVessels(undefined))
    dispatch(setVesselGroupsModalOpen(false))
  }, [dispatch])

  const onClose = useCallback(() => {
    const askConfirm = vessels || IDs?.length
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
  }, [close, IDs?.length, t, vessels])

  const onBackClick = useCallback(() => {
    const confirmed = window.confirm(
      t(
        'vesselGroup.confirmAbort',
        'You will loose any changes made in this vessel group. Are you sure?'
      )
    )
    if (confirmed) {
      dispatch(setVesselGroupVessels(undefined))
    }
  }, [dispatch, t])

  const onSearchVesselsClick = useCallback(async () => {
    if (!searchDatasets || !sourcesOptions.length) return
    setLoading(true)
    const dataset = searchDatasets[0]
    const advancedQuery = IDs.map((id) => `${selectedIDColumn} = '${id}'`).join(' OR ')

    const datasetConfig = {
      endpoint: EndpointId.VesselAdvancedSearch,
      datasetId: dataset.id,
      params: [],
      query: [
        {
          id: 'datasets',
          value: sourcesOptions.map((d) => d.id),
        },
        { id: 'query', value: encodeURIComponent(advancedQuery) },
        { id: 'limit', value: 20 },
        { id: 'offset', value: 0 },
      ],
    }

    const url = resolveEndpoint(dataset, datasetConfig)
    try {
      const searchResults = await GFWAPI.fetch<APIPagination<VesselSearch>>(url)
      if (searchResults.entries.length) {
        setShowBackButton(true)
        dispatch(setVesselGroupVessels(searchResults.entries))
      } else {
        setError(t('vesselGroup.emptyError', 'No vessels found'))
      }
    } catch (e) {
      setError(t('errors.genericShort', 'Something went wrong'))
    }
    setLoading(false)
  }, [dispatch, searchDatasets, IDs, t, selectedIDColumn])

  const onCreateGroupClick = useCallback(async () => {
    setLoading(true)
    const vesselGroupVessels: VesselGroupVessel[] = vessels.map((vessel) => {
      return {
        vesselId: vessel.id,
        dataset: vessel.dataset,
      }
    })
    const vesselGroup: VesselGroupUpsert = {
      name: groupName,
      vessels: vesselGroupVessels,
    }

    const dispatchedAction = await dispatch(createVesselGroupThunk(vesselGroup))

    if (createVesselGroupThunk.fulfilled.match(dispatchedAction)) {
      close()
    } else {
      setError(t('errors.genericShort', 'Something went wrong'))
    }
    setLoading(false)
  }, [vessels, dispatch, groupName, t, close])

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
          <MultiSelect
            label={t('layer.source_other', 'Sources')}
            placeholder={getPlaceholderBySelections(sourcesOptions)}
            options={sourceOptions}
            disabled={sourcesOptionsDisabled}
            selectedOptions={sourcesOptions}
            className={styles.row}
            onSelect={(selection) =>
              dispatch(setVesselGroupSources([...sourcesOptions, selection]))
            }
            onRemove={(filter, rest) => {
              dispatch(setVesselGroupSources(rest))
            }}
            onCleanClick={() => {
              dispatch(setVesselGroupSources(undefined))
            }}
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
                value={IDs?.join(', ')}
                label={
                  IDs?.length
                    ? `${selectedIDColumnOption.label} (${selectedIDColumnOption.label})`
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
