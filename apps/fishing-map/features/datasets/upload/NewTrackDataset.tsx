// TODO:DR this is BROKEN, fix it!
// @ts-nocheck
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import type { FeatureCollection, LineString } from 'geojson'

import { checkRecordValidity } from '@globalfishingwatch/data-transforms'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import type { MultiSelectOption } from '@globalfishingwatch/ui-components'
import {
  Button,
  Collapsable,
  InputText,
  MultiSelect,
  Spinner,
  SwitchRow,
} from '@globalfishingwatch/ui-components'

import type { DataList } from 'features/datasets/upload/datasets-parse.utils'
import { getDatasetParsed, getTrackFromList } from 'features/datasets/upload/datasets-parse.utils'
import {
  useDatasetMetadata,
  useDatasetMetadataOptions,
} from 'features/datasets/upload/datasets-upload.hooks'
import {
  getDatasetMetadataValidations,
  getMetadataFromDataset,
  getTracksDatasetMetadata,
  parseGeoJsonProperties,
} from 'features/datasets/upload/datasets-upload.utils'
import FileDropzone from 'features/datasets/upload/FileDropzone'
import type { NewDatasetProps } from 'features/datasets/upload/NewDataset'
import NewDatasetField from 'features/datasets/upload/NewDatasetField'
import UserGuideLink from 'features/help/UserGuideLink'
import type { FileType, FileTypeResult } from 'utils/files'
import { getFileFromGeojson, getFileName, getFileType } from 'utils/files'

import { TimeFieldsGroup } from './TimeFieldsGroup'

import styles from './NewDataset.module.css'

