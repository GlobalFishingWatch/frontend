import { useTranslation } from 'react-i18next'
import { ParseMeta, parse as parseCSV } from 'papaparse'
import { useCallback, useEffect, useState } from 'react'
import { Button, Collapsable, InputText, Select } from '@globalfishingwatch/ui-components'
import {
  DatasetCategory,
  DatasetConfiguration,
  DatasetGeometryType,
  DatasetTypes,
} from '@globalfishingwatch/api-types'
import {
  checkRecordValidity,
  csvToTrackSegments,
  guessColumns,
  segmentsToGeoJSON,
} from '@globalfishingwatch/data-transforms'
import UserGuideLink from 'features/help/UserGuideLink'
import { getFileFromGeojson, readBlobAs } from 'utils/files'
import { DatasetMetadata, NewDatasetProps } from 'features/datasets/upload/NewDataset'
import FileDropzone from 'features/datasets/upload/FileDropzone'
import styles from './NewDataset.module.css'

export type CSV = Record<string, any>[]

function NewTrackDataset({
  onConfirm,
  file,
  dataset,
  onFileUpdate,
}: NewDatasetProps): React.ReactElement {
  const { t } = useTranslation()
  const [error, setError] = useState<string | undefined>()
  const [fileData, setFileData] = useState<CSV | undefined>()
  const [datasetMetadata, setDatasetMetadata] = useState<DatasetMetadata | undefined>()

  const extractMetadata = useCallback((meta: ParseMeta) => {
    const guessedColumns = guessColumns(meta?.fields)
    setDatasetMetadata((meta) => ({
      ...meta,
      name: 'TODO',
      public: true,
      type: DatasetTypes.UserTracks,
      category: DatasetCategory.Environment,
      fields: meta?.fields,
      guessedFields: guessedColumns,
      configuration: {
        latitude: guessedColumns.latitude,
        longitude: guessedColumns.longitude,
        timestamp: guessedColumns.timestamp,
        geometryType: 'tracks' as DatasetGeometryType,
      } as DatasetConfiguration,
    }))
  }, [])

  const updateFileData = useCallback(
    async (file: File) => {
      const fileData = await readBlobAs(file, 'text')
      const { data, meta } = parseCSV(fileData, {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      })
      setFileData(data as CSV)
      extractMetadata(meta)
    },
    [extractMetadata]
  )

  useEffect(() => {
    if (file) {
      updateFileData(file)
    } else if (dataset) {
      console.log('TODO', dataset)
      setDatasetMetadata((meta) => ({
        ...meta,
        id: dataset.id,
        name: dataset.name,
        description: dataset.description,
        public: true,
        type: DatasetTypes.UserTracks,
        category: DatasetCategory.Environment,
        fields: meta?.fields,
        configuration: {
          latitude: dataset?.configuration?.latitude,
          longitude: dataset?.configuration?.longitude,
          timestamp: dataset?.configuration?.timestamp,
          geometryType: 'tracks' as DatasetGeometryType,
        } as DatasetConfiguration,
      }))
      // setDatasetMetadata(dataset)
    }
  }, [dataset, file, updateFileData])

  const onConfirmClick = useCallback(() => {
    let file: File | undefined
    if (datasetMetadata) {
      if (fileData) {
        if (
          !datasetMetadata.configuration?.latitude ||
          !datasetMetadata.configuration?.longitude ||
          !datasetMetadata.configuration?.timestamp
        ) {
          const fields = ['latitude', 'longitude', 'timestamp'].map((f) =>
            t(`common.${f}` as any, f)
          )
          setError(
            t('dataset.requiredFields', {
              fields,
              defaultValue: `Required fields ${fields}`,
            })
          )
        } else {
          const errors = checkRecordValidity({
            record: (fileData as CSV)[0],
            ...datasetMetadata.configuration,
          } as any)
          if (errors.length) {
            const fields = errors.map((error) => t(`common.${error}` as any, error)).join(',')
            setError(
              t('errors.fields', {
                fields,
                defaultValue: `Error with fields: ${fields}`,
              })
            )
          } else {
            const segments = csvToTrackSegments({
              records: fileData as CSV,
              ...(datasetMetadata.configuration as any),
            })
            const geoJSON = segmentsToGeoJSON(segments)
            file = getFileFromGeojson(geoJSON)
          }
        }
      }
      if (onConfirm) {
        onConfirm(datasetMetadata, file)
      }
    }
  }, [datasetMetadata, fileData, onConfirm, t])

  const onDatasetFieldChange = useCallback((newFields: Partial<DatasetMetadata>) => {
    setDatasetMetadata((meta) => ({ ...meta, ...(newFields as DatasetMetadata) }))
  }, [])

  const onDatasetConfigurationChange = useCallback(
    (newConfig: Partial<DatasetMetadata['configuration']>) => {
      setDatasetMetadata((meta) => ({
        ...(meta as DatasetMetadata),
        configuration: {
          ...meta?.configuration,
          ...(newConfig as DatasetMetadata['configuration']),
        },
      }))
    },
    []
  )

  return (
    <div className={styles.container}>
      {!dataset && (
        <div className={styles.file}>
          <FileDropzone label={file?.name} fileTypes={['csv']} onFileLoaded={onFileUpdate} />
        </div>
      )}
      <div className={styles.content}>
        <InputText
          value={datasetMetadata?.name}
          label={t('common.name', 'Name')}
          className={styles.input}
          onChange={(e) => onDatasetFieldChange({ name: e.target.value })}
        />
      </div>
      <Collapsable
        className={styles.optional}
        label={t('dataset.optionalFields', 'Optional fields')}
      >
        <InputText
          value={datasetMetadata?.description}
          label={t('dataset.description', 'Dataset description')}
          className={styles.input}
          onChange={(e) => onDatasetFieldChange({ description: e.target.value })}
        />
        <Select
          label={t('dataset.trackSegmentId', 'Individual track segment id')}
          placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
          options={[{ id: 'TODO', label: 'TODO' }]}
          selectedOption={undefined}
          onSelect={(selected) => {
            onDatasetConfigurationChange({ idProperty: selected.id })
          }}
        />
      </Collapsable>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
          {/* // TODO update sections by categoreies */}
          <UserGuideLink section="uploadReference" />
        </div>
        <Button
          className={styles.saveBtn}
          onClick={onConfirmClick}
          // disabled={!file || !metadata?.name}
          // loading={loading}
        >
          {t('common.confirm', 'Confirm') as string}
        </Button>
      </div>
    </div>
  )
}

export default NewTrackDataset
