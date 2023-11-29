import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FeatureCollection, LineString } from 'geojson'
import {
  Button,
  Collapsable,
  InputText,
  MultiSelect,
  MultiSelectOnChange,
  MultiSelectOption,
  Select,
  SelectOption,
} from '@globalfishingwatch/ui-components'
import {
  Dataset,
  DatasetCategory,
  DatasetConfiguration,
  DatasetConfigurationUI,
  DatasetGeometryType,
  DatasetTypes,
} from '@globalfishingwatch/api-types'
import {
  checkRecordValidity,
  getDatasetSchema,
  guessColumnsFromSchema,
} from '@globalfishingwatch/data-transforms'
import UserGuideLink from 'features/help/UserGuideLink'
import { getFileFromGeojson } from 'utils/files'
import { DatasetMetadata, NewDatasetProps } from 'features/datasets/upload/NewDataset'
import FileDropzone from 'features/datasets/upload/FileDropzone'
import { getDatasetParsed, getTrackFromList } from 'features/datasets/upload/datasets-parse.utils'
import { sortFields } from 'utils/shared'
import { isPrivateDataset } from '../datasets.utils'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
  // getDatasetSchemaFromCSV,
  getFileName,
} from './datasets-upload.utils'
import styles from './NewDataset.module.css'

export type CSV = Record<string, any>[]
export type ExtractMetadataProps = { name: string; data: any }

