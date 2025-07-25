import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import type { FeatureCollection } from 'geojson'

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
} from 'features/datasets/upload/datasets-upload.utils'
import FileDropzone from 'features/datasets/upload/FileDropzone'
import type { NewDatasetProps } from 'features/datasets/upload/NewDataset'
import NewDatasetField from 'features/datasets/upload/NewDatasetField'
import UserGuideLink from 'features/help/UserGuideLink'
import type { FileType } from 'utils/files'
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
  const [geojson, setGeojson] = useState<FeatureCollection | undefined>()
  const { datasetMetadata, setDatasetMetadata, setDatasetMetadataConfig } = useDatasetMetadata()
  const { getSelectedOption, filtersFieldsOptions } = useDatasetMetadataOptions(datasetMetadata)
  const isEditing = dataset?.id !== undefined
  const fileType = getFileType(file, 'tracks')
  const sourceFormat = getDatasetConfigurationProperty({ dataset, property: 'sourceFormat' })
  const isCSVFile = fileType === 'CSV' || sourceFormat === 'CSV'
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
    async (file: File) => {
      setProcessingData(true)
      try {
        const data = await getDatasetParsed(file, 'tracks')
        const fileType = getFileType(file, 'tracks')
        const datasetMetadata = getTracksDatasetMetadata({
          data,
          name: getFileName(file),
          sourceFormat: fileType as FileType,
        })
        setDatasetMetadata(datasetMetadata)
        if (fileType === 'CSV') {
          setSourceData(data as DataList)
          const geojson = getTrackFromList(data as DataList, datasetMetadata)
          setGeojson(geojson)
          if (startTimeProperty && geojson.metadata?.hasDatesError) {
            setTimeFilterError(
              t('datasetUpload.errors.invalidDatesFeatures', {
                featureType: t('dataset.typePoints'),
              })
            )
          } else {
            setTimeFilterError('')
          }
        } else {
          setGeojson(data as FeatureCollection)
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
    if (file && !loading) {
      handleRawData(file)
    } else if (dataset) {
      setDatasetMetadata(getMetadataFromDataset(dataset))
    }
  }, [dataset, file])

  useEffect(() => {
    if (sourceData) {
      const geojson = getTrackFromList(sourceData, datasetMetadata)
      setGeojson(geojson)
      if (startTimeProperty && geojson.metadata?.hasDatesError) {
        setTimeFilterError(
          t('datasetUpload.errors.invalidDatesFeatures', {
            featureType: t('dataset.typePoints'),
          })
        )
      } else {
        setTimeFilterError('')
      }
      if (!geojson.features.some((f) => f.geometry.coordinates?.[0]?.length >= 2)) {
        if (lineIdProperty || segmentIdProperty) {
          setError(t('errors.trackSegmentIdFields'))
        } else {
          setError(t('errors.trackCoordinateFields'))
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
          const fields = ['latitude', 'longitude'].map((f) => t(`common.${f}` as any, f))
          error = t('dataset.requiredFields', {
            fields,
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
            })
          }
        }
      }
      if (error) {
        setError(error)
      } else if (onConfirm) {
        setLoading(true)
        const file = geojson ? getFileFromGeojson(geojson) : undefined
        await onConfirm(datasetMetadata, { file, isEditing })
        setLoading(false)
      }
    }
  }, [datasetMetadata, geojson, onConfirm, sourceData, t, isEditing])

  if (processingData) {
    return (
      <div className={styles.processingData}>
        <Spinner className={styles.processingDataSpinner} />
        <p>{t('datasetUpload.processingData')}</p>
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
          fileTypes={[fileType as FileType]}
          onFileLoaded={onFileUpdate}
        />
      )}
      <div className={styles.content}>
        <InputText
          value={datasetMetadata?.name}
          label={t('datasetUpload.datasetName')}
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
              label={`${t('datasetUpload.point.coordinates')} - ${t('common.latitude')}`}
              editable={!isEditing && !loading}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ latitude: selected.id })
              }}
            />
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="longitude"
              label={t('common.longitude')}
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
              label={t('datasetUpload.tracks.lineId')}
              editable={!isEditing && !loading}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ lineId: selected.id })
              }}
              onCleanClick={() => {
                setDatasetMetadata({ fieldsAllowed: [] })
                setDatasetMetadataConfig({ lineId: '' })
              }}
              infoTooltip={t('datasetUpload.tracks.lineIdHelp')}
            />
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="segmentId"
              label={t('datasetUpload.tracks.segmentId')}
              editable={!isEditing && !loading}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ segmentId: selected.id })
              }}
              onCleanClick={() => {
                setDatasetMetadata({ fieldsAllowed: [] })
                setDatasetMetadataConfig({ segmentId: '' })
              }}
              infoTooltip={t('datasetUpload.tracks.segmentIdHelp')}
            />
          </div>
        )}
      </div>
      <Collapsable className={styles.optional} label={t('datasetUpload.optionalFields')}>
        <InputText
          value={datasetMetadata?.description}
          label={t('datasetUpload.datasetDescription')}
          className={styles.input}
          onChange={(e) => setDatasetMetadata({ description: e.target.value })}
          disabled={loading}
        />
        <NewDatasetField
          datasetMetadata={datasetMetadata}
          property="valueProperties"
          label={t('datasetUpload.tracks.name')}
          onSelect={(selected) => {
            setDatasetMetadataConfig({ valueProperties: [selected.id] })
          }}
          onCleanClick={() => {
            setDatasetMetadataConfig({ valueProperties: [] })
          }}
          editable={!loading}
          infoTooltip={t('datasetUpload.tracks.nameHelp')}
        />
        <MultiSelect
          label={t('datasetUpload.tracks.filters')}
          placeholder={
            fieldsAllowed.length > 0
              ? fieldsAllowed.join(', ')
              : t('datasetUpload.fieldMultiplePlaceholder')
          }
          direction="top"
          disabled={loading}
          options={filtersFieldsOptions}
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
          infoTooltip={t('datasetUpload.tracks.filtersHelp')}
        />
        <SwitchRow
          className={styles.saveAsPublic}
          label={t('dataset.uploadPublic')}
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
          {t('common.confirm') as string}
        </Button>
      </div>
    </div>
  )
}

export default NewTrackDataset
