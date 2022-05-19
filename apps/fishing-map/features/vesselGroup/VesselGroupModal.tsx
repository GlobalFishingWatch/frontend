import React, { useState, useCallback, Fragment } from 'react'
import type { FeatureCollectionWithFilename } from 'shpjs'
import { useTranslation } from 'react-i18next'
// import { parse as parseCSV } from 'papaparse'
import { Feature } from 'geojson'
import { parse as parseCSV } from 'papaparse'
import {
  Modal,
  Button,
  Select,
  SelectOption,
  InputText,
  TextArea,
} from '@globalfishingwatch/ui-components'
import { ROOT_DOM_ELEMENT, SUPPORT_EMAIL } from 'data/config'
import FileDropzone from 'features/common/FileDropzone'
import { readBlobAs } from 'utils/files'
import styles from './VesselGroupModal.module.css'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onClose = useCallback(() => {
    console.log('close')
  }, [])

  const [groupName, setGroupName] = useState<string>('Long Xing')
  const [IDs, setIDs] = useState<string[]>(['1234567, 123242432, 2312321'])
  const [selectedIDColumn, setSelectedIDColumn] = useState<IdColumn>('MMSI')

  const onCSVLoaded = useCallback(
    async (file: File) => {
      const fileData = await readBlobAs(file, 'text')
      const { data } = parseCSV(fileData, {
        header: true,
        skipEmptyLines: true,
      })
      console.log(data)
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
        console.log(foundIdColumn)
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

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={t('vesselGroup.vesselGroup', 'Vessel group')}
      isOpen={true}
      //   isOpen={datasetModal === 'new'}
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
        <div className={styles.vesselGroup}>
          <div className={styles.ids}>
            <TextArea
              value={IDs.join(', ')}
              label={t('vesselGroup.ids', 'IDs')}
              //   label={t('vesselGroup.idsWithCount', 'IDs ({{count}})', {
              //     count: 123,
              //   })}
              placeholder={t(
                'vesselGroup.idsPlaceholder',
                'Type here or paste a list of IDs separated by commas, spaces or line breaks'
              )}
              onChange={onIdsTextareaChange}
            />
          </div>
          <div>
            <FileDropzone onFileLoaded={onCSVLoaded} fileTypes={['csv']} />
          </div>
        </div>
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

        <Button
          disabled={true}
          // onClick={onConfirmClick}
          loading={loading}
        >
          {t('common.save', 'Save')}
        </Button>
      </div>
    </Modal>
  )
}

export default VesselGroupModal
