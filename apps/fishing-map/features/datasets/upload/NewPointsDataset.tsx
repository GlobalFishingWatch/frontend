import { useTranslation } from 'react-i18next'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { FeatureCollection, Point } from 'geojson'
import {
  Button,
  Collapsable,
  InputText,
  MultiSelect,
  MultiSelectOption,
  Select,
  SelectOption,
  SwitchRow,
} from '@globalfishingwatch/ui-components'
import { DatasetConfiguration, pointTimeFilter } from '@globalfishingwatch/api-types'
import {
  MAX_POINT_SIZE,
  MIN_POINT_SIZE,
  POINT_SIZES_DEFAULT_RANGE,
} from '@globalfishingwatch/layer-composer'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import UserGuideLink from 'features/help/UserGuideLink'
import { NewDatasetProps } from 'features/datasets/upload/NewDataset'
import { getFileFromGeojson, getFileName, getFileType } from 'utils/files'
import {
  useDatasetMetadata,
  useDatasetMetadataOptions,
} from 'features/datasets/upload/datasets-upload.hooks'
import { getPointsDatasetMetadata } from 'features/datasets/upload/datasets-upload.utils'
import NewDatasetField from 'features/datasets/upload/NewDatasetField'
import { isPrivateDataset } from '../datasets.utils'
import styles from './NewDataset.module.css'
import { DataList, getDatasetParsed, getGeojsonFromPointsList } from './datasets-parse.utils'
import FileDropzone from './FileDropzone'

const POINT_TIME_OPTIONS: SelectOption[] = [
  { id: 'timerange', label: 'timerange' },
  { id: 'timestamp', label: 'timestamp' },
]

