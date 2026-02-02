import { Fragment, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import type { FeatureCollection, Point } from 'geojson'

import type { Dataset } from '@globalfishingwatch/api-types'
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

import { getDatasetAllowedFields } from 'features/datasets/datasets.utils'
import {
  useDatasetMetadata,
  useDatasetMetadataOptions,
} from 'features/datasets/upload/datasets-upload.hooks'
import {
  getDatasetMetadataValidations,
  getMetadataFromDataset,
  getPointsDatasetMetadata,
  parseGeoJsonProperties,
} from 'features/datasets/upload/datasets-upload.utils'
import type { NewDatasetProps } from 'features/datasets/upload/NewDataset'
import NewDatasetField from 'features/datasets/upload/NewDatasetField'
import UserGuideLink from 'features/help/UserGuideLink'
import type { FileType, FileTypeResult } from 'utils/files'
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
  const datasetFieldsAllowed =
    getDatasetAllowedFields(datasetMetadata as Dataset) ||
    getDatasetAllowedFields(dataset as Dataset) ||
    []
  const sourceFormat = getDatasetConfigurationProperty({ dataset, property: 'sourceFormat' })
  const { isValid, errors } = getDatasetMetadataValidations(datasetMetadata)
  const [fileTypeResult, setFileTypeResult] = useState<FileTypeResult | undefined>()
  const [isCSVFile, setIsCSVFile] = useState<boolean>(false)

  useEffect(() => {
    const updateFileType = async () => {
      const fileTypeResult = await getFileType(file)
      const isCSVFile = fileTypeResult.fileType === 'CSV' || sourceFormat === 'CSV'
      setFileTypeResult(fileTypeResult)
      setIsCSVFile(isCSVFile)
    }
    updateFileType()
  }, [file, sourceFormat])

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
    async (file: File, fileTypeResult: FileTypeResult) => {
      setProcessingData(true)
      try {
        const data = await getDatasetParsed(file, 'points', fileTypeResult)
        const datasetMetadata = getPointsDatasetMetadata({
          data,
          name: getFileName(file),
          sourceFormat: fileTypeResult.fileType,
        })
        setDatasetMetadata(datasetMetadata)
        if (fileTypeResult.fileType === 'CSV') {
          setSourceData(data as DataList)
          const geojson = getGeojsonFromPointsList(
            data as DataList,
            datasetMetadata
          ) as PointsGeojson
          setGeojson(geojson)
          if ((startTimeProperty || endTimeProperty) && geojson.metadata?.hasDatesError) {
            setTimeFilterError(
              t((t) => t.datasetUpload.errors.invalidDatesFeatures, {
                featureType: t((t) => t.dataset.typePoints),
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
    if (file && !loading && fileTypeResult) {
      handleRawData(file, fileTypeResult)
    } else if (dataset) {
      setDatasetMetadata(getMetadataFromDataset(dataset))
    }
  }, [dataset, file, fileTypeResult])

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
            t((t) => t.datasetUpload.errors.invalidDatesFeatures, {
              featureType: t((t) => t.dataset.typePoints),
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
    sourceData,
    isCSVFile,
    datasetMetadata,
    t,
  ])

  const onConfirmClick = useCallback(async () => {
    let error = ''
    if (datasetMetadata) {
      if (sourceData) {
        const config = getDatasetConfiguration(datasetMetadata)
        if (fileTypeResult?.fileType === 'CSV' && (!config?.latitude || !config?.longitude)) {
          const fields = (['latitude', 'longitude'] as const).map((f) =>
            t((t) => t.common[f], { defaultValue: f })
          )
          error = t((t) => t.dataset.requiredFields, {
            fields,
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
  }, [datasetMetadata, sourceData, onConfirm, fileTypeResult, geojson, t, isEditing])

  if (processingData) {
    return (
      <div className={styles.processingData}>
        <Spinner className={styles.processingDataSpinner} />
        <p>{t((t) => t.datasetUpload.processingData)}</p>
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
          fileTypes={fileTypeResult ? [fileTypeResult.fileType as FileType] : []}
          onFileLoaded={onFileUpdate}
        />
      )}
      <InputText
        value={datasetMetadata?.name}
        label={t((t) => t.datasetUpload.datasetName)}
        className={styles.input}
        onChange={(e) => setDatasetMetadata({ name: e.target.value })}
        disabled={loading}
      />
      {errors.name && <p className={cx(styles.errorMsg, styles.errorMargin)}>{errors.name}</p>}
      {isCSVFile && (
        <div className={styles.row}>
          <NewDatasetField
            datasetMetadata={datasetMetadata}
            property="latitude"
            label={`${t((t) => t.datasetUpload.point.coordinates)} - ${t((t) => t.common.latitude)}`}
            editable={!isEditing && !loading}
            onSelect={(selected) => {
              setDatasetMetadataConfig({ latitude: selected.id })
            }}
          />
          <NewDatasetField
            datasetMetadata={datasetMetadata}
            property="longitude"
            label={t((t) => t.common.longitude)}
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
      <Collapsable className={styles.optional} label={t((t) => t.datasetUpload.optionalFields)}>
        <InputText
          value={datasetMetadata?.description}
          label={t((t) => t.datasetUpload.datasetDescription)}
          className={styles.input}
          onChange={(e) => setDatasetMetadata({ description: e.target.value })}
          disabled={loading}
        />
        <NewDatasetField
          datasetMetadata={datasetMetadata}
          property="valueProperties"
          label={t((t) => t.datasetUpload.points.name)}
          editable={!loading}
          onSelect={(selected) => {
            setDatasetMetadataConfig({ valueProperties: [selected.id] })
          }}
          onCleanClick={() => {
            setDatasetMetadataConfig({ valueProperties: [] })
          }}
          infoTooltip={t((t) => t.datasetUpload.points.nameHelp)}
        />
        <div className={styles.row}>
          <NewDatasetField
            datasetMetadata={datasetMetadata}
            property="pointSize"
            label={t((t) => t.datasetUpload.points.size)}
            placeholder={t((t) => t.datasetUpload.fieldNumericPlaceholder)}
            editable={!loading}
            onSelect={(selected) => {
              setDatasetMetadataConfig({ pointSize: selected.id })
            }}
            onCleanClick={() => {
              setDatasetMetadataConfig({ pointSize: '' })
            }}
            infoTooltip={t((t) => t.datasetUpload.points.sizeHelp)}
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
                label={t((t) => t.datasetUpload.points.sizeMin)}
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
                label={t((t) => t.datasetUpload.points.sizeMax)}
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
          label={t((t) => t.datasetUpload.points.filters)}
          placeholder={
            datasetFieldsAllowed.length > 0
              ? datasetFieldsAllowed.join(', ')
              : t((t) => t.datasetUpload.fieldMultiplePlaceholder)
          }
          direction="top"
          options={filtersFieldsOptions}
          selectedOptions={getSelectedOption(datasetFieldsAllowed) as MultiSelectOption[]}
          onSelect={(newFilter: MultiSelectOption) => {
            const filters = datasetMetadata?.filters?.userContext || []
            setDatasetMetadata({
              filters: {
                userContext: filters.map((f) => {
                  return { ...f, enabled: f.id === newFilter.id }
                }),
              },
            })
          }}
          onRemove={(newFilter: MultiSelectOption, rest: MultiSelectOption[]) => {
            // setDatasetMetadata({ fieldsAllowed: rest.map((f: MultiSelectOption) => f.id) })
            const filters = datasetMetadata?.filters?.userContext || []
            const restIds = rest.map((r) => r.id)
            setDatasetMetadata({
              filters: {
                userContext: filters.map((f) => {
                  return { ...f, enabled: restIds.includes(f.id) }
                }),
              },
            })
          }}
          onCleanClick={() => {
            // setDatasetMetadata({ fieldsAllowed: [] })
            const filters = datasetMetadata?.filters?.userContext || []
            setDatasetMetadata({
              filters: {
                userContext: filters.map((f) => {
                  return { ...f, enabled: false }
                }),
              },
            })
          }}
          disabled={loading}
          infoTooltip={t((t) => t.datasetUpload.points.filtersHelp)}
        />
        <SwitchRow
          className={styles.saveAsPublic}
          label={t((t) => t.dataset.uploadPublic)}
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
          disabled={!datasetMetadata || error !== '' || !isValid}
          loading={loading}
        >
          {t((t) => t.common.confirm) as string}
        </Button>
      </div>
    </div>
  )
}

export default NewPointDataset
