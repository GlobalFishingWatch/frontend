import { useTranslation } from 'react-i18next'
import { ParseMeta, parse as parseCSV } from 'papaparse'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Collapsable,
  InputText,
  Select,
  SelectOption,
} from '@globalfishingwatch/ui-components'
import {
  Dataset,
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
import { getDatasetSchemaFromCSV } from './upload.utils'
import styles from './NewDataset.module.css'

export type CSV = Record<string, any>[]
export type ExtractMetadataProps = { meta: ParseMeta; data: CSV; name: string }

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

  const extractMetadata = useCallback(({ meta, data, name }: ExtractMetadataProps) => {
    const guessedColumns = guessColumns(meta?.fields)
    const schema: Dataset['schema'] = getDatasetSchemaFromCSV({ data, meta })
    setDatasetMetadata((meta) => ({
      ...meta,
      name,
      public: true,
      type: DatasetTypes.UserTracks,
      category: DatasetCategory.Environment,
      schema,
      configuration: {
        configurationUI: {
          latitude: guessedColumns.latitude,
          longitude: guessedColumns.longitude,
          timestamp: guessedColumns.timestamp,
          geometryType: 'tracks' as DatasetGeometryType,
        },
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
      extractMetadata({ meta, data: data as CSV, name: file.name })
    },
    [extractMetadata]
  )

  useEffect(() => {
    if (file) {
      updateFileData(file)
    } else if (dataset) {
      setDatasetMetadata({
        id: dataset.id,
        name: dataset.name,
        description: dataset.description,
        public: true,
        type: DatasetTypes.UserTracks,
        category: DatasetCategory.Environment,
        schema: dataset.schema,
        configuration: {
          ...dataset.configuration,
        } as DatasetConfiguration,
      })
    }
  }, [dataset, file, updateFileData])

  const onConfirmClick = useCallback(() => {
    let file: File | undefined
    if (datasetMetadata) {
      const config = {
        ...datasetMetadata?.configuration,
        ...datasetMetadata?.configuration?.configurationUI,
      } as DatasetConfiguration
      if (fileData) {
        if (!config?.latitude || !config?.longitude || !config?.timestamp) {
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
            ...config,
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
            console.log('FILE DATA', fileData)
            const segments = csvToTrackSegments({
              records: fileData as CSV,
              ...(config as any),
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
          configurationUI: {
            ...meta?.configuration?.configurationUI,
            ...(newConfig as DatasetMetadata['configuration']),
          },
        },
      }))
    },
    []
  )

  const fieldsOptions: SelectOption[] = useMemo(
    () =>
      (datasetMetadata?.schema &&
        Object.keys(datasetMetadata.schema).map((field) => ({ id: field, label: field }))) ||
      [],
    [datasetMetadata]
  )

  const selectedOption = useCallback(
    (option: string): SelectOption => ({
      label: (datasetMetadata?.configuration?.configurationUI?.[option] ||
        datasetMetadata?.configuration?.[option]) as string,
      id:
        datasetMetadata?.configuration?.configurationUI?.[option] ||
        datasetMetadata?.configuration?.configurationUI?.[option],
    }),
    [datasetMetadata]
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
        <div className={styles.requiredDataContainer}>
          <Select
            label={t('dataset.trackSegmentId', 'latitude')}
            placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
            options={fieldsOptions}
            selectedOption={selectedOption('latitude')}
            onSelect={(selected) => {
              onDatasetConfigurationChange({ latitude: selected.id })
            }}
          />
          <Select
            label={t('dataset.trackSegmentId', 'longitude')}
            placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
            options={fieldsOptions}
            selectedOption={selectedOption('longitude')}
            onSelect={(selected) => {
              onDatasetConfigurationChange({ longitude: selected.id })
            }}
          />
          <div className={styles.timestampSelectWrapper}>
            <Select
              label={t('dataset.trackSegmentTimes', 'Track segment times')}
              placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
              options={fieldsOptions}
              selectedOption={selectedOption('timestamp')}
              onSelect={(selected) => {
                onDatasetConfigurationChange({ timestamp: selected.id })
              }}
            />
          </div>
        </div>
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
          options={fieldsOptions}
          direction="top"
          selectedOption={selectedOption('idProperty')}
          onSelect={(selected) => {
            onDatasetConfigurationChange({ idProperty: selected.id })
          }}
        />
        {/* <section className={styles.trackTimestampFiltersContainer}>
          <p className={styles.label}>Track Time Filter</p>
          <div className={styles.trackTimestampSelectors}>
            <Select
              placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
              options={[
                { id: 'timerange', label: 'timerange' },
                { id: 'timestamp', label: 'timestamp' },
              ]}
              selectedOption={undefined}
              onSelect={(selected) => {
                onDatasetConfigurationChange({ idProperty: selected.id })
              }}
            />
            <Select
              placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
              options={fieldsOptions}
              selectedOption={selectedOption('idProperty')}
              onSelect={(selected) => {
                onDatasetConfigurationChange({ idProperty: selected.id })
              }}
            />
            <Select
              placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
              options={fieldsOptions}
              selectedOption={selectedOption('idProperty')}
              onSelect={(selected) => {
                onDatasetConfigurationChange({ idProperty: selected.id })
              }}
            />
          </div>
        </section> */}
        <Select
          label={t('dataset.trackSegmentId', 'track filter property')}
          placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
          options={fieldsOptions}
          direction="top"
          selectedOption={selectedOption('filter')}
          onSelect={(selected) => {
            onDatasetConfigurationChange({ filter: selected.id })
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
