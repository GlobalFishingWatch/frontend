import { Fragment, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FeatureCollection, Point } from 'geojson'

import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import { POINT_SIZES_DEFAULT_RANGE } from '@globalfishingwatch/deck-layers'
import type { MultiSelectOption } from '@globalfishingwatch/ui-components'
import {
  Button,
  Collapsable,
  InputText,
  MultiSelect,
  Spinner,
  SwitchRow,
} from '@globalfishingwatch/ui-components'

import {
  useDatasetMetadata,
  useDatasetMetadataOptions,
} from 'features/datasets/upload/datasets-upload.hooks'
import {
  getMetadataFromDataset,
  getPointsDatasetMetadata,
  parseGeoJsonProperties,
} from 'features/datasets/upload/datasets-upload.utils'
import type { NewDatasetProps } from 'features/datasets/upload/NewDataset'
import NewDatasetField from 'features/datasets/upload/NewDatasetField'
import UserGuideLink from 'features/help/UserGuideLink'
import type { FileType } from 'utils/files'
import { getFileFromGeojson, getFileName, getFileType } from 'utils/files'

import type { DataList, DataParsed } from './datasets-parse.utils'
import {
  getDatasetParsed,
  getGeojsonFromPointsList,
  getNormalizedGeojsonFromPointsGeojson,
} from './datasets-parse.utils'
import FileDropzone from './FileDropzone'
import { TimeFieldsGroup } from './TimeFieldsGroup'

import styles from './NewDataset.module.css'

const MIN_POINT_SIZE = 1
const MAX_POINT_SIZE = 50
type PointsGeojson = FeatureCollection<Point> & { metadata?: { hasDatesError: boolean } }

