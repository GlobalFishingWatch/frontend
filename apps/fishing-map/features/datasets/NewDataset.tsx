import React, { useState, useCallback, Fragment } from 'react'
import { FeatureCollectionWithFilename } from 'shpjs'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { lowerCase } from 'lodash'
import { useSelector } from 'react-redux'
import { parse as parseCSV } from 'papaparse'
import { Feature } from 'geojson'
import { Modal, Button } from '@globalfishingwatch/ui-components'
import {
  AnyDatasetConfiguration,
  DatasetCategory,
  DatasetConfiguration,
  DatasetGeometryType,
  DatasetTypes,
  EnviromentalDatasetConfiguration,
} from '@globalfishingwatch/api-types'
import {
  checkRecordValidity,
  csvToTrackSegments,
  guessColumns,
  segmentsToGeoJSON,
} from '@globalfishingwatch/data-transforms'
import { capitalize } from 'utils/shared'
import { SUPPORT_EMAIL } from 'data/config'
import { selectLocationType } from 'routes/routes.selectors'
import { readBlobAs } from 'utils/files'
import {
  useDatasetsAPI,
  useDatasetModalConnect,
  useAddDataviewFromDatasetToWorkspace,
} from './datasets.hook'
import styles from './NewDataset.module.css'
import DatasetFile from './DatasetFile'
import DatasetConfig, { extractPropertiesFromGeojson } from './DatasetConfig'
import DatasetTypeSelect from './DatasetTypeSelect'

export type DatasetMetadata = {
  name: string
  public: boolean
  description?: string
  category: DatasetCategory
  type: DatasetTypes
  configuration?: AnyDatasetConfiguration
  fields?: string[]
  guessedFields?: Record<string, string>
}

export type CSV = Record<string, any>[]

