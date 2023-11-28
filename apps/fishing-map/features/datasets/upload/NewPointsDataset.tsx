import { useTranslation } from 'react-i18next'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { FeatureCollection, Point } from 'geojson'
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
import { getDatasetSchema, guessColumnsFromSchema } from '@globalfishingwatch/data-transforms'
import {
  Dataset,
  DatasetCategory,
  DatasetConfiguration,
  DatasetGeometryType,
  DatasetTypes,
} from '@globalfishingwatch/api-types'
import UserGuideLink from 'features/help/UserGuideLink'
import { DatasetMetadata, NewDatasetProps } from 'features/datasets/upload/NewDataset'
import { sortFields } from 'utils/shared'
import { FileType, getFileFromGeojson } from 'utils/files'
import { isPrivateDataset } from '../datasets.utils'
import styles from './NewDataset.module.css'
import { ExtractMetadataProps } from './NewTrackDataset'
import { getDatasetParsed, getFileType, getGeojsonFromPointsList } from './datasets-parse.utils'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
  getFileName,
} from './datasets-upload.utils'
import FileDropzone from './FileDropzone'

function NewPointDataset({
  onConfirm,
  file,
  dataset,
  onFileUpdate,
}: NewDatasetProps): React.ReactElement {
  const { t } = useTranslation()
  const [error, setError] = useState<string>('')
  const [idGroupError, setIdGroupError] = useState<string>('')
  const [fileData, setFileData] = useState<CSV | undefined>()
  const [fileType, setFileType] = useState<FileType>()
  const [geojson, setGeojson] = useState<FeatureCollection<Point> | undefined>()
  const [datasetMetadata, setDatasetMetadata] = useState<DatasetMetadata | undefined>()

  const getDatasetMetadata = useCallback(({ name, data }: ExtractMetadataProps) => {
    const schema = getDatasetSchema(data, { includeEnum: true })
    const isNotGeoStandard = data.type !== 'FeatureCollection'
    const guessedColumns = guessColumnsFromSchema(schema)
    return {
      name,
      public: true,
      type: DatasetTypes.UserContext,
      category: DatasetCategory.Context,
      schema,
      configuration: {
        format: 'geojson',
        configurationUI: {
          ...(isNotGeoStandard && { longitude: guessedColumns.longitude }),
          ...(isNotGeoStandard && { latitude: guessedColumns.latitude }),
          timestamp: guessedColumns.timestamp,
          geometryType: 'points' as DatasetGeometryType,
        },
      } as DatasetConfiguration,
    }
  }, [])

  const handleRawData = useCallback(
    async (file: File) => {
      const data = await getDatasetParsed(file)
      setFileData(data)
      setFileType(getFileType(file))
      const datasetMetadata = getDatasetMetadata({ data, name: getFileName(file) })
      setDatasetMetadata((meta) => ({ ...meta, ...datasetMetadata }))
      if (getFileType(file) === 'csv') {
        const geojson = getGeojsonFromPointsList(data, datasetMetadata) as FeatureCollection<Point>
        setGeojson(geojson)
      } else {
        setGeojson(data)
      }
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
        type: dataset.type,
        category: dataset.category,
        configuration: {
          ...dataset.configuration,
        } as DatasetConfiguration,
      })
    }
  }, [dataset, file, handleRawData])

  const onConfirmClick = useCallback(() => {
    let file: File | undefined
    if (datasetMetadata) {
      const config = getDatasetConfiguration({ datasetMetadata }) as Dataset['configuration']
      if (fileData) {
        if (fileType === 'csv' && (!config?.latitude || !config?.longitude)) {
          const fields = ['latitude', 'longitude'].map((f) => t(`common.${f}` as any, f))
          setError(
            t('dataset.requiredFields', {
              fields,
              defaultValue: `Required fields ${fields}`,
            })
          )
        } else if (geojson) {
          file = getFileFromGeojson(geojson)
        }
      }
      if (file && onConfirm) {
        onConfirm(datasetMetadata, file)
      }
    }
  }, [datasetMetadata, fileData, geojson, onConfirm, t, fileType])

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
          <FileDropzone
            label={file?.name}
            fileTypes={['csv', 'geojson', 'shapefile']}
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
        {fileType === 'csv' && (
          <Fragment>
            <p className={styles.label}>point coordinates</p>
            <div className={styles.evenSelectorsGroup}>
              <Select
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
            </div>
          </Fragment>
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
        <div className={styles.evenSelectorsGroup}>
          <Select
            label={t('dataset.trackSegmentId', 'Individual track segment id')}
            placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
            options={fieldsOptions}
            direction="top"
            selectedOption={
              getSelectedOption(
                getDatasetConfigurationProperty({ datasetMetadata, property: 'pointName' })
              ) as SelectOption
            }
            onSelect={(selected) => {
              onDatasetConfigurationChange({ pointName: selected.id })
            }}
            onCleanClick={() => {
              onDatasetConfigurationChange({ pointName: undefined })
            }}
          />
          <Select
            label={t('dataset.trackSegmentId', 'Individual track segment id')}
            placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
            options={fieldsOptions}
            direction="top"
            selectedOption={
              getSelectedOption(
                getDatasetConfigurationProperty({ datasetMetadata, property: 'pointSize' })
              ) as SelectOption
            }
            onSelect={(selected) => {
              onDatasetConfigurationChange({ pointSize: selected.id })
            }}
            onCleanClick={() => {
              onDatasetConfigurationChange({ pointSize: undefined })
            }}
          />
        </div>
        <MultiSelect
          label={t('dataset.trackSegmentId', 'track filter property')}
          placeholder={
            getFieldsAllowedArray().length > 0
              ? getFieldsAllowedArray().join(', ')
              : t('dataset.fieldPlaceholder', 'Point filters')
          }
          direction="bottom"
          // disabled={!getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' })}
          options={filtersFieldsOptions}
          selectedOptions={getSelectedOption(getFieldsAllowedArray()) as MultiSelectOption[]}
          onSelect={handleFieldsAllowedAddItem}
          onRemove={handleFieldsAllowedRemoveItem}
          onCleanClick={handleFieldsAllowedCleanSelection}
        />
      </Collapsable>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {/* {error && <span className={styles.errorMsg}>{error}</span>} */}
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

export default NewPointDataset
