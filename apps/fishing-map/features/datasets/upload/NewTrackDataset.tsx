import { useTranslation } from 'react-i18next'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { FeatureCollection } from 'geojson'
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
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import UserGuideLink from 'features/help/UserGuideLink'
import { FileType, getFileFromGeojson, getFileType, getFileName } from 'utils/files'
import { DatasetMetadata, NewDatasetProps } from 'features/datasets/upload/NewDataset'
import FileDropzone from 'features/datasets/upload/FileDropzone'
import {
  DataList,
  getDatasetParsed,
  getTrackFromList,
} from 'features/datasets/upload/datasets-parse.utils'
import { sortFields } from 'utils/shared'
import { isPrivateDataset } from '../datasets.utils'
import styles from './NewDataset.module.css'

export type ExtractMetadataProps = { name: string; sourceFormat?: FileType; data: any }

const getDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
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
        sourceFormat,
        latitude: guessedColumns.latitude,
        longitude: guessedColumns.longitude,
        timestamp: guessedColumns.timestamp,
        geometryType: 'tracks' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}

function NewTrackDataset({
  onConfirm,
  file,
  dataset,
  onFileUpdate,
}: NewDatasetProps): React.ReactElement {
  const { t } = useTranslation()
  const [error, setError] = useState<string>('')
  const [idGroupError, setIdGroupError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [sourceData, setSourceData] = useState<DataList | undefined>()
  const [geojson, setGeojson] = useState<FeatureCollection | undefined>()
  const [datasetMetadata, setDatasetMetadata] = useState<DatasetMetadata | undefined>()
  const isEditing = dataset?.id !== undefined
  const fileType = getFileType(file)
  const sourceFormat = getDatasetConfigurationProperty({ dataset, property: 'sourceFormat' })
  const isCSVFile = fileType === 'csv' || sourceFormat === 'csv'

  const handleRawData = useCallback(
    async (file: File) => {
      setLoading(true)
      const data = await getDatasetParsed(file, 'tracks')
      const datasetMetadata = getDatasetMetadata({
        data,
        name: getFileName(file),
        sourceFormat: fileType as FileType,
      })
      setDatasetMetadata((meta) => ({ ...meta, ...datasetMetadata }))
      if (fileType === 'csv') {
        setSourceData(data as DataList)
        const geojson = getTrackFromList(data as DataList, datasetMetadata)
        setGeojson(geojson)
      } else {
        setGeojson(data as FeatureCollection)
      }
      setLoading(false)
    },
    [fileType]
  )

  useEffect(() => {
    if (file && !loading) {
      console.log('🚀 ~ useEffect ~ file:', file)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, file])

  const idProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'idProperty',
  })

  useEffect(() => {
    if (idProperty && datasetMetadata && sourceData) {
      const geojson = getTrackFromList(sourceData, datasetMetadata)
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

  const onConfirmClick = useCallback(async () => {
    let error = ''
    setLoading(true)
    if (datasetMetadata) {
      const config = getDatasetConfiguration(datasetMetadata)
      if (sourceData) {
        if (!config?.latitude || !config?.longitude || !config?.timestamp) {
          const fields = ['latitude', 'longitude', 'timestamp'].map((f) =>
            t(`common.${f}` as any, f)
          )
          error = t('dataset.requiredFields', {
            fields,
            defaultValue: `Required fields ${fields}`,
          })
        } else {
          const errors = checkRecordValidity({
            record: sourceData?.[0],
            ...config,
          } as any)
          if (errors.length) {
            const fields = errors.map((error) => t(`common.${error}` as any, error)).join(',')
            error = t('errors.fields', {
              fields,
              defaultValue: `Error with fields: ${fields}`,
            })
          }
        }
      }
      if (error) {
        setError(error)
      } else if (geojson) {
        const file = getFileFromGeojson(geojson)
        if (file && onConfirm) {
          await onConfirm(datasetMetadata, file)
        }
      }
    }
    setLoading(true)
  }, [datasetMetadata, geojson, onConfirm, sourceData, t])

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
          o.id !==
            getDatasetConfigurationProperty({ dataset: datasetMetadata, property: 'latitude' }) &&
          o.id !==
            getDatasetConfigurationProperty({ dataset: datasetMetadata, property: 'longitude' }) &&
          o.id !==
            getDatasetConfigurationProperty({ dataset: datasetMetadata, property: 'timestamp' })
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
      {!isEditing && (
        <div className={styles.file}>
          <FileDropzone
            label={file?.name}
            fileTypes={[fileType as FileType]}
            onFileLoaded={onFileUpdate}
          />
        </div>
      )}
      <div className={styles.content}>
        <InputText
          value={datasetMetadata?.name}
          label={t('common.name', 'Name')}
          className={styles.input}
          onChange={(e) => onDatasetFieldChange({ name: e.target.value })}
        />
        {isCSVFile && (
          <div className={styles.requiredDataContainer}>
            {!isEditing ? (
              <Select
                label={t('dataset.trackSegmentId', 'latitude')}
                placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
                options={fieldsOptions}
                disabled={isEditing}
                selectedOption={
                  getSelectedOption(
                    getDatasetConfigurationProperty({
                      dataset: datasetMetadata,
                      property: 'latitude',
                    })
                  ) as SelectOption
                }
                onSelect={(selected) => {
                  onDatasetConfigurationChange({ latitude: selected.id })
                }}
              />
            ) : (
              <InputText
                value={getDatasetConfigurationProperty({
                  dataset: datasetMetadata,
                  property: 'latitude',
                })}
                label={t('dataset.trackSegmentId', 'latitude')}
                className={styles.input}
                disabled
              />
            )}
            {!isEditing ? (
              <Select
                label={t('dataset.trackSegmentId', 'longitude')}
                placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
                options={fieldsOptions}
                disabled={isEditing}
                selectedOption={
                  getSelectedOption(
                    getDatasetConfigurationProperty({
                      dataset: datasetMetadata,
                      property: 'longitude',
                    })
                  ) as SelectOption
                }
                onSelect={(selected) => {
                  onDatasetConfigurationChange({ longitude: selected.id })
                }}
              />
            ) : (
              <InputText
                value={getDatasetConfigurationProperty({
                  dataset: datasetMetadata,
                  property: 'longitude',
                })}
                label={t('dataset.trackSegmentId', 'longitude')}
                className={styles.input}
                disabled
              />
            )}
            <div className={styles.timestampSelectWrapper}>
              {!isEditing ? (
                <Select
                  label={t('dataset.trackSegmentTimes', 'Track segment times')}
                  placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
                  options={fieldsOptions}
                  disabled={isEditing}
                  selectedOption={
                    getSelectedOption(
                      getDatasetConfigurationProperty({
                        dataset: datasetMetadata,
                        property: 'timestamp',
                      })
                    ) as SelectOption
                  }
                  onSelect={(selected) => {
                    onDatasetConfigurationChange({ timestamp: selected.id })
                  }}
                />
              ) : (
                <InputText
                  value={getDatasetConfigurationProperty({
                    dataset: datasetMetadata,
                    property: 'timestamp',
                  })}
                  label={t('dataset.trackSegmentId', 'timestamp')}
                  className={styles.input}
                  disabled
                />
              )}
            </div>
          </div>
        )}
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
        {isCSVFile && (
          <Fragment>
            {!isEditing ? (
              <Select
                label={t('dataset.trackSegmentId', 'Individual track segment id')}
                placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
                options={filtersFieldsOptions}
                error={idGroupError}
                direction="top"
                disabled={isEditing}
                selectedOption={
                  getSelectedOption(
                    getDatasetConfigurationProperty({
                      dataset: datasetMetadata,
                      property: 'idProperty',
                    })
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
            ) : (
              <InputText
                value={getDatasetConfigurationProperty({
                  dataset: datasetMetadata,
                  property: 'idProperty',
                })}
                label={t('dataset.trackSegmentId', 'idProperty')}
                className={styles.input}
                disabled
              />
            )}
          </Fragment>
        )}
        <MultiSelect
          label={t('dataset.trackSegmentId', 'track filter property')}
          placeholder={
            getFieldsAllowedArray().length > 0
              ? getFieldsAllowedArray().join(', ')
              : t('dataset.fieldPlaceholder', 'Select a field from your dataset')
          }
          direction="top"
          disabled={
            isCSVFile &&
            !getDatasetConfigurationProperty({ dataset: datasetMetadata, property: 'idProperty' })
          }
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
          loading={loading}
        >
          {t('common.confirm', 'Confirm') as string}
        </Button>
      </div>
    </div>
  )
}

export default NewTrackDataset