function NewDataset(): React.ReactElement {
  const { t } = useTranslation()
  const { datasetModal, datasetCategory, dispatchDatasetModal } = useDatasetModalConnect()
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()

  const [datasetGeometryType, setDatasetGeometryType] = useState<DatasetGeometryType | undefined>(
    undefined
  )
  const [datasetGeometryTypeConfirmed, setDatasetGeometryTypeConfirmed] = useState<boolean>(false)
  const [file, setFile] = useState<File | undefined>()
  const [fileData, setFileData] = useState<
    Feature | FeatureCollectionWithFilename | CSV | undefined
  >()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [metadata, setMetadata] = useState<DatasetMetadata | undefined>()
  const locationType = useSelector(selectLocationType)
  const { dispatchCreateDataset } = useDatasetsAPI()

  const onFileLoaded = useCallback(
    async (file: File, type: DatasetGeometryType | undefined) => {
      setLoading(true)
      setError('')
      const name =
        file.name.lastIndexOf('.') > 0 ? file.name.substr(0, file.name.lastIndexOf('.')) : file.name

      const metadataName = capitalize(lowerCase(name))

      if (type === 'tracks') {
        setFile(file)
        const fileData = await readBlobAs(file, 'text')
        const { data, meta } = parseCSV(fileData, {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        })
        setFileData(data as CSV)
        const guessedColumns = guessColumns(meta?.fields)
        setMetadata({
          ...metadata,
          name: metadataName,
          public: true,
          type: DatasetTypes.UserTracks,
          category: datasetCategory,
          fields: meta?.fields,
          guessedFields: guessedColumns,
          configuration: {
            latitude: guessedColumns.latitude,
            longitude: guessedColumns.longitude,
            timestamp: guessedColumns.timestamp,
            geometryType: datasetGeometryType,
          } as DatasetConfiguration,
        })
      } else if (!type || type === 'polygons' || type === 'points') {
        const isZip =
          file.type === 'application/zip' ||
          file.type === 'application/x-zip-compressed' ||
          file.type === 'application/octet-stream' ||
          file.type === 'multipart/x-zip'
        const isGeojson =
          (!isZip && file.type === 'application/json') || (!isZip && file.name.includes('.geojson'))

        if (isGeojson && file.name.includes('.geojson')) {
          const blob = file.slice(0, file.size, 'application/json')
          const fileAsJson = new File([blob], `${name}.json`, { type: 'application/json' })
          setFile(fileAsJson)
        } else {
          setFile(file)
        }

        let geojson: Feature | FeatureCollectionWithFilename | undefined = undefined
        if (isZip) {
          try {
            const shpjs = await import('shpjs').then((module) => module.default)
            const fileData = await readBlobAs(file, 'arrayBuffer')
            // TODO support multiple files in shapefile
            geojson = (await shpjs(fileData)) as FeatureCollectionWithFilename
          } catch (e: any) {
            console.warn('Error reading file:', e)
          }
        } else {
          const fileData = await readBlobAs(file, 'text')
          try {
            geojson = JSON.parse(fileData)
          } catch (e: any) {
            console.warn('Error reading file:', e)
          }
        }
        if (geojson !== undefined) {
          setFileData(geojson)
          const fields = extractPropertiesFromGeojson(geojson as FeatureCollectionWithFilename)
          const configuration = {
            fields,
            geometryType: datasetGeometryType,
            // TODO when supporting multiple files upload
            // ...(geojson?.fileName && { file: geojson.fileName }),
            ...(isGeojson && { format: 'geojson' }),
          } as DatasetConfiguration

          // Set disableInteraction flag when not all features are polygons
          if (datasetCategory === 'context' && datasetGeometryType === 'polygons') {
            if (
              (geojson.type === 'Feature' && geojson.geometry.type === 'Polygon') ||
              !(geojson as FeatureCollectionWithFilename).features?.every((feature) =>
                ['Polygon', 'MultiPolygon'].includes(feature.geometry.type)
              )
            ) {
              configuration.disableInteraction = true
            }
          }
          setMetadata((metadata) => ({
            ...metadata,
            public: true,
            name: metadataName,
            type: DatasetTypes.Context,
            category: datasetCategory,
            configuration,
          }))
        } else {
          setFileData(undefined)
          setError(t('errors.datasetNotValid', 'It seems to be something wrong with your file'))
        }
      }
      setLoading(false)
    },
    [datasetCategory, t, metadata, datasetGeometryType]
  )

  const onDatasetFieldChange = (field: DatasetMetadata | AnyDatasetConfiguration) => {
    // TODO insert fields validation here
    setMetadata((meta) => {
      let error = ''
      const isRootMetaField =
        Object.prototype.hasOwnProperty.call(field, 'name') ||
        Object.prototype.hasOwnProperty.call(field, 'description') ||
        Object.prototype.hasOwnProperty.call(field, 'public')
      const newMetadata = isRootMetaField
        ? { ...meta, ...(field as DatasetMetadata) }
        : {
            ...(meta as DatasetMetadata),
            configuration: {
              ...meta?.configuration,
              ...(field as AnyDatasetConfiguration),
            },
          }
      const { min, max } =
        (newMetadata.configuration as EnviromentalDatasetConfiguration)?.propertyToIncludeRange ||
        {}
      if (min && max && min >= max) {
        error = t('errors.invalidRange', 'Min has to be lower than max value')
      }
      if (meta?.category === DatasetCategory.Environment && datasetGeometryType === 'tracks') {
        if (
          fileData &&
          newMetadata.configuration?.latitude &&
          newMetadata.configuration?.longitude &&
          newMetadata.configuration?.timestamp
        ) {
          const errors = checkRecordValidity({
            record: (fileData as CSV)[0],
            ...newMetadata.configuration,
          } as any)
          if (errors.length) {
            const fields = errors.map((error) => t(`common.${error}` as any, error)).join(',')
            error = t('errors.fields', { fields, defaultValue: `Error with fields: ${fields}` })
          }
        }
      }
      setError(error)
      return newMetadata
    })
  }

  const onConfirmClick = async () => {
    if (file) {
      let validityError
      let userTrackGeoJSONFile
      if (
        metadata?.category === DatasetCategory.Environment &&
        datasetGeometryType === 'polygons'
      ) {
        if (!metadata?.configuration?.propertyToInclude) {
          validityError = t('dataset.requiredFields', {
            fields: 'value',
            defaultValue: 'Required field value',
          }) as string
        }
      } else if (
        metadata?.category === DatasetCategory.Environment &&
        datasetGeometryType === 'tracks'
      ) {
        if (
          !metadata.configuration?.latitude ||
          !metadata.configuration?.longitude ||
          !metadata.configuration?.timestamp
        ) {
          const fields = ['latitude', 'longitude', 'timestamp'].map((f) =>
            t(`common.${f}` as any, f)
          )
          validityError = t('dataset.requiredFields', {
            fields,
            defaultValue: `Required fields ${fields}`,
          }) as string
        } else {
          const errors = checkRecordValidity({
            record: (fileData as CSV)[0],
            ...metadata.configuration,
          } as any)
          if (errors.length) {
            const fields = errors.map((error) => t(`common.${error}` as any, error)).join(',')
            validityError = t('errors.fields', {
              fields,
              defaultValue: `Error with fields: ${fields}`,
            }) as string
          } else {
            const segments = csvToTrackSegments({
              records: fileData as CSV,
              ...(metadata.configuration as any),
            })
            const geoJSON = segmentsToGeoJSON(segments)
            userTrackGeoJSONFile = new File([JSON.stringify(geoJSON)], 'file.json', {
              type: 'application/json',
            })
          }
        }
      }
      if (validityError) {
        setError(validityError)
        return
      }

      let uaCategory, uaDatasetType
      if (metadata?.category === DatasetCategory.Environment) {
        uaCategory = 'Environmental data'
        uaDatasetType = 'environmental dataset'
      } else if (metadata?.category === DatasetCategory.Context) {
        uaCategory = 'Reference layer'
        uaDatasetType = 'reference layer'
      }
      uaEvent({
        category: `${uaCategory}`,
        action: `Confirm ${uaDatasetType} upload`,
        label: userTrackGeoJSONFile?.name ?? file.name,
      })
      setLoading(true)
      const { payload, error: createDatasetError } = await dispatchCreateDataset({
        dataset: {
          ...metadata,
        },
        file: userTrackGeoJSONFile || file,
        createAsPublic: metadata?.public ?? true,
      })
      setLoading(false)

      if (createDatasetError) {
        setError(
          `${t('errors.generic', 'Something went wrong, try again or contact:')} ${SUPPORT_EMAIL}`
        )
      } else if (payload) {
        if (locationType === 'HOME' || locationType === 'WORKSPACE') {
          const dataset = { ...payload }
          addDataviewFromDatasetToWorkspace(dataset)
        }
        onClose()
      }
    }
  }

  const onClose = async () => {
    setError('')
    setLoading(false)
    setMetadata(undefined)
    dispatchDatasetModal(undefined)
    setDatasetGeometryType(undefined)
    setDatasetGeometryTypeConfirmed(false)
  }

  const onDatasetTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatasetGeometryType(e.target.value as DatasetGeometryType)
  }

  const onConfirmDatasetCategoryClick = () => {
    if (datasetCategory === DatasetCategory.Environment) {
      uaEvent({
        category: 'Environmental data',
        action: `Start upload environmental dataset flow`,
        label: datasetGeometryType ?? '',
      })
    }
    setDatasetGeometryTypeConfirmed(true)
  }

  return (
    <Modal
      appSelector="__next"
      title={
        datasetCategory === DatasetCategory.Context
          ? t('dataset.uploadNewContext', 'Upload new context areas')
          : t('dataset.uploadNewEnviroment', 'Upload new environment dataset')
      }
      isOpen={datasetModal === 'new'}
      contentClassName={styles.modalContainer}
      onClose={onClose}
    >
      <div className={styles.modalContent}>
        {datasetGeometryTypeConfirmed === false ? (
          <DatasetTypeSelect
            datasetCategory={datasetCategory}
            onDatasetTypeChange={onDatasetTypeChange}
            currentType={datasetGeometryType}
          />
        ) : (
          <Fragment>
            {/* eslint-disable-next-line  */}
            <DatasetFile onFileLoaded={onFileLoaded} type={datasetGeometryType} />
            {fileData && metadata && (
              <DatasetConfig
                fileData={fileData as FeatureCollectionWithFilename}
                metadata={metadata}
                datasetCategory={datasetCategory}
                // eslint-disable-next-line
                datasetGeometryType={datasetGeometryType!}
                onDatasetFieldChange={onDatasetFieldChange}
              />
            )}
          </Fragment>
        )}
      </div>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
          <span className={styles.hint}>
            <a
              href="https://globalfishingwatch.org/article-categories/reference-layers/"
              target="_blank"
              rel="noreferrer"
            >
              {t('dataset.hint', 'Find out more about the supported formats')}
            </a>
          </span>
        </div>
        {datasetGeometryTypeConfirmed === false ? (
          <Button
            disabled={!datasetGeometryType}
            className={styles.saveBtn}
            onClick={onConfirmDatasetCategoryClick}
          >
            {t('common.confirm', 'Confirm') as string}
          </Button>
        ) : (
          <Button
            disabled={!file || !metadata?.name}
            className={styles.saveBtn}
            onClick={onConfirmClick}
            loading={loading}
          >
            {t('common.confirm', 'Confirm') as string}
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default NewDataset
