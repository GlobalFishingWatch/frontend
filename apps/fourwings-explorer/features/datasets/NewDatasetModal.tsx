import { useState, useCallback, Fragment } from 'react'
import { FeatureCollection } from 'geojson'
import { Modal, Button } from '@globalfishingwatch/ui-components'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useModal } from 'features/modals/modals.hooks'
import { useCreateDataset, useUploadFile } from 'features/datasets/new-datasets.hooks'
import { APIDatasetUpdate, DatasetType } from 'features/datasets/datasets.types'
import NewDatasetConfig from 'features/datasets/NewDatasetConfig'
import { readBlobAs } from 'features/datasets/datasets.utils'
import { useLayersConfig } from 'features/layers/layers.hooks'
import LocalDatasetsLibrary from 'features/datasets/DatasetsLibraryLocal'
import { useAPIDatasets } from 'features/datasets/datasets.hooks'
import styles from './NewDatasetModal.module.css'
import FileDropzone, { FileType } from './FileDropzone'

export const extractPropertiesFromGeojson = (geojson: GeoJSON.FeatureCollection) => {
  if (!geojson?.features) return []
  const uniqueProperties = Object.keys(
    geojson.features.reduce(function (acc, { properties }) {
      return { ...acc, ...properties }
    }, {})
  )
  return uniqueProperties
}

export const FILES_TYPES_BY_GEOMETRY_TYPE: Record<DatasetType, FileType[]> = {
  '4wings': ['csv'],
  context: ['shapefile', 'geojson'],
}

export type CSV = Record<string, any>[]

export type FileMetadata = {
  fields: string[]
}

function NewDatasetModal(): React.ReactElement {
  const [newFourwingsDataset, setNewFourwingsDataset] = useModal('newFourwingsDataset')
  const [newContextDataset, setNewContextDataset] = useModal('newContextDataset')
  const datasetType: DatasetType = newFourwingsDataset ? '4wings' : 'context'
  const apiLocalDatasets = useAPIDatasets({ source: 'LOCAL', type: datasetType })
  const { addLayer } = useLayersConfig()
  const [datasetConfig, setNewDatasetConfig] = useState<APIDatasetUpdate>({} as APIDatasetUpdate)
  const [fileMetadata, setFileMetadata] = useState<FileMetadata>({} as FileMetadata)
  const [file, setFile] = useState<File>()
  const [fileData, setFileData] = useState<FeatureCollection>()

  const onClose = useCallback(() => {
    setNewFourwingsDataset(false)
    setNewContextDataset(false)
    setFile(undefined)
    setNewDatasetConfig(undefined)
    setFileMetadata(undefined)
  }, [setNewContextDataset, setNewFourwingsDataset])

  const uploadFile = useUploadFile()
  const createDataset = useCreateDataset()

  const onDatasetFieldChange = useCallback((datasetField: APIDatasetUpdate) => {
    setNewDatasetConfig((dataset) => ({ ...dataset, ...datasetField }))
  }, [])

  const onDatasetConfigChange = useCallback(
    (datasetConfiguration: APIDatasetUpdate['configuration']) => {
      setNewDatasetConfig(
        (dataset) =>
          ({
            ...dataset,
            configuration: { ...dataset.configuration, ...datasetConfiguration },
          } as any)
      )
    },
    []
  )

  const readGeojsonFile = useCallback(async (file: File) => {
    const fileData = await readBlobAs(file, 'text')
    const geojson = JSON.parse(fileData)
    setFileData(geojson)
  }, [])

  const onFileLoaded = useCallback(
    (file: File) => {
      setFile(file)
      if (datasetType === 'context') {
        readGeojsonFile(file)
      }
    },
    [datasetType, readGeojsonFile]
  )

  const onNextClick = useCallback(() => {
    uploadFile.mutate(
      { file: file, type: datasetType },
      {
        onSuccess: ({ filename }) => {
          if (datasetType === 'context') {
            setFileMetadata({
              fields: extractPropertiesFromGeojson(fileData),
            })
            setNewDatasetConfig({
              type: 'context',
              source: 'LOCAL',
              configuration: { fileId: filename } as any,
            })
          } else {
            console.log('TODO: fetch file metadata to api')
          }
        },
      }
    )
  }, [datasetType, file, fileData, uploadFile])

  const onConfirmClick = useCallback(() => {
    createDataset.mutate(datasetConfig, {
      onSuccess: (dataset) => {
        addLayer({ id: dataset.id, config: { visible: true } })
        onClose()
      },
    })
  }, [addLayer, createDataset, datasetConfig, onClose])

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={newContextDataset ? 'Add a polygon layers' : 'Add dataset from local file'}
      isOpen={newFourwingsDataset || newContextDataset}
      className={styles.modal}
      contentClassName={styles.modalContainer}
      onClose={onClose}
    >
      <div className={styles.modalContent}>
        {!datasetConfig?.configuration?.fileId || !fileMetadata ? (
          <Fragment>
            <LocalDatasetsLibrary datasets={apiLocalDatasets.data} />
            <FileDropzone
              onFileLoaded={onFileLoaded}
              fileTypes={FILES_TYPES_BY_GEOMETRY_TYPE[datasetType]}
            />
          </Fragment>
        ) : (
          <NewDatasetConfig
            datasetType={datasetType}
            dataset={datasetConfig}
            metadata={fileMetadata}
            onDatasetFieldChange={onDatasetFieldChange}
            onDatasetConfigChange={onDatasetConfigChange}
          />
        )}
      </div>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {uploadFile.error && (
            <span className={styles.errorMsg}>{uploadFile.error.toString()}</span>
          )}
        </div>
        {datasetConfig?.configuration?.fileId ? (
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
            loading={uploadFile.isLoading}
          >
            Next
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default NewDatasetModal
