import { useState, useCallback } from 'react'
import type { FeatureCollectionWithFilename } from 'shpjs'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Modal } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetGeometryType } from '@globalfishingwatch/api-types'
import { ROOT_DOM_ELEMENT, SUPPORT_EMAIL } from 'data/config'
import { selectLocationType } from 'routes/routes.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import NewPolygonDataset from 'features/datasets/upload/NewPolygonDataset'
import NewPointsDataset from 'features/datasets/upload/NewPointsDataset'
import NewTrackDataset from 'features/datasets/upload/NewTrackDataset'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import {
  useDatasetsAPI,
  useDatasetModalOpenConnect,
  useAddDataviewFromDatasetToWorkspace,
  useDatasetModalConfigConnect,
} from '../datasets.hook'
// import DatasetConfig, { extractPropertiesFromGeojson } from '../DatasetConfig'
import DatasetTypeSelect from './DatasetTypeSelect'
import styles from './NewDataset.module.css'

export type NewDatasetProps = {
  file?: File
  dataset?: Dataset
  onFileUpdate: (file: File) => void
  onConfirm: (datasetMetadata: DatasetMetadata, file?: File) => void
}

export type DatasetMetadata = {
  public: boolean
  name: Dataset['name']
  description: Dataset['description']
  type: Dataset['type']
  schema?: Dataset['schema']
  category: Dataset['category']
  configuration?: Dataset['configuration']
  fieldsAllowed?: Dataset['fieldsAllowed']
}

// TODO Update https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b453d9d1b99c48c8711c31c2a64e9dffb6ce729d/types/shpjs/index.d.ts
// When this gets merged to upstream https://github.com/calvinmetcalf/shapefile-js/pull/181
interface FeatureCollectionWithMetadata extends FeatureCollectionWithFilename {
  extensions?: string[]
}

