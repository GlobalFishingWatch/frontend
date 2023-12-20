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
import { PointTimeFilterType } from '@globalfishingwatch/api-types'
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
import { FileType, getFileFromGeojson, getFileName, getFileType } from 'utils/files'
import {
  useDatasetMetadata,
  useDatasetMetadataOptions,
} from 'features/datasets/upload/datasets-upload.hooks'
import {
  getMetadataFromDataset,
  getPointsDatasetMetadata,
} from 'features/datasets/upload/datasets-upload.utils'
import NewDatasetField from 'features/datasets/upload/NewDatasetField'
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
  const {
    datasetMetadata,
    setDatasetMetadata,
    setDatasetMetadataConfig,
    setDatasetMetadataSchema,
  } = useDatasetMetadata()
  const { fieldsOptions, getSelectedOption, schemaRangeOptions, filtersFieldsOptions } =
    useDatasetMetadataOptions(datasetMetadata)
  const isEditing = dataset?.id !== undefined
  const isPublic = !!datasetMetadata?.public
  const datasetFieldsAllowed = datasetMetadata?.fieldsAllowed || dataset?.fieldsAllowed || []
  const sourceFormat = getDatasetConfigurationProperty({ dataset, property: 'sourceFormat' })
  const fileType = getFileType(file)
  const isCSVFile = fileType === 'csv' || sourceFormat === 'csv'

  const latitudeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'latitude',
  })
  const longitudeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'longitude',
  })
  const startTimeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'startTime',
  })

  const endTimeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'endTime',
  })

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
    if (file && !loading) {
      handleRawData(file)
    } else if (dataset) {
      setDatasetMetadata(getMetadataFromDataset(dataset))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, file])

  useEffect(() => {
    if (
      latitudeProperty &&
      longitudeProperty &&
      startTimeProperty &&
      endTimeProperty &&
      sourceData
    ) {
      const geojson = getGeojsonFromPointsList(
        sourceData,
        datasetMetadata
      ) as FeatureCollection<Point>
      setGeojson(geojson)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitudeProperty, longitudeProperty, startTimeProperty, endTimeProperty])

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
        <FileDropzone
          label={file?.name}
          fileTypes={[fileType as FileType]}
          onFileLoaded={onFileUpdate}
        />
      )}
      <InputText
        value={datasetMetadata?.name}
        label={t('datasetUpload.datasetName', 'Dataset Name')}
        className={styles.input}
        onChange={(e) => setDatasetMetadata({ name: e.target.value })}
      />
      {isCSVFile && (
        <div className={styles.row}>
          <NewDatasetField
            datasetMetadata={datasetMetadata}
            property="latitude"
            label={`${t('datasetUpload.point.coordinates', 'Point coordinates')} - ${t(
              'common.latitude',
              'Latitude'
            )}`}
            editable={!isEditing}
            onSelect={(selected) => {
              setDatasetMetadataConfig({ latitude: selected.id })
            }}
          />
          <NewDatasetField
            datasetMetadata={datasetMetadata}
            property="longitude"
            label={t('common.longitude', 'Longitude')}
            editable={!isEditing}
            onSelect={(selected) => {
              setDatasetMetadataConfig({ longitude: selected.id })
            }}
          />
        </div>
      )}
      <div className={styles.row}>
        <Select
          placeholder={t(
            'datasetUploadUI.timePeriodTypePlaceholder',
            'Select a time period filter type'
          )}
          options={POINT_TIME_OPTIONS}
          direction="top"
          label={t('datasetUpload.points.time', 'Point time')}
          className={styles.input}
          selectedOption={
            getSelectedOption(
              getDatasetConfigurationProperty({
                dataset: datasetMetadata,
                property: 'pointTimeFilterType',
              }),
              POINT_TIME_OPTIONS
            ) as SelectOption
          }
          onSelect={(selected) => {
            setDatasetMetadataConfig({ pointTimeFilterType: selected.id })
          }}
          onCleanClick={() => {
            setDatasetMetadataConfig({ pointTimeFilterType: undefined })
          }}
        />
        <Select
          placeholder={t('datasetUploadUI.fieldPlaceholder', 'Select a field from your dataset')}
          options={fieldsOptions}
          direction="top"
          className={styles.input}
          disabled={
            !getDatasetConfigurationProperty({
              dataset: datasetMetadata,
              property: 'pointTimeFilterType',
            })
          }
          selectedOption={
            getSelectedOption(
              getDatasetConfigurationProperty({
                dataset: datasetMetadata,
                property: 'startTime',
              })
            ) as SelectOption
          }
          onSelect={(selected) => {
            if (
              getDatasetConfigurationProperty({
                dataset: datasetMetadata,
                property: 'pointTimeFilterType',
              }) === 'timestamp'
            ) {
              setDatasetMetadataConfig({ startTime: selected.id, endTime: selected.id })
              setDatasetMetadataSchema({ [selected.id]: { type: 'timestamp' } })
            } else {
              setDatasetMetadataConfig({ startTime: selected.id })
              setDatasetMetadataSchema({ [selected.id]: { type: 'timestamp' } })
            }
          }}
          onCleanClick={() => {
            if (
              getDatasetConfigurationProperty({
                dataset: datasetMetadata,
                property: 'pointTimeFilterType',
              }) === 'timestamp'
            ) {
              setDatasetMetadataConfig({ startTime: undefined, endTime: undefined })
            } else {
              setDatasetMetadataConfig({ startTime: undefined })
            }
          }}
        />
        {(getDatasetConfigurationProperty({
          dataset: datasetMetadata,
          property: 'pointTimeFilterType',
        }) as PointTimeFilterType) === 'timerange' && (
          <Select
            placeholder={t('datasetUpload.fieldPlaceholder', 'Select a field from your dataset')}
            options={fieldsOptions}
            direction="top"
            className={styles.input}
            selectedOption={
              getSelectedOption(
                getDatasetConfigurationProperty({
                  dataset: datasetMetadata,
                  property: 'endTime',
                })
              ) as SelectOption
            }
            onSelect={(selected) => {
              setDatasetMetadataConfig({ endTime: selected.id })
              setDatasetMetadataSchema({ [selected.id]: { type: 'timestamp' } })
            }}
            onCleanClick={() => {
              setDatasetMetadataConfig({ endTime: undefined })
            }}
          />
        )}
      </div>
      <Collapsable
        className={styles.optional}
        label={t('datasetUpload.optionalFields', 'Optional fields')}
      >
        <InputText
          value={datasetMetadata?.description}
          label={t('datasetUpload.datasetDescription', 'Dataset description')}
          className={styles.input}
          onChange={(e) => setDatasetMetadata({ description: e.target.value })}
        />
        <NewDatasetField
          datasetMetadata={datasetMetadata}
          property="propertyToInclude"
          label={t('datasetUpload.points.name', 'Point name')}
          editable={!isEditing}
          onSelect={(selected) => {
            setDatasetMetadataConfig({ propertyToInclude: selected.id })
          }}
        />
        <div className={styles.row}>
          <Select
            label={t('datasetUpload.points.size', 'point size')}
            placeholder={t(
              'datasetUpload.fieldNumericPlaceholder',
              'Select a numeric field from your dataset'
            )}
            options={schemaRangeOptions}
            direction="top"
            className={styles.input}
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
                label={t('datasetUpload.points.sizeMin', 'Minimum size')}
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
                label={t('datasetUpload.points.sizeMax', 'Maximum size')}
                className={styles.input}
                onChange={(e) =>
                  setDatasetMetadataConfig({ maxPointSize: parseFloat(e.target.value) })
                }
              />
            </Fragment>
          )}
        </div>

        <MultiSelect
          label={t('datasetUpload.points.filters', 'point filters')}
          placeholder={
            datasetFieldsAllowed.length > 0
              ? datasetFieldsAllowed.join(', ')
              : t('datasetUpload.fieldMultiplePlaceholder', 'Select fields from your dataset')
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
        <SwitchRow
          className={styles.saveAsPublic}
          label={t(
            'dataset.uploadPublic',
            'Allow other users to see this dataset when you share a workspace'
          )}
          disabled={isEditing}
          active={isPublic}
          onClick={() => setDatasetMetadata({ public: !isPublic })}
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