function NewTrackDataset({
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
  const [sourceData, setSourceData] = useState<DataList | undefined>()
  const [geojson, setGeojson] = useState<FeatureCollection<LineString> | undefined>()
  const { datasetMetadata, setDatasetMetadata, setDatasetMetadataConfig } = useDatasetMetadata()
  const { getSelectedOption, filtersFieldsOptions } = useDatasetMetadataOptions(datasetMetadata)
  const numericFiltersFieldsOptions = filtersFieldsOptions.filter((f) => f.type === 'range')
  const isEditing = dataset?.id !== undefined
  const [fileTypeResult, setFileTypeResult] = useState<FileTypeResult | undefined>()
  const [isCSVFile, setIsCSVFile] = useState<boolean>(false)
  const sourceFormat = getDatasetConfigurationProperty({ dataset, property: 'sourceFormat' })

  useEffect(() => {
    const updateFileType = async () => {
      const fileTypeResult = await getFileType(file)
      const isCSVFile = fileTypeResult.fileType === 'CSV' || sourceFormat === 'CSV'
      setFileTypeResult(fileTypeResult)
      setIsCSVFile(isCSVFile)
    }
    updateFileType()
  }, [file, sourceFormat])

  const fieldsAllowed = datasetMetadata?.fieldsAllowed || dataset?.fieldsAllowed || []

  const isPublic = !!datasetMetadata?.public

  const lineIdProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'lineId',
  })
  const segmentIdProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'segmentId',
  })
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

  const { isValid, errors } = getDatasetMetadataValidations(datasetMetadata)

  const handleRawData = useCallback(
    async (file: File, fileTypeResult: FileTypeResult) => {
      setProcessingData(true)
      try {
        const data = await getDatasetParsed(file, 'tracks', fileTypeResult)
        const datasetMetadata = getTracksDatasetMetadata({
          data,
          name: getFileName(file),
          sourceFormat: fileTypeResult.fileType,
        })
        setDatasetMetadata(datasetMetadata)
        if (fileTypeResult.fileType === 'CSV') {
          setSourceData(data as DataList)
          const geojson = getTrackFromList(data as DataList, datasetMetadata)
          setGeojson(geojson)
          if (startTimeProperty && geojson.metadata?.hasDatesError) {
            setTimeFilterError(
              t((t) => t.datasetUpload.errors.invalidDatesFeatures, {
                featureType: t((t) => t.dataset.typePoints),
              })
            )
          } else {
            setTimeFilterError('')
          }
        } else {
          setGeojson(data as FeatureCollection<LineString>)
        }
        setProcessingData(false)
      } catch (e: any) {
        setProcessingData(false)
        onDatasetParseError(e, setDataParseError)
      }
    },
    [setDatasetMetadata, startTimeProperty, t, onDatasetParseError]
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
      const geojson = getTrackFromList(sourceData, datasetMetadata)
      setGeojson(geojson)
      if (startTimeProperty && geojson.metadata?.hasDatesError) {
        setTimeFilterError(
          t((t) => t.datasetUpload.errors.invalidDatesFeatures, {
            featureType: t((t) => t.dataset.typePoints),
          })
        )
      } else {
        setTimeFilterError('')
      }
      if (!geojson.features.some((f) => f.geometry.coordinates?.[0]?.length >= 2)) {
        if (lineIdProperty || segmentIdProperty) {
          setError(t((t) => t.errors.trackSegmentIdFields))
        } else {
          setError(t((t) => t.errors.trackCoordinateFields))
        }
      } else {
        setError('')
      }
    }
  }, [
    timeFilterType,
    lineIdProperty,
    endTimeProperty,
    latitudeProperty,
    longitudeProperty,
    startTimeProperty,
    segmentIdProperty,
  ])

  const onConfirmClick = useCallback(async () => {
    let error = ''
    if (datasetMetadata) {
      const config = getDatasetConfiguration(datasetMetadata)
      if (sourceData) {
        if (!config?.latitude || !config?.longitude) {
          const fields = (['latitude', 'longitude'] as const).map((f) =>
            t((t) => t.common[f], { defaultValue: f })
          )
          error = t((t) => t.dataset.requiredFields, {
            fields,
          })
        } else {
          const errors = checkRecordValidity({
            record: sourceData?.[0],
            ...config,
          } as any)
          if (errors.length) {
            const fields = errors
              .map((error) => t((t: any) => t.common[error], { defaultValue: error }))
              .join(',')
            error = t((t) => t.errors.fields, {
              fields,
            })
          }
        }
      }
      if (error) {
        setError(error)
      } else if (onConfirm) {
        setLoading(true)
        const file = geojson
          ? getFileFromGeojson(parseGeoJsonProperties<LineString>(geojson, datasetMetadata))
          : undefined
        await onConfirm(datasetMetadata, { file, isEditing })
        setLoading(false)
      }
    }
  }, [datasetMetadata, geojson, onConfirm, sourceData, t, isEditing])

  // const filterOptions = isCSVFile ? numericFiltersFieldsOptions : filtersFieldsOptions
  const filterOptions = filtersFieldsOptions

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
      {!isEditing && (
        <FileDropzone
          label={file?.name}
          fileTypes={fileTypeResult ? [fileTypeResult.fileType as FileType] : []}
          onFileLoaded={onFileUpdate}
        />
      )}
      <div className={styles.content}>
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
            filterOptions={['none', 'date']}
            datasetMetadata={datasetMetadata}
            setDatasetMetadataConfig={setDatasetMetadataConfig}
            disabled={loading || isEditing}
          />
        </div>
        <p className={cx(styles.errorMsg, styles.errorMargin)}>{timeFilterError}</p>
        {isCSVFile && (
          <div className={styles.row}>
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="lineId"
              label={t((t) => t.datasetUpload.tracks.lineId)}
              editable={!isEditing && !loading}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ lineId: selected.id })
              }}
              onCleanClick={() => {
                setDatasetMetadata({ fieldsAllowed: [] })
                setDatasetMetadataConfig({ lineId: '' })
              }}
              infoTooltip={t((t) => t.datasetUpload.tracks.lineIdHelp)}
            />
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="segmentId"
              label={t((t) => t.datasetUpload.tracks.segmentId)}
              editable={!isEditing && !loading}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ segmentId: selected.id })
              }}
              onCleanClick={() => {
                setDatasetMetadata({ fieldsAllowed: [] })
                setDatasetMetadataConfig({ segmentId: '' })
              }}
              infoTooltip={t((t) => t.datasetUpload.tracks.segmentIdHelp)}
            />
          </div>
        )}
      </div>
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
          label={t((t) => t.datasetUpload.tracks.name)}
          onSelect={(selected) => {
            setDatasetMetadataConfig({ valueProperties: [selected.id] })
          }}
          onCleanClick={() => {
            setDatasetMetadataConfig({ valueProperties: [] })
          }}
          editable={!loading}
          infoTooltip={t((t) => t.datasetUpload.tracks.nameHelp)}
        />
        <MultiSelect
          label={t((t) => t.datasetUpload.tracks.filters)}
          placeholder={
            !filterOptions.length
              ? t((t) => t.datasetUpload.noFilters)
              : fieldsAllowed.length > 0
                ? fieldsAllowed.join(', ')
                : t((t) => t.datasetUpload.fieldMultiplePlaceholder)
          }
          direction="top"
          disabled={loading || !filterOptions.length}
          disabledMsg={!loading ? t((t) => t.datasetUpload.noFilters) : undefined}
          options={filterOptions as MultiSelectOption[]}
          selectedOptions={getSelectedOption(fieldsAllowed) as MultiSelectOption[]}
          onSelect={(newFilter: MultiSelectOption) => {
            setDatasetMetadata({ fieldsAllowed: [...fieldsAllowed, newFilter.id] })
          }}
          onRemove={(_: MultiSelectOption, rest: MultiSelectOption[]) => {
            setDatasetMetadata({ fieldsAllowed: rest.map((f: MultiSelectOption) => f.id) })
          }}
          onCleanClick={() => {
            setDatasetMetadata({ fieldsAllowed: [] })
          }}
          infoTooltip={t((t) => t.datasetUpload.tracks.filtersHelp)}
        />
        <SwitchRow
          className={styles.saveAsPublic}
          label={t((t) => t.dataset.uploadPublic)}
          // disabled={!!mapDrawEditDataset}
          active={isPublic}
          disabled={isEditing || loading}
          onClick={() => setDatasetMetadata({ public: !isPublic })}
        />
      </Collapsable>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
          <UserGuideLink section="uploadTracks" />
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

export default NewTrackDataset
