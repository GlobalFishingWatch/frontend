import { useState, useCallback, Fragment } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { FeatureCollection } from 'geojson'
import { Modal, Button } from '@globalfishingwatch/ui-components'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useModal } from 'features/modals/modals.hooks'
import { useCreateDataset } from 'features/datasets/new-datasets.hooks'
import type { FielType, FileField} from 'features/datasets/files.hooks';
import { useUploadFile } from 'features/datasets/files.hooks'
import type { ContextAPIDatasetUpdate } from 'features/datasets/datasets.types'
import NewDatasetConfig from 'features/datasets/NewDatasetConfig'
import { getFileFromGeojson, readBlobAs } from 'features/datasets/datasets.utils'
import { useLayersConfig } from 'features/layers/layers.hooks'
import LocalDatasetsLibrary from 'features/datasets/DatasetsLibraryLocal'
import { useAPIDatasets } from 'features/datasets/datasets.hooks'
import styles from './NewDatasetModal.module.css'
import FileDropzone from './FileDropzone'

export type FileFields = FileField[]
export const extractPropertiesFromGeojson = (geojson: GeoJSON.FeatureCollection): FileFields => {
  if (!geojson?.features) return []
  const uniquePropertiesKeys = geojson.features.reduce(function (acc, { properties }) {
    return { ...acc, ...properties }
  }, {})
  const uniqueProperties = Object.keys(uniquePropertiesKeys).map((p) => ({
    name: p,
    type: 'VARCHAR' as FielType,
  }))
  return uniqueProperties
}
const DATASET_TYPE = 'context'

function NewDatasetModal(): React.ReactElement {
  const [newContextDataset, setNewContextDataset] = useModal('newContextDataset')
  const apiLocalDatasets = useAPIDatasets({ source: 'LOCAL', type: DATASET_TYPE })
  const { addLayer } = useLayersConfig()
  const [newDataset, setNewDataset] = useState<ContextAPIDatasetUpdate>(
    {} as ContextAPIDatasetUpdate
  )
  const [file, setFile] = useState<File>()
  const [fileFields, setFileFields] = useState<FileFields>()
  const [fileData, setFileData] = useState<FeatureCollection>()
  const uploadFile = useUploadFile()
  const createDataset = useCreateDataset()

  const onClose = useCallback(() => {
    setNewContextDataset(false)
    setFile(undefined)
    setNewDataset(undefined)
    setFileFields(undefined)
    uploadFile.reset()
    createDataset.reset()
  }, [createDataset, setNewContextDataset, uploadFile])

  const onDatasetAttributeChange = useCallback((datasetField: ContextAPIDatasetUpdate) => {
    setNewDataset((dataset) => ({ ...dataset, ...datasetField }))
  }, [])

  const onDatasetPropertyChange = useCallback(
    (datasetConfiguration: ContextAPIDatasetUpdate['configuration']) => {
      setNewDataset(
        (dataset) =>
          ({
            ...dataset,
            configuration: { ...dataset.configuration, ...datasetConfiguration },
          }) as any
      )
    },
    []
  )

  const readGeojsonFile = useCallback(async (file: File) => {
    const fileData = await readBlobAs(file, 'text')
    const geojson = JSON.parse(fileData)
    if (geojson.type === 'FeatureCollection') {
      geojson.features = geojson.features.map((feature) => {
        feature.properties = { id: uuidv4(), ...feature.properties }
        return feature
      })
    }
    const fileUpdated = getFileFromGeojson(geojson)
    setFile(fileUpdated)
    setFileData(geojson)
  }, [])

  const onNextClick = useCallback(() => {
    uploadFile.mutate(
      { file: file, type: DATASET_TYPE },
      {
        onSuccess: ({ filename }) => {
          setFileFields(extractPropertiesFromGeojson(fileData))
          setNewDataset({
            source: 'LOCAL',
            type: DATASET_TYPE,
            configuration: { fileId: filename },
          })
        },
      }
    )
  }, [file, fileData, uploadFile])

  const onConfirmClick = useCallback(() => {
    createDataset.mutate(newDataset, {
      onSuccess: (dataset) => {
        addLayer({ id: dataset.id, config: { visible: true } })
        onClose()
      },
    })
  }, [addLayer, createDataset, newDataset, onClose])

  const fileUploadReady = uploadFile.isSuccess
  const isUploadLoading = uploadFile.isLoading

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={'Add a polygon layers'}
      isOpen={newContextDataset}
      className={styles.modal}
      contentClassName={styles.modalContainer}
      onClose={onClose}
    >
      <div className={styles.modalContent}>
        {fileUploadReady && fileFields ? (
          <NewDatasetConfig
            datasetType={DATASET_TYPE}
            dataset={newDataset}
            fields={fileFields}
            onDatasetAttributeChange={onDatasetAttributeChange}
            onDatasetPropertyChange={onDatasetPropertyChange}
          />
        ) : (
          <Fragment>
            <LocalDatasetsLibrary datasets={apiLocalDatasets.data} />
            {/* TODO: support shapefile one day */}
            <FileDropzone onFileLoaded={readGeojsonFile} fileTypes={['geojson']} />
          </Fragment>
        )}
      </div>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {uploadFile.error && (
            <span className={styles.errorMsg}>{uploadFile.error.toString()}</span>
          )}
        </div>
        {fileUploadReady ? (
          <Button
            className={styles.saveBtn}
            onClick={onConfirmClick}
            loading={createDataset.isLoading}
          >
            Confirm
          </Button>
        ) : (
          <Button
            disabled={!file}
            className={styles.saveBtn}
            onClick={onNextClick}
            loading={isUploadLoading}
          >
            Next
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default NewDatasetModal
