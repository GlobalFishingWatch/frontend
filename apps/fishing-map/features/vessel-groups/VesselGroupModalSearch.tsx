import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { parse as parseCSV } from 'papaparse'

import { resolveVesselPropertyColumn } from '@globalfishingwatch/data-transforms'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Checkbox, Select, TextArea } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import FileDropzone from 'features/datasets/upload/FileDropzone'
import { FLAG_LENGTH, SSVID_LENGTH, VESSEL_ID_LENGTH } from 'features/search/search.config'
import { CSV_COLUMN_LOOKUP, ID_COLUMNS_OPTIONS } from 'features/vessel-groups/vessel-groups.config'
import { readBlobAs } from 'utils/files'
import { listAsSentence } from 'utils/shared'

import { selectVesselGroupsModalSearchIds } from './vessel-groups.selectors'
import type { VesselGroupCsvData } from './vessel-groups-modal.slice'
import {
  selectVesselGroupModalCsvColumns,
  selectVesselGroupModalCsvData,
  selectVesselGroupModalSearchIdField,
  selectVesselGroupsModalSearchText,
  setVesselGroupModalCsvColumns,
  setVesselGroupModalCsvData,
  setVesselGroupModalSearchText,
  setVesselGroupSearchIdField,
} from './vessel-groups-modal.slice'

import styles from './VesselGroupModal.module.css'

function VesselGroupSearch({ onError }: { onError: (string: any) => void }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [csvName, setCsvName] = useState<string>('')
  const csvData = useSelector(selectVesselGroupModalCsvData)
  const selectedCsvColumns = useSelector(selectVesselGroupModalCsvColumns)
  const sliceSearchText = useSelector(selectVesselGroupsModalSearchText)
  const [searchText, setSearchText] = useState(sliceSearchText)
  const debouncedSearchText = useDebounce(searchText, 200)
  const searchIdField = useSelector(selectVesselGroupModalSearchIdField)
  const vesselGroupModalSearchIds = useSelector(selectVesselGroupsModalSearchIds)
  const hasGroupVesselsToSearch = vesselGroupModalSearchIds && vesselGroupModalSearchIds.length > 0
  const showIdsSection = !csvData?.length
  const showDropzoneSection = !vesselGroupModalSearchIds?.length
  const showDivider = showIdsSection && showDropzoneSection

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

  const onCSVLoaded = useCallback(
    async (file: File) => {
      setCsvName(file.name)
      const fileData = await readBlobAs(file, 'text')
      const { data } = parseCSV<VesselGroupCsvData>(fileData, {
        header: true,
        skipEmptyLines: true,
      })
      dispatch(setVesselGroupModalCsvData(data))
      setSearchText('')
    },
    [dispatch]
  )

  const onIdFieldChange = useCallback(
    (option: SelectOption) => {
      dispatch(setVesselGroupSearchIdField(option.id))
    },
    [dispatch]
  )

  const toggleCsvColumn = useCallback(
    (column: string) => {
      const newSelectedCsvColumns = selectedCsvColumns?.includes(column)
        ? selectedCsvColumns.filter((c) => c !== column)
        : [...(selectedCsvColumns || []), column]
      dispatch(setVesselGroupModalCsvColumns(newSelectedCsvColumns))
    },
    [dispatch, selectedCsvColumns]
  )

  const selectableColumns = useMemo(() => {
    if (!csvData?.[0]) return []
    return Object.keys(csvData[0]).filter((column) => {
      const resolved = resolveVesselPropertyColumn(column)
      if (!resolved) return false
      const values = csvData.map((row) => row[column])
      if (resolved === 'flag') {
        return values.every((v) => v?.length === FLAG_LENGTH) // ISO3
      }
      if (resolved === 'mmsi') {
        return values.every((v) => v?.length === SSVID_LENGTH) // MMSI
      }
      if (resolved === 'vesselId') {
        return values.every((v) => v?.length === VESSEL_ID_LENGTH) // GFW Vessel ID
      }
      return false
    })
  }, [csvData])

  return (
    <div className={styles.vesselGroupSearchContainer}>
      {showIdsSection && (
        <div className={styles.ids}>
          <Select
            label={t((t) => t.vesselGroup.idField)}
            options={ID_COLUMNS_OPTIONS}
            selectedOption={ID_COLUMNS_OPTIONS.find((o) => o.id === searchIdField)}
            onSelect={onIdFieldChange}
          />
          <TextArea
            className={styles.idsArea}
            value={searchText}
            label={
              t((t) => t.vesselGroup.idsList, {
                field: searchIdField,
              }) + (hasGroupVesselsToSearch ? ` (${vesselGroupModalSearchIds?.length})` : '')
            }
            placeholder={t((t) => t.vesselGroup.idsPlaceholder, {
              field: searchIdField,
            })}
            onChange={onIdsTextareaChange}
          />
        </div>
      )}
      {showDivider && <div className={styles.divider} />}
      {showDropzoneSection && (
        <div className={styles.dropzoneContainer}>
          <label>
            {t((t) => t.vesselGroup.csvFile)}{' '}
            <a
              href="https://globalfishingwatch.org/user-guide/#Vessel%20groups"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.dropzoneLink}
            >
              ({t((t) => t.vesselGroup.csvLink)})
            </a>
          </label>
          <FileDropzone
            className={cx(styles.dropzone, { [styles.filled]: csvData?.length })}
            onFileLoaded={onCSVLoaded}
            fileTypes={['CSV']}
            label={
              csvName
                ? csvName
                : t((t) => t.vesselGroup.csvPlaceholder, {
                    field: listAsSentence(CSV_COLUMN_LOOKUP, 'or'),
                  })
            }
          />
        </div>
      )}
      {csvData && csvData.length > 0 && (
        <div className={styles.columnSelectionWrapper}>
          <label>{t((t) => t.vesselGroup.columnSelection)}</label>
          <div className={styles.vesselsTableContainer}>
            {selectableColumns.length > 0 ? (
              <table className={styles.vesselsTable}>
                <thead>
                  <tr>
                    {selectableColumns.map((column, index) => {
                      const isSelected =
                        selectedCsvColumns !== null && selectedCsvColumns.includes(column)
                      return (
                        <th key={index}>
                          <Checkbox
                            active={isSelected}
                            onClick={() => toggleCsvColumn(column)}
                            label={column}
                            className={styles.columnCheckbox}
                            labelClassname={cx(styles.columnHeader, {
                              [styles.selected]: isSelected,
                            })}
                          />
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 100).map((row, rowIndex) => {
                    return (
                      <tr key={rowIndex} className={rowIndex % 2 !== 0 ? styles.odd : ''}>
                        {Object.keys(row).map((column, cellIndex) => {
                          const isSelectable = selectableColumns.includes(column)
                          const isSelected =
                            selectedCsvColumns !== null && selectedCsvColumns.includes(column)
                          if (!isSelectable) {
                            return null
                          }
                          return (
                            <td
                              key={cellIndex}
                              title={row[column]}
                              className={cx(styles.columnCell, { [styles.selected]: isSelected })}
                            >
                              {row[column]}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className={cx(styles.errorPlaceholder, styles.errorMsg)}>
                {t((t) => t.vesselGroup.noColumnsToSelect)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VesselGroupSearch
