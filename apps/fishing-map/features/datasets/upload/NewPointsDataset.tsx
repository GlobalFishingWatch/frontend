import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FeatureCollection, Point } from 'geojson'
import {
  Button,
  MultiSelect,
  MultiSelectOnChange,
  MultiSelectOption,
  SelectOption,
} from '@globalfishingwatch/ui-components'
import {
  checkRecordValidity,
  getDatasetSchema,
  guessColumnsFromSchema,
} from '@globalfishingwatch/data-transforms'
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
import { getFileFromGeojson } from 'utils/files'
import { isPrivateDataset } from '../datasets.utils'
import styles from './NewDataset.module.css'
import { ExtractMetadataProps } from './NewTrackDataset'
import { getDatasetParsed, getPointsFromList } from './datasets-parse.utils'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
  getFileName,
} from './datasets-upload.utils'

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
  const [geojson, setGeojson] = useState<FeatureCollection<Point> | undefined>()
  const [datasetMetadata, setDatasetMetadata] = useState<DatasetMetadata | undefined>()

  const getDatasetMetadata = useCallback(({ name, data }: ExtractMetadataProps) => {
    const schema = getDatasetSchema(data, { includeEnum: true })
    const guessedColumns = guessColumnsFromSchema(schema)
    return {
      name,
      public: true,
      type: DatasetTypes.Context,
      category: DatasetCategory.Context,
      schema,
      configuration: {
        configurationUI: {
          latitude: guessedColumns.latitude,
          longitude: guessedColumns.longitude,
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
      const datasetMetadata = getDatasetMetadata({ data, name: getFileName(file) })
      setDatasetMetadata((meta) => ({ ...meta, ...datasetMetadata }))
      const geojson = getPointsFromList(data, datasetMetadata) as FeatureCollection<Point>
      setGeojson(geojson)
    },
    [getDatasetMetadata]
  )

  useEffect(() => {
    if (file) {
      handleRawData(file)
    } else if (dataset) {
      // const { ownerType, createdAt, endpoints, ...rest } = dataset
      // setDatasetMetadata({
      //   ...rest,
      //   public: isPrivateDataset(dataset),
      //   type: DatasetTypes.UserTracks,
      //   category: DatasetCategory.Environment,
      //   configuration: {
      //     ...dataset.configuration,
      //   } as DatasetConfiguration,
      // })
    }
  }, [dataset, file, handleRawData])

  const onConfirmClick = useCallback(() => {
    let file: File | undefined
    if (datasetMetadata) {
      const config = getDatasetConfiguration({ datasetMetadata }) as Dataset['configuration']
      console.log('🚀 ~ file: NewPointsDataset.tsx:109 ~ onConfirmClick ~ fileData:', fileData)
      console.log('config?.latitude', config?.latitude, 'config?.longitude', config?.longitude)
      if (fileData) {
        if (!config?.latitude || !config?.longitude) {
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
      console.log('🚀 ~ file: NewPointsDataset.tsx:134 ~ onConfirmClick ~ onConfirm:', onConfirm)
      console.log('CONFIRMING', file)
      if (file && onConfirm) {
        onConfirm(datasetMetadata, file)
      }
    }
  }, [datasetMetadata, fileData, geojson, onConfirm, t])

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
          console.log('🚀 ~ file: NewPointsDataset.tsx:168 ~ ?Object.keys ~ schema:', schema)
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
    <div>
      <div className={styles.content}>Points dataset configuration here</div>
      <MultiSelect
        label={t('dataset.trackSegmentId', 'track filter property')}
        placeholder={
          getFieldsAllowedArray().length > 0
            ? getFieldsAllowedArray().join(', ')
            : t('dataset.fieldPlaceholder', 'Select a field from your dataset')
        }
        direction="bottom"
        // disabled={!getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' })}
        options={filtersFieldsOptions}
        selectedOptions={getSelectedOption(getFieldsAllowedArray()) as MultiSelectOption[]}
        onSelect={handleFieldsAllowedAddItem}
        onRemove={handleFieldsAllowedRemoveItem}
        onCleanClick={handleFieldsAllowedCleanSelection}
      />
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
