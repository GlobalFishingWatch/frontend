import { useTranslation } from 'react-i18next'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { FeatureCollection } from 'geojson'
import {
  Button,
  Collapsable,
  InputText,
  MultiSelect,
  MultiSelectOption,
  SwitchRow,
} from '@globalfishingwatch/ui-components'
import { checkRecordValidity } from '@globalfishingwatch/data-transforms'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import UserGuideLink from 'features/help/UserGuideLink'
import { FileType, getFileFromGeojson, getFileType, getFileName } from 'utils/files'
import { NewDatasetProps } from 'features/datasets/upload/NewDataset'
import FileDropzone from 'features/datasets/upload/FileDropzone'
import {
  DataList,
  getDatasetParsed,
  getTrackFromList,
} from 'features/datasets/upload/datasets-parse.utils'
import {
  getMetadataFromDataset,
  getTracksDatasetMetadata,
} from 'features/datasets/upload/datasets-upload.utils'
import {
  useDatasetMetadata,
  useDatasetMetadataOptions,
} from 'features/datasets/upload/datasets-upload.hooks'
import NewDatasetField from 'features/datasets/upload/NewDatasetField'
import styles from './NewDataset.module.css'

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
  const { datasetMetadata, setDatasetMetadata, setDatasetMetadataConfig } = useDatasetMetadata()
  const { getSelectedOption, filtersFieldsOptions } = useDatasetMetadataOptions(datasetMetadata)
  const isEditing = dataset?.id !== undefined
  const fileType = getFileType(file)
  const sourceFormat = getDatasetConfigurationProperty({ dataset, property: 'sourceFormat' })
  const isCSVFile = fileType === 'csv' || sourceFormat === 'csv'
  const fieldsAllowed = datasetMetadata?.fieldsAllowed || dataset?.fieldsAllowed || []
  const isPublic = !!datasetMetadata?.public
  const idProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'idProperty',
  })
  const latitudeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'latitude',
  })
  const longitudeProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'longitude',
  })
  const timestampProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'timestamp',
  })

  const handleRawData = useCallback(
    async (file: File) => {
      setLoading(true)
      const data = await getDatasetParsed(file, 'tracks')
      const fileType = getFileType(file)
      const datasetMetadata = getTracksDatasetMetadata({
        data,
        name: getFileName(file),
        sourceFormat: fileType as FileType,
      })
      setDatasetMetadata(datasetMetadata)
      if (fileType === 'csv') {
        setSourceData(data as DataList)
        const geojson = getTrackFromList(data as DataList, datasetMetadata)
        setGeojson(geojson)
      } else {
        setGeojson(data as FeatureCollection)
      }
      setLoading(false)
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
    if (latitudeProperty && longitudeProperty && idProperty && timestampProperty && sourceData) {
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
  }, [idProperty, latitudeProperty, longitudeProperty, timestampProperty])

  const onConfirmClick = useCallback(async () => {
    let error = ''
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
      } else if (onConfirm) {
        setLoading(true)
        const file = geojson ? getFileFromGeojson(geojson) : undefined
        await onConfirm(datasetMetadata, file)
        setLoading(false)
      }
    }
  }, [datasetMetadata, geojson, onConfirm, sourceData, t])

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
              label={t('common.longitude', 'longitude')}
              editable={!isEditing}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ longitude: selected.id })
              }}
            />
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="timestamp"
              label={t('datasetUpload.tracks.segmentTimes', 'Track point times')}
              editable={!isEditing}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ timestamp: selected.id })
              }}
            />
          </div>
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
        {isCSVFile && (
          <Fragment>
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="idProperty"
              label={t('datasetUpload.tracks.segmentId', 'Individual segment id')}
              editable={!isEditing}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ idProperty: selected.id })
              }}
              onCleanClick={() => {
                setDatasetMetadata({ fieldsAllowed: [] })
                setDatasetMetadataConfig({ idProperty: undefined })
              }}
            />
          </Fragment>
        )}
        <MultiSelect
          label={t('datasetUpload.tracks.filters', 'Line filters')}
          placeholder={
            fieldsAllowed.length > 0
              ? fieldsAllowed.join(', ')
              : t('datasetUpload.fieldMultiplePlaceholder', 'Select fields from your dataset')
          }
          direction="top"
          disabled={
            isCSVFile &&
            !getDatasetConfigurationProperty({ dataset: datasetMetadata, property: 'idProperty' })
          }
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
        />
        <SwitchRow
          className={styles.saveAsPublic}
          label={t(
            'dataset.uploadPublic',
            'Allow other users to see this dataset when you share a workspace'
          )}
          // disabled={!!mapDrawEditDataset}
          active={isPublic}
          disabled={isEditing}
          onClick={() => setDatasetMetadata({ public: !isPublic })}
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
          disabled={!datasetMetadata || error !== '' || idGroupError !== ''}
          loading={loading}
        >
          {t('common.confirm', 'Confirm') as string}
        </Button>
      </div>
    </div>
  )
}

export default NewTrackDataset