function NewPointDataset({
  onConfirm,
  file,
  dataset,
  onFileUpdate,
}: NewDatasetProps): React.ReactElement {
  const { t } = useTranslation()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [sourceData, setSourceData] = useState<DataList | undefined>()
  const [geojson, setGeojson] = useState<FeatureCollection<Point> | undefined>()
  const { datasetMetadata, setDatasetMetadata, setDatasetMetadataConfig } = useDatasetMetadata()
  const { fieldsOptions, getSelectedOption, schemaRangeOptions, filtersFieldsOptions } =
    useDatasetMetadataOptions(datasetMetadata)
  const isEditing = dataset?.id !== undefined
  const isPublic = !!datasetMetadata?.public
  const datasetFieldsAllowed = datasetMetadata?.fieldsAllowed || dataset?.fieldsAllowed || []
  const sourceFormat = getDatasetConfigurationProperty({ dataset, property: 'sourceFormat' })
  const fileType = getFileType(file)
  const isCSVFile = fileType === 'csv' || sourceFormat === 'csv'

  const handleRawData = useCallback(
    async (file: File) => {
      const data = await getDatasetParsed(file)
      const fileType = getFileType(file)
      const datasetMetadata = getPointsDatasetMetadata({
        data,
        name: getFileName(file),
        sourceFormat: fileType,
      })
      setDatasetMetadata(datasetMetadata)
      if (fileType === 'csv') {
        setSourceData(data as DataList)
        const geojson = getGeojsonFromPointsList(
          data as DataList,
          datasetMetadata
        ) as FeatureCollection<Point>
        setGeojson(geojson)
      } else {
        setGeojson(data as FeatureCollection<Point>)
      }
    },
    [setDatasetMetadata]
  )

  useEffect(() => {
    if (file) {
      handleRawData(file)
    } else if (dataset) {
      const { ownerType, createdAt, endpoints, ...rest } = dataset
      setDatasetMetadata({
        ...rest,
        public: !isPrivateDataset(dataset),
        type: dataset.type,
        category: dataset.category,
        configuration: {
          ...dataset.configuration,
        } as DatasetConfiguration,
      })
    }
  }, [dataset, file, handleRawData, setDatasetMetadata])

  const onConfirmClick = useCallback(async () => {
    let error = ''
    if (datasetMetadata) {
      if (sourceData) {
        const config = getDatasetConfiguration(datasetMetadata)
        if (fileType === 'csv' && (!config?.latitude || !config?.longitude)) {
          const fields = ['latitude', 'longitude'].map((f) => t(`common.${f}` as any, f))
          error = t('dataset.requiredFields', {
            fields,
            defaultValue: `Required fields ${fields}`,
          })
        }
      }
      if (error) {
        setError(error)
      } else if (onConfirm) {
        setLoading(true)
        const file = geojson ? getFileFromGeojson(geojson) : undefined
        await onConfirm(datasetMetadata, file)
        setLoading(false)
      }
    }
  }, [datasetMetadata, sourceData, onConfirm, fileType, geojson, t])

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
          onChange={(e) => setDatasetMetadata({ name: e.target.value })}
        />
        {isCSVFile && (
          <Fragment>
            <p className={styles.label}>point coordinates</p>
            <div className={styles.evenSelectorsGroup}>
              <NewDatasetField
                datasetMetadata={datasetMetadata}
                property="latitude"
                editable={!isEditing}
                onSelect={(selected) => {
                  setDatasetMetadataConfig({ latitude: selected.id })
                }}
              />
              <NewDatasetField
                datasetMetadata={datasetMetadata}
                property="longitude"
                editable={!isEditing}
                onSelect={(selected) => {
                  setDatasetMetadataConfig({ longitude: selected.id })
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
          onChange={(e) => setDatasetMetadata({ description: e.target.value })}
        />
        <Select
          label={t('dataset.pointName', 'point name')}
          placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
          options={fieldsOptions}
          direction="top"
          selectedOption={
            getSelectedOption(
              getDatasetConfigurationProperty({
                dataset: datasetMetadata,
                property: 'pointName',
              })
            ) as SelectOption
          }
          onSelect={(selected) => {
            setDatasetMetadataConfig({ pointName: selected.id })
          }}
          onCleanClick={() => {
            setDatasetMetadataConfig({ pointName: undefined })
          }}
        />
        <div className={styles.evenSelectorsGroup}>
          <Select
            label={t('dataset.pointSize', 'point size')}
            placeholder={t('dataset.fieldPlaceholder', 'Select a numeric field from your dataset')}
            options={schemaRangeOptions}
            direction="top"
            selectedOption={
              getSelectedOption(
                getDatasetConfigurationProperty({
                  dataset: datasetMetadata,
                  property: 'pointSize',
                })
              ) as SelectOption
            }
            onSelect={(selected) => {
              setDatasetMetadataConfig({ pointSize: selected.id })
            }}
            onCleanClick={() => {
              setDatasetMetadataConfig({ pointSize: undefined })
            }}
          />
          {getDatasetConfigurationProperty({
            dataset: datasetMetadata,
            property: 'pointSize',
          }) && (
            <Fragment>
              <InputText
                type="number"
                value={
                  getDatasetConfigurationProperty({
                    dataset: datasetMetadata,
                    property: 'minPointSize',
                  }) || POINT_SIZES_DEFAULT_RANGE[0]
                }
                min={MIN_POINT_SIZE}
                label={t('dataset.minPointSize', 'Min point size')}
                className={styles.input}
                onChange={(e) =>
                  setDatasetMetadataConfig({ minPointSize: parseFloat(e.target.value) })
                }
              />
              <InputText
                type="number"
                value={
                  getDatasetConfigurationProperty({
                    dataset: datasetMetadata,
                    property: 'maxPointSize',
                  }) || POINT_SIZES_DEFAULT_RANGE[1]
                }
                max={MAX_POINT_SIZE}
                label={t('dataset.maxPointSize', 'max point size')}
                className={styles.input}
                onChange={(e) =>
                  setDatasetMetadataConfig({ maxPointSize: parseFloat(e.target.value) })
                }
              />
            </Fragment>
          )}
        </div>
        <p className={styles.label}>point time</p>
        <div className={styles.evenSelectorsGroup}>
          <Select
            placeholder={t('dataset.pointTimePlaceholder', 'Select a time period filter type')}
            options={POINT_TIME_OPTIONS}
            direction="top"
            selectedOption={
              getSelectedOption(
                getDatasetConfigurationProperty({
                  dataset: datasetMetadata,
                  property: 'pointTimeFilter',
                }),
                POINT_TIME_OPTIONS
              ) as SelectOption
            }
            onSelect={(selected) => {
              setDatasetMetadataConfig({ pointTimeFilter: selected.id })
            }}
            onCleanClick={() => {
              setDatasetMetadataConfig({ pointTimeFilter: undefined })
            }}
          />
          <Select
            placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
            options={fieldsOptions}
            direction="top"
            disabled={
              !getDatasetConfigurationProperty({
                dataset: datasetMetadata,
                property: 'pointTimeFilter',
              })
            }
            selectedOption={
              getSelectedOption(
                getDatasetConfigurationProperty({ dataset: datasetMetadata, property: 'pointTime' })
              ) as SelectOption
            }
            onSelect={(selected) => {
              setDatasetMetadataConfig({ pointTime: selected.id })
            }}
            onCleanClick={() => {
              setDatasetMetadataConfig({ pointTime: undefined })
            }}
          />
          {(getDatasetConfigurationProperty({
            dataset: datasetMetadata,
            property: 'pointTimeFilter',
          }) as pointTimeFilter) === 'timerange' && (
            <Select
              placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
              options={fieldsOptions}
              direction="top"
              selectedOption={
                getSelectedOption(
                  getDatasetConfigurationProperty({
                    dataset: datasetMetadata,
                    property: 'pointTime',
                  })
                ) as SelectOption
              }
              onSelect={(selected) => {
                setDatasetMetadataConfig({ pointTime: selected.id })
              }}
              onCleanClick={() => {
                setDatasetMetadataConfig({ pointTime: undefined })
              }}
            />
          )}
        </div>
        <MultiSelect
          label={t('dataset.pointFilters', 'point filters')}
          placeholder={
            datasetFieldsAllowed.length > 0
              ? datasetFieldsAllowed.join(', ')
              : t('dataset.fieldPlaceholder', 'Point filters')
          }
          direction="top"
          options={filtersFieldsOptions}
          selectedOptions={getSelectedOption(datasetFieldsAllowed) as MultiSelectOption[]}
          onSelect={(newFilter: MultiSelectOption) => {
            setDatasetMetadata({ fieldsAllowed: [...datasetFieldsAllowed, newFilter.id] })
          }}
          onRemove={(_: MultiSelectOption, rest: MultiSelectOption[]) => {
            setDatasetMetadata({ fieldsAllowed: rest.map((f: MultiSelectOption) => f.id) })
          }}
          onCleanClick={() => {
            setDatasetMetadata({ fieldsAllowed: [] })
          }}
        />
      </Collapsable>
      <SwitchRow
        className={styles.saveAsPublic}
        label={t(
          'dataset.uploadPublic',
          'Allow other users to see this dataset when you share a workspace'
        )}
        // disabled={!!mapDrawEditDataset}
        active={isPublic}
        onClick={() => setDatasetMetadata({ public: !isPublic })}
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
          disabled={!datasetMetadata || error !== ''}
          loading={loading}
        >
          {t('common.confirm', 'Confirm') as string}
        </Button>
      </div>
    </div>
  )
}

export default NewPointDataset
