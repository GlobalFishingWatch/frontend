import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { parse as parseCSV } from 'papaparse'
import { useSelector } from 'react-redux'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { Select, SelectOption, TextArea } from '@globalfishingwatch/ui-components'
import FileDropzone from 'features/datasets/upload/FileDropzone'
import { readBlobAs } from 'utils/files'
import { useAppDispatch } from 'features/app/app.hooks'
import { ID_COLUMN_LOOKUP, ID_COLUMNS_OPTIONS } from 'features/vessel-groups/vessel-groups.config'
import { selectHasVesselGroupSearchVessels } from 'features/vessel-groups/vessel-groups.selectors'
import {
  selectVesselGroupModalSearchIdField,
  selectVesselGroupsModalSearchIds,
  setVesselGroupSearchIdField,
  setVesselGroupModalSearchIds,
} from './vessel-groups-modal.slice'
import styles from './VesselGroupModal.module.css'

function VesselGroupSearch({ onError }: { onError: (string: any) => void }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText, 200)
  const searchIdField = useSelector(selectVesselGroupModalSearchIdField)
  const vesselGroupVesselsToSearch = useSelector(selectVesselGroupsModalSearchIds)
  const hasGroupVesselsToSearch =
    vesselGroupVesselsToSearch && vesselGroupVesselsToSearch.length > 0
  const hasVesselGroupsVessels = useSelector(selectHasVesselGroupSearchVessels)

  useEffect(() => {
    if (debouncedSearchText) {
      const vesselIds = debouncedSearchText?.split(/[\s|,]+/).filter(Boolean)
      dispatch(setVesselGroupModalSearchIds(vesselIds))
    } else {
      dispatch(setVesselGroupModalSearchIds(null))
    }
  }, [dispatch, debouncedSearchText])

  const onIdsTextareaChange = useCallback((e: any) => {
    setSearchText(e.target.value)
  }, [])

  const onCSVLoaded = useCallback(
    async (file: File) => {
      const fileData = await readBlobAs(file, 'text')
      const { data } = parseCSV(fileData, {
        header: true,
        skipEmptyLines: true,
      })
      if (data.length) {
        const firstRow = data[0]
        const columns = Object.keys(firstRow as any)
        let foundIdColumn: string | undefined
        // Try to find a CSV column matching preset ids
        for (let i = 0; i < ID_COLUMN_LOOKUP.length; i++) {
          const presetColumn = ID_COLUMN_LOOKUP[i]
          foundIdColumn = columns.find((c) => c.toLowerCase() === presetColumn)
          if (foundIdColumn) {
            dispatch(setVesselGroupSearchIdField(presetColumn))
            break
          }
        }

        if (columns.length > 1 && !foundIdColumn) {
          onError(
            t(
              'vesselGroup.csvError',
              'Uploaded CSV file has multiple columns and there is no obvious ID column'
            )
          )
          return
        }
        onError('')
        foundIdColumn = foundIdColumn || columns[0]

        if (foundIdColumn) {
          const groupvessels = data.map((row: any) => row?.[foundIdColumn as string]).join(',')
          setSearchText(groupvessels)
        }
      }
    },
    [dispatch, onError, t]
  )

  const onIdFieldChange = useCallback(
    (option: SelectOption) => {
      dispatch(setVesselGroupSearchIdField(option.id))
    },
    [dispatch]
  )

  return (
    <div className={styles.vesselGroupInput}>
      <div className={styles.ids}>
        <Select
          label={t('vesselGroup.idField', 'ID field')}
          options={ID_COLUMNS_OPTIONS}
          selectedOption={ID_COLUMNS_OPTIONS.find((o) => o.id === searchIdField)}
          onSelect={onIdFieldChange}
          disabled={hasVesselGroupsVessels}
        />
        <TextArea
          className={styles.idsArea}
          value={searchText}
          label={
            hasGroupVesselsToSearch
              ? `${searchIdField} (${vesselGroupVesselsToSearch?.length})`
              : searchIdField
          }
          placeholder={t('vesselGroup.idsPlaceholder', {
            field: searchIdField,
            defaultValue:
              'Type here or paste a list of {{field}} separated by commas, spaces or line breaks',
          })}
          onChange={onIdsTextareaChange}
        />
      </div>
      <div className={styles.dropzoneContainer}>
        <FileDropzone className={styles.dropzone} onFileLoaded={onCSVLoaded} fileTypes={['CSV']} />
      </div>
    </div>
  )
}

export default VesselGroupSearch