function NewTrackDataset({
  onConfirm,
  file,
  dataset,
  onFileUpdate,
}: NewDatasetProps): React.ReactElement {
  const { t } = useTranslation()
  const [error, setError] = useState<string>('')
  const [idGroupError, setIdGroupError] = useState<string>('')
  const [fileData, setFileData] = useState<CSV | undefined>()
  const [geojson, setGeojson] = useState<FeatureCollection<LineString> | undefined>()
  const [datasetMetadata, setDatasetMetadata] = useState<DatasetMetadata | undefined>()

  const getDatasetMetadata = useCallback(({ name, data }: ExtractMetadataProps) => {
    const schema = getDatasetSchema(data, { includeEnum: true })
    const guessedColumns = guessColumnsFromSchema(schema)
    return {
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
    }
  }, [])

  const handleRawData = useCallback(
    async (file: File) => {
      const data = await getDatasetParsed(file, 'tracks')
      setFileData(data)
      const datasetMetadata = getDatasetMetadata({ data, name: getFileName(file) })
      setDatasetMetadata((meta) => ({ ...meta, ...datasetMetadata }))
      const geojson = getTrackFromList(data, datasetMetadata)
      setGeojson(geojson)
    },
    [getDatasetMetadata]
  )

  useEffect(() => {
    if (file) {
      handleRawData(file)
    } else if (dataset) {
      const { ownerType, createdAt, endpoints, ...rest } = dataset
      setDatasetMetadata({
        ...rest,
        public: isPrivateDataset(dataset),
        type: DatasetTypes.UserTracks,
        category: DatasetCategory.Environment,
        configuration: {
          ...dataset.configuration,
        } as DatasetConfiguration,
      })
    }
  }, [dataset, file, handleRawData])

  const idProperty = getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' })

  useEffect(() => {
    if (idProperty && datasetMetadata && fileData) {
      const geojson = getTrackFromList(fileData, datasetMetadata)
      setGeojson(geojson)
      if (!geojson.features.some((f) => f.geometry.coordinates?.length >= 2)) {
        setIdGroupError(
          t('errors.trackSegmentIdGrup', "Grouping by this field doesn't generate valid tracks")
        )
      } else {
        setIdGroupError('')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idProperty])

  useEffect(() => {
    if (idProperty && datasetMetadata && fileData) {
      const geojson = getTrackFromList(fileData, datasetMetadata)
      setGeojson(geojson)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idProperty])

  const onConfirmClick = useCallback(() => {
    let file: File | undefined
    if (datasetMetadata) {
      const config = getDatasetConfiguration({ datasetMetadata })
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
          } else if (geojson) {
            file = getFileFromGeojson(geojson)
          }
        }
      }
      if (file && onConfirm) {
        onConfirm(datasetMetadata, file)
      }
    }
  }, [datasetMetadata, fileData, geojson, onConfirm, t])

  const onDatasetFieldChange = useCallback((newFields: Partial<DatasetMetadata>) => {
    setDatasetMetadata((meta) => ({ ...meta, ...(newFields as DatasetMetadata) }))
  }, [])

  const onDatasetConfigurationChange = useCallback((newConfig: Partial<DatasetConfigurationUI>) => {
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
  }, [])

  const onDatasetFieldsAllowedChange = useCallback(
    (newFilters: DatasetMetadata['fieldsAllowed']) => {
      setDatasetMetadata((meta) => ({
        ...(meta as DatasetMetadata),
        fieldsAllowed: newFilters,
      }))
    },
    []
  )

  const fieldsOptions: SelectOption[] | MultiSelectOption[] = useMemo(() => {
    const options = datasetMetadata?.schema
      ? Object.keys(datasetMetadata.schema).map((field) => {
          return { id: field, label: field }
        })
      : []
    return options.sort(sortFields)
  }, [datasetMetadata])

  const filtersFieldsOptions: SelectOption[] | MultiSelectOption[] = useMemo(() => {
    const options = datasetMetadata?.schema
      ? Object.keys(datasetMetadata.schema).flatMap((field) => {
          const schema = datasetMetadata.schema?.[field]
          const isEnumAllowed =
            (schema?.type === 'string' || schema?.type === 'boolean') && schema?.enum?.length
          const isRangeAllowed = schema?.type === 'range' && schema?.min && schema?.max
          return isEnumAllowed || isRangeAllowed ? { id: field, label: field } : []
        })
      : []
    return options
      .filter((o) => {
        return (
          o.id !== getDatasetConfigurationProperty({ datasetMetadata, property: 'latitude' }) &&
          o.id !== getDatasetConfigurationProperty({ datasetMetadata, property: 'longitude' }) &&
          o.id !== getDatasetConfigurationProperty({ datasetMetadata, property: 'timestamp' })
        )
      })
      .sort(sortFields)
  }, [datasetMetadata])

  const getSelectedOption = useCallback(
    (option: string | string[]): SelectOption | MultiSelectOption[] | undefined => {
      if (option) {
        if (Array.isArray(option)) {
          return fieldsOptions.filter((o) => option.includes(o.id)) || ([] as SelectOption[])
        }
        return fieldsOptions.find((o) => o.id === option)
      }
    },
    [fieldsOptions]
  )

  const getFieldsAllowedArray = useCallback(() => {
    return datasetMetadata?.fieldsAllowed || dataset?.fieldsAllowed || []
  }, [datasetMetadata, dataset])

  const handleFieldsAllowedRemoveItem: MultiSelectOnChange = useCallback(
    (_: MultiSelectOption, rest: MultiSelectOption[]) => {
      onDatasetFieldsAllowedChange(rest.map((f: MultiSelectOption) => f.id))
    },
    [onDatasetFieldsAllowedChange]
  )
  const handleFieldsAllowedAddItem: MultiSelectOnChange = useCallback(
    (newFilter: MultiSelectOption) => {
      onDatasetFieldsAllowedChange([...getFieldsAllowedArray(), newFilter.id])
    },
    [onDatasetFieldsAllowedChange, getFieldsAllowedArray]
  )

  const handleFieldsAllowedCleanSelection = useCallback(() => {
    onDatasetFieldsAllowedChange([])
  }, [onDatasetFieldsAllowedChange])

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
            selectedOption={
              getSelectedOption(
                getDatasetConfigurationProperty({ datasetMetadata, property: 'latitude' })
              ) as SelectOption
            }
            onSelect={(selected) => {
              onDatasetConfigurationChange({ latitude: selected.id })
            }}
          />
          <Select
            label={t('dataset.trackSegmentId', 'longitude')}
            placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
            options={fieldsOptions}
            selectedOption={
              getSelectedOption(
                getDatasetConfigurationProperty({ datasetMetadata, property: 'longitude' })
              ) as SelectOption
            }
            onSelect={(selected) => {
              onDatasetConfigurationChange({ longitude: selected.id })
            }}
          />
          <div className={styles.timestampSelectWrapper}>
            <Select
              label={t('dataset.trackSegmentTimes', 'Track segment times')}
              placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
              options={fieldsOptions}
              selectedOption={
                getSelectedOption(
                  getDatasetConfigurationProperty({ datasetMetadata, property: 'timestamp' })
                ) as SelectOption
              }
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
          options={filtersFieldsOptions}
          error={idGroupError}
          direction="top"
          selectedOption={
            getSelectedOption(
              getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' })
            ) as SelectOption
          }
          onSelect={(selected) => {
            onDatasetConfigurationChange({ idProperty: selected.id })
          }}
          onCleanClick={() => {
            onDatasetFieldChange({ fieldsAllowed: [] })
            onDatasetConfigurationChange({ idProperty: undefined })
          }}
        />
        <MultiSelect
          label={t('dataset.trackSegmentId', 'track filter property')}
          placeholder={
            getFieldsAllowedArray().length > 0
              ? getFieldsAllowedArray().join(', ')
              : t('dataset.fieldPlaceholder', 'Select a field from your dataset')
          }
          direction="top"
          disabled={!getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' })}
          options={filtersFieldsOptions}
          selectedOptions={getSelectedOption(getFieldsAllowedArray()) as MultiSelectOption[]}
          onSelect={handleFieldsAllowedAddItem}
          onRemove={handleFieldsAllowedRemoveItem}
          onCleanClick={handleFieldsAllowedCleanSelection}
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
          disabled={!file || error !== '' || idGroupError !== ''}
          // loading={loading}
        >
          {t('common.confirm', 'Confirm') as string}
        </Button>
      </div>
    </div>
  )
}

export default NewTrackDataset
