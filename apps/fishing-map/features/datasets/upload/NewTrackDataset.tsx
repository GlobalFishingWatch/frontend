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
          onChange={(e) => setDatasetMetadata({ name: e.target.value })}
        />
        {isCSVFile && (
          <div className={styles.requiredDataContainer}>
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="latitude"
              label={t('dataset.latitude', 'latitude')}
              editable={!isEditing}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ latitude: selected.id })
              }}
            />
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="longitude"
              label={t('dataset.longitude', 'longitude')}
              editable={!isEditing}
              onSelect={(selected) => {
                setDatasetMetadataConfig({ longitude: selected.id })
              }}
            />
            <div className={styles.timestampSelectWrapper}>
              <NewDatasetField
                datasetMetadata={datasetMetadata}
                property="timestamp"
                label={t('dataset.trackSegmentTimes', 'Track segment times')}
                editable={!isEditing}
                onSelect={(selected) => {
                  setDatasetMetadataConfig({ timestamp: selected.id })
                }}
              />
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
          onChange={(e) => setDatasetMetadata({ description: e.target.value })}
        />
        {isCSVFile && (
          <Fragment>
            <NewDatasetField
              datasetMetadata={datasetMetadata}
              property="idProperty"
              label={t('dataset.trackSegmentId', 'Individual track segment id')}
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
          label={t('dataset.trackSegmentId', 'track filter property')}
          placeholder={
            fieldsAllowed.length > 0
              ? fieldsAllowed.join(', ')
              : t('dataset.fieldPlaceholder', 'Select a field from your dataset')
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
      </Collapsable>
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