function NewDataset(): React.ReactElement {
  const { t } = useTranslation()
  const { datasetModalOpen, dispatchDatasetModalOpen } = useDatasetModalOpenConnect()
  const { datasetModalType, datasetModalStyle, datasetModalId, dispatchDatasetModalConfig } =
    useDatasetModalConfigConnect()
  const dataset = useSelector(selectDatasetById(datasetModalId as string))
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()
  const [rawFile, setRawFile] = useState<File | undefined>()
  const [error, setError] = useState('')
  const locationType = useSelector(selectLocationType)
  const { dispatchUpsertDataset } = useDatasetsAPI()

  const isDatasetEdit = dataset !== undefined

  const onFileLoaded = useCallback((file: File) => {
    console.log('setting file', file)
    setRawFile(file)

    // const type = datasetModalType
    // setLoading(true)
    // setError('')
    // const name =
    //   file.name.lastIndexOf('.') > 0 ? file.name.substr(0, file.name.lastIndexOf('.')) : file.name

    // const metadataName = capitalize(lowerCase(name))
    // let formatGeojson = false

    // if (type === 'tracks') {
    // } else if (!type || type === 'polygons' || type === 'points') {
    //   const isZip =
    //     file.type === 'application/zip' ||
    //     file.type === 'application/x-zip-compressed' ||
    //     file.type === 'application/octet-stream' ||
    //     file.type === 'multipart/x-zip'
    //   const isGeojson =
    //     !isZip && (file.type === 'application/json' || file.name.includes('.geojson'))
    //   const isCSV = !isZip && !isGeojson && file.type === 'text/csv'

    //   if (isGeojson) {
    //     formatGeojson = true
    //     const blob = file.slice(0, file.size, 'application/json')
    //     const fileAsJson = new File([blob], `${name}.json`, { type: 'application/json' })
    //     setFile(fileAsJson)
    //   } else {
    //     setFile(file)
    //   }

    //   let geojson: Feature | FeatureCollectionWithMetadata | undefined = undefined
    //   if (isZip) {
    //     try {
    //       const shpjs = await import('shpjs').then((module) => module.default)
    //       const fileData = await readBlobAs(file, 'arrayBuffer')
    //       // TODO support multiple files in shapefile
    //       const expandedShp = (await shpjs(fileData)) as FeatureCollectionWithMetadata
    //       if (Array.isArray(expandedShp)) {
    //         // geojson = expandedShp[0]
    //         setFileData(undefined)
    //         setLoading(false)
    //         setError(
    //           t(
    //             'errors.datasetShapefileMultiple',
    //             'Shapefiles containing multiple components (multiple file names) are not supported yet'
    //           )
    //         )
    //         return
    //       } else {
    //         if (
    //           expandedShp.extensions &&
    //           (!expandedShp.extensions.includes('.shp') ||
    //             !expandedShp.extensions.includes('.shx') ||
    //             !expandedShp.extensions.includes('.prj') ||
    //             !expandedShp.extensions.includes('.dbf'))
    //         ) {
    //           setFileData(undefined)
    //           setError(
    //             t(
    //               'errors.uploadShapefileComponents',
    //               'Error reading shapefile: must contain files with *.shp, *.shx, *.dbf and *.prj extensions.'
    //             )
    //           )
    //         } else {
    //           geojson = expandedShp
    //         }
    //       }
    //     } catch (e: any) {
    //       setFileData(undefined)
    //       setError(
    //         t('errors.uploadShapefile', 'Error reading shapefile: {{error}}', { error: e })
    //       )
    //     }
    //   } else if (isCSV) {
    //     const fileData = await readBlobAs(file, 'text')
    //     const { data, meta } = parseCSV<any>(fileData, {
    //       header: true,
    //       dynamicTyping: true,
    //       skipEmptyLines: true,
    //     })
    //     const latField = guessColumn('latitude', meta.fields)
    //     const lngField = guessColumn('longitude', meta.fields)
    //     if (latField !== undefined && lngField !== undefined) {
    //       formatGeojson = true
    //       try {
    //         geojson = featureCollection(
    //           data.flatMap((d) => {
    //             const { [latField]: lat, [lngField]: lng, ...rest } = d
    //             return lat && lng ? point([lng, lat], rest) : []
    //           })
    //         )
    //       } catch (e) {
    //         setFileData(undefined)
    //         setError(t('errors.uploadCsv', 'Error reading CSV: {{error}}', { error: e }))
    //       }
    //     } else {
    //       setFileData(undefined)
    //       setError(t('errors.missingLatLng', 'No latitude or longitude fields found'))
    //     }
    //     // geojson = JSON.parse(fileData)
    //   } else {
    //     const fileData = await readBlobAs(file, 'text')
    //     try {
    //       geojson = JSON.parse(fileData)
    //     } catch (e: any) {
    //       setFileData(undefined)
    //       setError(t('errors.uploadGeojson', 'Error reading GeoJSON: {{error}}', { error: e }))
    //     }
    //   }

    //   if (geojson !== undefined) {
    //     setFileData(geojson)
    //     const fields = extractPropertiesFromGeojson(geojson as FeatureCollectionWithMetadata)
    //     const configuration = {
    //       fields,
    //       geometryType: datasetGeometryType,
    //       // TODO when supporting multiple files upload
    //       // ...(geojson?.fileName && { file: geojson.fileName }),
    //       ...(formatGeojson && { format: 'geojson' }),
    //     } as DatasetConfiguration

    //     // Set disableInteraction flag when not all features are polygons
    //     if (datasetCategory === 'context' && datasetGeometryType === 'polygons') {
    //       if (
    //         (geojson.type === 'Feature' && geojson.geometry?.type === 'Polygon') ||
    //         ((geojson as FeatureCollectionWithMetadata).features !== undefined &&
    //           !(geojson as FeatureCollectionWithMetadata).features?.every((feature) =>
    //             ['Polygon', 'MultiPolygon'].includes(feature.geometry?.type)
    //           ))
    //       ) {
    //         configuration.disableInteraction = true
    //       }
    //     }
    //     setMetadata((metadata) => ({
    //       ...metadata,
    //       public: true,
    //       name: metadataName,
    //       type: DatasetTypes.UserContext,
    //       category: datasetCategory,
    //       configuration,
    //     }))
    //   } else if (error === '') {
    //     setFileData(undefined)
    //     setError(t('errors.datasetNotValid', 'It seems to be something wrong with your file'))
    //   }
    // }
    // setLoading(false)
  }, [])

  // const onDatasetFieldChange = (field: DatasetMetadata | AnyDatasetConfiguration) => {
  //   // TODO insert fields validation here
  //   setMetadata((meta) => {
  //     let error = ''
  //     const isRootMetaField =
  //       Object.prototype.hasOwnProperty.call(field, 'name') ||
  //       Object.prototype.hasOwnProperty.call(field, 'description') ||
  //       Object.prototype.hasOwnProperty.call(field, 'public')
  //     const newMetadata = isRootMetaField
  //       ? { ...meta, ...(field as DatasetMetadata) }
  //       : {
  //           ...(meta as DatasetMetadata),
  //           configuration: {
  //             ...meta?.configuration,
  //             ...(field as AnyDatasetConfiguration),
  //           },
  //         }
  //     const { min, max } =
  //       (newMetadata.configuration as EnviromentalDatasetConfiguration)?.propertyToIncludeRange ||
  //       {}
  //     if (min && max && min >= max) {
  //       error = t('errors.invalidRange', 'Min has to be lower than max value')
  //     }
  //     if (datasetModalType === 'tracks') {
  //       if (
  //         fileData &&
  //         newMetadata.configuration?.latitude &&
  //         newMetadata.configuration?.longitude &&
  //         newMetadata.configuration?.timestamp
  //       ) {
  //         const errors = checkRecordValidity({
  //           record: (fileData as CSV)[0],
  //           ...newMetadata.configuration,
  //         } as any)
  //         if (errors.length) {
  //           const fields = errors.map((error) => t(`common.${error}` as any, error)).join(',')
  //           error = t('errors.fields', { fields, defaultValue: `Error with fields: ${fields}` })
  //         }
  //       }
  //     }
  //     setError(error)
  //     return newMetadata
  //   })
  // }

  const onClose = useCallback(() => {
    setError('')
    dispatchDatasetModalOpen(false)
    dispatchDatasetModalConfig({ id: undefined, type: undefined })
  }, [dispatchDatasetModalConfig, dispatchDatasetModalOpen])

  const onConfirmClick = useCallback(
    async (datasetMetadata: DatasetMetadata, datasetFile?: File) => {
      if (datasetMetadata) {
        const { payload, error: createDatasetError } = await dispatchUpsertDataset({
          dataset: {
            ...datasetMetadata,
            unit: 'TBD',
            subcategory: 'info',
          },
          file: datasetFile,
          createAsPublic: datasetMetadata?.public ?? true,
        })

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
      trackEvent({
        category: TrackCategory.User,
        action: `Confirm ${datasetMetadata.configuration?.geometryType} upload`,
        label: datasetMetadata?.name,
      })
    },
    [addDataviewFromDatasetToWorkspace, dispatchUpsertDataset, locationType, onClose, t]
  )

  const getDatasetComponentByType = useCallback(
    (type: DatasetGeometryType) => {
      const DatasetComponent = {
        polygons: NewPolygonDataset,
        points: NewPointsDataset,
        tracks: NewTrackDataset,
      }[type as Exclude<DatasetGeometryType, 'draw'>]
      return (
        <DatasetComponent
          file={rawFile}
          dataset={dataset}
          onConfirm={onConfirmClick}
          onFileUpdate={onFileLoaded}
        />
      )
    },
    [dataset, onConfirmClick, onFileLoaded, rawFile]
  )

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={
        isDatasetEdit
          ? t('dataset.edit', 'Edit dataset')
          : t('dataset.uploadNew', 'Upload new dataset')
      }
      isOpen={datasetModalOpen}
      contentClassName={styles.modalContainer}
      onClose={onClose}
    >
      <div className={styles.modalContent}>
        {datasetModalType && (rawFile || dataset) ? (
          getDatasetComponentByType(datasetModalType)
        ) : (
          <DatasetTypeSelect onFileLoaded={onFileLoaded} />
        )}
      </div>
    </Modal>
  )
}

export default NewDataset