function NewPointDataset({
  onConfirm,
  file,
  dataset,
  onFileUpdate,
  onDatasetParseError,
}: NewDatasetProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const [error, setError] = useState<string>('')
  const [timeFilterError, setTimeFilterError] = useState<string>('')
  const [dataParseError, setDataParseError] = useState<string>('')
  const [processingData, setProcessingData] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [sourceData, setSourceData] = useState<DataParsed | undefined>()
  const [geojson, setGeojson] = useState<PointsGeojson | undefined>()
  const { datasetMetadata, setDatasetMetadata, setDatasetMetadataConfig } = useDatasetMetadata()
  const { getSelectedOption, filtersFieldsOptions } = useDatasetMetadataOptions(datasetMetadata)
  const isEditing = dataset?.id !== undefined
  const isPublic = !!datasetMetadata?.public
  const datasetFieldsAllowed = datasetMetadata?.fieldsAllowed || dataset?.fieldsAllowed || []
  const sourceFormat = getDatasetConfigurationProperty({ dataset, property: 'sourceFormat' })
  const fileType = getFileType(file)
  const isCSVFile = fileType === 'CSV' || sourceFormat === 'CSV'

  const latitudeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'latitude',
  })
  const longitudeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'longitude',
  })
  const timeFilterType = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'timeFilterType',
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
      setProcessingData(true)
      try {
        const data = await getDatasetParsed(file, 'points')
        const fileType = getFileType(file)
        const datasetMetadata = getPointsDatasetMetadata({
          data,
          name: getFileName(file),
          sourceFormat: fileType,
        })
        setDatasetMetadata(datasetMetadata)
        if (fileType === 'CSV') {
          setSourceData(data as DataList)
          const geojson = getGeojsonFromPointsList(
            data as DataList,
            datasetMetadata
          ) as PointsGeojson
          setGeojson(geojson)
          if ((startTimeProperty || endTimeProperty) && geojson.metadata?.hasDatesError) {
            setTimeFilterError(
              t('datasetUpload.errors.invalidDatesFeatures', {
                defaultValue:
                  "Some of your {{featureType}} don't contain a valid date. They won't appear on the map regardless of time filter.",
                featureType: t('common.points', 'points'),
              })
            )
          } else {
            setTimeFilterError('')
          }
        } else {
          setSourceData(data as PointsGeojson)
          const geojson = getNormalizedGeojsonFromPointsGeojson(
            data as PointsGeojson,
            datasetMetadata
          ) as PointsGeojson
          setGeojson(geojson)
        }
        setProcessingData(false)
      } catch (e: any) {
        setProcessingData(false)
        onDatasetParseError(e, setDataParseError)
      }
    },
    [setDatasetMetadata, startTimeProperty, endTimeProperty, t, onDatasetParseError]
  )

  useEffect(() => {
    if (file && !loading) {
      handleRawData(file)
    } else if (dataset) {
      setDatasetMetadata(getMetadataFromDataset(dataset))
    }
  }, [dataset, file])

  useEffect(() => {
    if (sourceData) {
      if (isCSVFile) {
        const geojson = getGeojsonFromPointsList(
          sourceData as DataList,
          datasetMetadata
        ) as PointsGeojson
        setGeojson(geojson)
        if ((startTimeProperty || endTimeProperty) && geojson.metadata?.hasDatesError) {
          setTimeFilterError(
            t('datasetUpload.errors.invalidDatesFeatures', {
              defaultValue:
                "Some of your {{featureType}} don't contain a valid date. They won't appear on the map regardless of time filter.",
              featureType: t('common.points', 'points'),
            })
          )
        } else {
          setTimeFilterError('')
        }
      } else {
        const geojson = getNormalizedGeojsonFromPointsGeojson(
          sourceData as FeatureCollection,
          datasetMetadata
        ) as PointsGeojson
        setGeojson(geojson)
      }
    }
  }, [
    latitudeProperty,
    longitudeProperty,
    startTimeProperty,
    endTimeProperty,
    timeFilterType,
    fileType,
    sourceData,
  ])

  const onConfirmClick = useCallback(async () => {
    let error = ''
    if (datasetMetadata) {
      if (sourceData) {
        const config = getDatasetConfiguration(datasetMetadata)
        if (fileType === 'CSV' && (!config?.latitude || !config?.longitude)) {
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
        // TODO update the schema with the selected field with type timestamp
        // setDatasetMetadataSchema({ [selected.id]: { type: 'timestamp' } })
        setLoading(true)
        const file = geojson
          ? getFileFromGeojson(parseGeoJsonProperties<Point>(geojson, datasetMetadata))
          : undefined
        await onConfirm(datasetMetadata, { file, isEditing })
        setLoading(false)
      }
    }
  }, [datasetMetadata, sourceData, onConfirm, fileType, geojson, t, isEditing])

  if (processingData) {
    return (
      <div className={styles.processingData}>
        <Spinner className={styles.processingDataSpinner} />
        <p>{t('datasetUpload.processingData', 'Processing data...')}</p>
      </div>
    )
  }

  if (dataParseError) {
    return (
      <div className={styles.processingData}>
        <p className={styles.errorMsg}>{dataParseError}</p>
      </div>
    )
  }

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
        disabled={loading}
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
            editable={!isEditing && !loading}
            onSelect={(selected) => {
              setDatasetMetadataConfig({ latitude: selected.id })
            }}
          />
          <NewDatasetField
            datasetMetadata={datasetMetadata}
            property="longitude"
            label={t('common.longitude', 'Longitude')}
            editable={!isEditing && !loading}
            onSelect={(selected) => {
              setDatasetMetadataConfig({ longitude: selected.id })
            }}
          />
        </div>
      )}
      <div className={styles.row}>
        <TimeFieldsGroup
          datasetMetadata={datasetMetadata}
          setDatasetMetadataConfig={setDatasetMetadataConfig}
          disabled={loading}
        />
      </div>
      <span className={styles.errorMsg}>{timeFilterError}</span>
      <Collapsable
        className={styles.optional}
        label={t('datasetUpload.optionalFields', 'Optional fields')}
      >
        <InputText
          value={datasetMetadata?.description}
          label={t('datasetUpload.datasetDescription', 'Dataset description')}
          className={styles.input}
          onChange={(e) => setDatasetMetadata({ description: e.target.value })}
          disabled={loading}
        />
        <NewDatasetField
          datasetMetadata={datasetMetadata}
          property="valueProperties"
          label={t('datasetUpload.points.name', 'Point label')}
          editable={!loading}
          onSelect={(selected) => {
            setDatasetMetadataConfig({ valueProperties: [selected.id] })
          }}
          onCleanClick={() => {
            setDatasetMetadataConfig({ valueProperties: [] })
          }}
          infoTooltip={t(
            'datasetUpload.points.nameHelp',
            'Select a property of each point to make it appear as its label'
          )}
        />
        <div className={styles.row}>
          <NewDatasetField
            datasetMetadata={datasetMetadata}
            property="pointSize"
            label={t('datasetUpload.points.size', 'point size')}
            placeholder={t(
              'datasetUpload.fieldNumericPlaceholder',
              'Select a numeric field from your dataset'
            )}
            editable={!loading}
            onSelect={(selected) => {
              setDatasetMetadataConfig({ pointSize: selected.id })
            }}
            onCleanClick={() => {
              setDatasetMetadataConfig({ pointSize: '' })
            }}
            infoTooltip={t(
              'datasetUpload.points.sizeHelp',
              'Select a numeric property of each point to change its radius'
            )}
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
                disabled={loading}
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
                disabled={loading}
              />
            </Fragment>
          )}
        </div>

        <MultiSelect
          label={t('datasetUpload.points.filters', 'point filters')}
          placeholder={
            datasetFieldsAllowed.length > 0
              ? datasetFieldsAllowed.join(', ')
              : t(
                  'datasetUpload.fieldMultiplePlaceholder',
                  'Select one or multiple fields from your dataset'
                )
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
          disabled={loading}
          infoTooltip={t(
            'datasetUpload.points.filtersHelp',
            'Select properties of the points to be able to dinamically filter them in the sidebar after'
          )}
        />
        <SwitchRow
          className={styles.saveAsPublic}
          label={t(
            'dataset.uploadPublic',
            'Allow other users to see this dataset when you share a workspace'
          )}
          disabled={isEditing || loading}
          active={isPublic}
          onClick={() => setDatasetMetadata({ public: !isPublic })}
        />
      </Collapsable>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
          <UserGuideLink section="uploadPoints" />
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
