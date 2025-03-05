import { useCallback, useEffect,useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { parse as parseCSV } from 'papaparse'

import { useDebounce } from '@globalfishingwatch/react-hooks'
import { TextArea } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import FileDropzone from 'features/datasets/upload/FileDropzone'
import { ID_COLUMN_LOOKUP } from 'features/vessel-groups/vessel-groups.config'
import { readBlobAs } from 'utils/files'

import { selectVesselGroupsModalSearchIds } from './vessel-groups.selectors'
import type { IdField } from './vessel-groups.slice'
import {
  selectVesselGroupModalSearchIdField,
  selectVesselGroupsModalSearchText,
  setVesselGroupModalSearchText,
  setVesselGroupSearchIdField,
} from './vessel-groups-modal.slice'

import styles from './VesselGroupModal.module.css'

function VesselGroupSearch({ onError }: { onError: (string: any) => void }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [csvData, setCsvData] = useState<string[]>([])
  const sliceSearchText = useSelector(selectVesselGroupsModalSearchText)
  const [searchText, setSearchText] = useState(sliceSearchText)
  const debouncedSearchText = useDebounce(searchText, 200)
  const searchIdField = useSelector(selectVesselGroupModalSearchIdField)
  const vesselGroupVesselsToSearch = useSelector(selectVesselGroupsModalSearchIds)
  const hasGroupVesselsToSearch =
    vesselGroupVesselsToSearch && vesselGroupVesselsToSearch.length > 0

  useEffect(() => {
    if (debouncedSearchText) {
      dispatch(setVesselGroupModalSearchText(debouncedSearchText))
    } else {
      dispatch(setVesselGroupModalSearchText(''))
    }
  }, [dispatch, debouncedSearchText])

  const onIdsTextareaChange = useCallback((e: any) => {
    setSearchText(e.target.value)
  }, [])

  const updateSearchByIdField = useCallback(
    (data: string[], idField: IdField | '') => {
      if (data.length) {
        const firstRow = data[0]
        const columns = Object.keys(firstRow as any)
        let foundIdColumn
        if (idField) {
          foundIdColumn = columns.find((c) => c.toLowerCase() === idField.toLowerCase())!
        } else {
          // Try to find a CSV column matching preset ids
          for (let i = 0; i < ID_COLUMN_LOOKUP.length; i++) {
            const presetColumn = ID_COLUMN_LOOKUP[i]
            foundIdColumn = columns.find((c) => c.toLowerCase() === presetColumn.toLowerCase())
            if (foundIdColumn) {
              dispatch(setVesselGroupSearchIdField(presetColumn))
              break
            } else {
              foundIdColumn = columns?.[0]
            }
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
        } else {
          onError('')
        }

        if (foundIdColumn) {
          const groupvessels = data
            .map((row: any) => row?.[foundIdColumn as string])
            .filter(Boolean)
            .join(',')
          setSearchText(groupvessels)
        }
      }
    },
    [dispatch, onError, setSearchText, t]
  )

  const onCSVLoaded = useCallback(
    async (file: File) => {
      const fileData = await readBlobAs(file, 'text')
      const { data } = parseCSV(fileData, {
        header: true,
        skipEmptyLines: true,
      }) as { data: string[] }
      setCsvData(data)
      updateSearchByIdField(data, searchIdField)
    },
    [searchIdField, updateSearchByIdField]
  )

  useEffect(() => {
    if (csvData && searchIdField) {
      updateSearchByIdField(csvData, searchIdField)
    }
     
  }, [searchIdField])

  return (
    <div className={styles.vesselGroupInput}>
      <div className={styles.ids}>
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
