import { useState, useCallback, Fragment } from 'react'
import { featureCollection, point } from '@turf/helpers'
import type { FeatureCollectionWithFilename } from 'shpjs'
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
  guessColumn,
  guessColumns,
  segmentsToGeoJSON,
} from '@globalfishingwatch/data-transforms'
import { capitalize } from 'utils/shared'
import { ROOT_DOM_ELEMENT, SUPPORT_EMAIL } from 'data/config'
import { selectLocationType } from 'routes/routes.selectors'
import { getFileFromGeojson, readBlobAs } from 'utils/files'
import FileDropzone from 'features/common/FileDropzone'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import UserGuideLink from 'features/help/UserGuideLink'
import {
  useDatasetsAPI,
  useDatasetModalConnect,
  useAddDataviewFromDatasetToWorkspace,
} from './datasets.hook'
import styles from './NewDataset.module.css'
import DatasetConfig, { extractPropertiesFromGeojson } from './DatasetConfig'
import DatasetTypeSelect from './DatasetTypeSelect'
import { getFileTypes } from './datasets.utils'

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

// TODO Update https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b453d9d1b99c48c8711c31c2a64e9dffb6ce729d/types/shpjs/index.d.ts
// When this gets merged to upstream https://github.com/calvinmetcalf/shapefile-js/pull/181
interface FeatureCollectionWithMetadata extends FeatureCollectionWithFilename {
  extensions?: string[]
}

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
    Feature | FeatureCollectionWithMetadata | CSV | undefined
  >()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [metadata, setMetadata] = useState<DatasetMetadata | undefined>()
  const locationType = useSelector(selectLocationType)
  const { dispatchCreateDataset } = useDatasetsAPI()

  const onFileLoaded = useCallback(
    async (file: File) => {
      const type = datasetGeometryType
      setLoading(true)
      setError('')
      const name =
        file.name.lastIndexOf('.') > 0 ? file.name.substr(0, file.name.lastIndexOf('.')) : file.name

      const metadataName = capitalize(lowerCase(name))
      let formatGeojson = false

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
          !isZip && (file.type === 'application/json' || file.name.includes('.geojson'))
        const isCSV = !isZip && !isGeojson && file.type === 'text/csv'

        if (isGeojson) {
          formatGeojson = true
          const blob = file.slice(0, file.size, 'application/json')
          const fileAsJson = new File([blob], `${name}.json`, { type: 'application/json' })
          setFile(fileAsJson)
        } else {
          setFile(file)
        }

        let geojson: Feature | FeatureCollectionWithMetadata | undefined = undefined
        if (isZip) {
          try {
            const shpjs = await import('shpjs').then((module) => module.default)
            const fileData = await readBlobAs(file, 'arrayBuffer')
            // TODO support multiple files in shapefile
            const expandedShp = (await shpjs(fileData)) as FeatureCollectionWithMetadata
            if (Array.isArray(expandedShp)) {
              // geojson = expandedShp[0]
              setFileData(undefined)
              setLoading(false)
              setError(
                t(
                  'errors.datasetShapefileMultiple',
                  'Shapefiles containing multiple components (multiple file names) are not supported yet'
                )
              )
              return
            } else {
              if (
                expandedShp.extensions &&
                (!expandedShp.extensions.includes('.shp') ||
                  !expandedShp.extensions.includes('.shx') ||
                  !expandedShp.extensions.includes('.prj') ||
                  !expandedShp.extensions.includes('.dbf'))
              ) {
                setFileData(undefined)
                setError(
                  t(
                    'errors.uploadShapefileComponents',
                    'Error reading shapefile: must contain files with *.shp, *.shx, *.dbf and *.prj extensions.'
                  )
                )
              } else {
                geojson = expandedShp
              }
            }
          } catch (e: any) {
            setFileData(undefined)
            setError(
              t('errors.uploadShapefile', 'Error reading shapefile: {{error}}', { error: e })
            )
          }
        } else if (isCSV) {
          const fileData = await readBlobAs(file, 'text')
          const { data, meta } = parseCSV<any>(fileData, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
          })
          const latField = guessColumn('latitude', meta.fields)
          const lngField = guessColumn('longitude', meta.fields)
          if (latField !== undefined && lngField !== undefined) {
            formatGeojson = true
            try {
              geojson = featureCollection(
                data.flatMap((d) => {
                  const { [latField]: lat, [lngField]: lng, ...rest } = d
                  return lat && lng ? point([lng, lat], rest) : []
                })
              )
            } catch (e) {
              setFileData(undefined)
              setError(t('errors.uploadCsv', 'Error reading CSV: {{error}}', { error: e }))
            }
          } else {
            setFileData(undefined)
            setError(t('errors.missingLatLng', 'No latitude or longitude fields found'))
          }
          // geojson = JSON.parse(fileData)
        } else {
          const fileData = await readBlobAs(file, 'text')
          try {
            geojson = JSON.parse(fileData)
          } catch (e: any) {
            setFileData(undefined)
            setError(t('errors.uploadGeojson', 'Error reading GeoJSON: {{error}}', { error: e }))
          }
        }

        if (geojson !== undefined) {
          setFileData(geojson)
          const fields = extractPropertiesFromGeojson(geojson as FeatureCollectionWithMetadata)
          const configuration = {
            fields,
            geometryType: datasetGeometryType,
            // TODO when supporting multiple files upload
            // ...(geojson?.fileName && { file: geojson.fileName }),
            ...(formatGeojson && { format: 'geojson' }),
          } as DatasetConfiguration

          // Set disableInteraction flag when not all features are polygons
          if (datasetCategory === 'context' && datasetGeometryType === 'polygons') {
            if (
              (geojson.type === 'Feature' && geojson.geometry?.type === 'Polygon') ||
              !(geojson as FeatureCollectionWithMetadata).features?.every((feature) =>
                ['Polygon', 'MultiPolygon'].includes(feature.geometry?.type)
              )
            ) {
              configuration.disableInteraction = true
            }
          }
          setMetadata((metadata) => ({
            ...metadata,
            public: true,
            name: metadataName,
            type: DatasetTypes.UserContext,
            category: datasetCategory,
            configuration,
          }))
        } else if (error === '') {
          setFileData(undefined)
          setError(t('errors.datasetNotValid', 'It seems to be something wrong with your file'))
        }
      }
      setLoading(false)
    },
    [datasetCategory, t, metadata, datasetGeometryType, error]
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
      let onTheFlyGeoJSONFile
      if (metadata?.category === DatasetCategory.Environment && datasetGeometryType === 'tracks') {
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
            onTheFlyGeoJSONFile = getFileFromGeojson(geoJSON)
          }
        }
      } else if (
        metadata?.category === DatasetCategory.Context &&
        datasetGeometryType === 'points' &&
        file.type === 'text/csv'
      ) {
        onTheFlyGeoJSONFile = getFileFromGeojson(fileData as Feature)
      }
      if (validityError) {
        setError(validityError)
        return
      }

      let uaCategory: TrackCategory | undefined
      let uaDatasetType
      if (metadata?.category === DatasetCategory.Environment) {
        uaCategory = TrackCategory.EnvironmentalData
        uaDatasetType = 'environmental dataset'
      } else if (metadata?.category === DatasetCategory.Context) {
        uaCategory = TrackCategory.ReferenceLayer
        uaDatasetType = 'reference layer'
      }
      trackEvent({
        category: uaCategory,
        action: `Confirm ${uaDatasetType} upload`,
        label: onTheFlyGeoJSONFile?.name ?? file.name,
      })
      setLoading(true)
      const { fields, guessedFields, ...meta } = metadata
      const { payload, error: createDatasetError } = await dispatchCreateDataset({
        dataset: {
          ...meta,
          unit: 'TBD',
          subcategory: 'info',
        },
        file: onTheFlyGeoJSONFile || file,
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
      trackEvent({
        category: TrackCategory.EnvironmentalData,
        action: `Start upload environmental dataset flow`,
        label: datasetGeometryType ?? '',
      })
    }
    setDatasetGeometryTypeConfirmed(true)
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
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
            <FileDropzone
              onFileLoaded={onFileLoaded}
              fileTypes={getFileTypes(datasetGeometryType)}
            />
            {fileData && metadata && (
              <DatasetConfig
                fileData={fileData as FeatureCollectionWithMetadata}
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
          {datasetCategory === DatasetCategory.Context ? (
            <UserGuideLink section="uploadReference" />
          ) : (
            <UserGuideLink section="uploadEnvironment" />
          )}
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
