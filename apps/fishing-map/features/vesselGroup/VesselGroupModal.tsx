import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { parse as parseCSV } from 'papaparse'
import { useSelector } from 'react-redux'
import {
  Vessel,
  EndpointId,
  VesselSearch,
  VesselGroupVessel,
  VesselGroupUpsert,
  APIPagination,
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
} from '@globalfishingwatch/ui-components'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { ROOT_DOM_ELEMENT, SUPPORT_EMAIL, FIRST_YEAR_OF_DATA } from 'data/config'
import FileDropzone from 'features/common/FileDropzone'
import { readBlobAs } from 'utils/files'
import I18nDate from 'features/i18n/i18nDate'
import { selectAdvancedSearchDatasets } from 'features/search/search.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import styles from './VesselGroupModal.module.css'
import {
  createVesselGroupThunk,
  selectVesselGroupModalOpen,
  setModalClosed,
} from './vessel-groups.slice'

export type CSV = Record<string, any>[]

type IdColumn = 'ID' | 'MMSI' | 'SSVID'

// Look for these ID columns by order of preference
const ID_COLUMN_LOOKUP: IdColumn[] = ['ID', 'MMSI', 'SSVID']

const ID_COLUMNS_OPTIONS: SelectOption[] = ID_COLUMN_LOOKUP.map((key) => ({
  id: key,
  label: key,
}))

function VesselGroupModal(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isModalOpen = useSelector(selectVesselGroupModalOpen)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [groupName, setGroupName] = useState<string>('Long Xing')
  // TODO use empty array
  const [IDs, setIDs] = useState<string[]>(['412422360'])
  const [selectedIDColumn, setSelectedIDColumn] = useState<IdColumn>('MMSI')
  const [vessels, setVessels] = useState<Vessel[]>()

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
          if (columns.includes(presetColumn)) {
            foundIdColumn = presetColumn
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
    setIDs(e.target.value.split(/[\s|,]+/))
  }, [])

  const onVesselRemoveClick = useCallback(
    (vesselId: string) => {
      const index = vessels.findIndex((vessel) => vessel.id === vesselId)
      setVessels([...vessels.slice(0, index), ...vessels.slice(index + 1)])
    },
    [vessels]
  )

  const onClose = useCallback(() => {
    const askConfirm = vessels || IDs.length
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
      dispatch(setModalClosed)
    }
  }, [dispatch, IDs.length, t, vessels])

  const onBackClick = useCallback(() => {
    const confirmed = window.confirm(
      t(
        'vesselGroup.confirmAbort',
        'You will loose any changes made in this vessel group. Are you sure?'
      )
    )
    if (confirmed) {
      setVessels(undefined)
    }
  }, [t])

  const searchDatasets = useSelector(selectAdvancedSearchDatasets)
  const onConfirmClick = useCallback(async () => {
    if (!vessels) {
      if (!searchDatasets) return
      console.log(searchDatasets)
      setLoading(true)
      const dataset = searchDatasets[0]
      const advancedQuery = IDs.map((id) => `mmsi = '${id}'`).join(' OR ')

      const datasetConfig = {
        endpoint: EndpointId.VesselAdvancedSearch,
        datasetId: dataset.id,
        params: [],
        query: [
          { id: 'datasets', value: searchDatasets.map((d) => d.id) },
          { id: 'query', value: encodeURIComponent(advancedQuery) },
        ],
      }

      const url = resolveEndpoint(dataset, datasetConfig)
      const searchResults = await GFWAPI.fetch<APIPagination<VesselSearch>>(url)

      // TODO handle API errors

      setLoading(false)
      if (!searchResults.entries.length) {
        setError(t('vesselGroup.emptyError', 'No vessels found'))
        return
      }

      setVessels(searchResults.entries)
      return
    }
    setLoading(true)
    const vesselGroupVessels: VesselGroupVessel[] = vessels.map((vessel) => ({
      vesselId: vessel.id,
      dataset: vessel.dataset,
    }))
    const vesselGroup: VesselGroupUpsert = {
      name: groupName,
      vessels: vesselGroupVessels,
    }

    const dispatchedAction = await dispatch(createVesselGroupThunk(vesselGroup))
    console.log(dispatchedAction)
  }, [vessels, dispatch, searchDatasets, IDs, groupName])

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
          <Select
            key="source"
            label={t('vesselGroup.source', 'Source')}
            options={[{ id: 'ais', label: 'ais' }]}
            selectedOption={{ id: 'ais', label: 'ais' }}
            onSelect={(e) => console.log(e)}
          />
          <Select
            key="IDfield"
            label={t('vesselGroup.idField', 'ID field')}
            options={ID_COLUMNS_OPTIONS}
            selectedOption={selectedIDColumnOption}
            onSelect={onIdFieldChange}
          />
        </div>
        {vessels ? (
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
                value={IDs.join(', ')}
                label={
                  IDs && IDs.length
                    ? t('vesselGroup.idsWithCount', 'IDs ({{count}})', {
                        count: IDs.length,
                      })
                    : t('vesselGroup.ids', 'IDs')
                }
                placeholder={t(
                  'vesselGroup.idsPlaceholder',
                  'Type here or paste a list of IDs separated by commas, spaces or line breaks'
                )}
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

        {vessels && (
          <Button type="secondary" onClick={onBackClick}>
            {t('common.back', 'back')}
          </Button>
        )}
        <Button
          disabled={loading || !IDs.length || (vessels && !vessels.length)}
          onClick={onConfirmClick}
          loading={loading}
        >
          {t('common.save', 'Save')}
        </Button>
      </div>
    </Modal>
  )
}

export default VesselGroupModal
