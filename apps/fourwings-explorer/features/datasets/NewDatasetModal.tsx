import { useState, useCallback, Fragment } from 'react'
import { Modal, Button } from '@globalfishingwatch/ui-components'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useModal } from 'features/modals/modals.hooks'
import FileDropzone, { FileType } from './FileDropzone'
import styles from './NewDatasetModal.module.css'

export type NewDatasetType = 'fourwings' | 'context'
export const FILES_TYPES_BY_GEOMETRY_TYPE: Record<NewDatasetType, FileType[]> = {
  fourwings: ['csv'],
  context: ['shapefile', 'geojson'],
}

export type DatasetConfig = {
  name: string
  description?: string
  // category: DatasetCategory
  // type: DatasetTypes
  // configuration?: AnyDatasetConfiguration
  // fields?: string[]
  // guessedFields?: Record<string, string>
}

export type CSV = Record<string, any>[]

function NewDatasetModal(): React.ReactElement {
  const [newFourwingsDataset, setNewFourwingsDataset] = useModal('newFourwingsDataset')
  const [newContextDataset, setNewContextDataset] = useModal('newContextDataset')
  const datasetType: NewDatasetType = newFourwingsDataset ? 'fourwings' : 'context'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [datasetConfig, setNewDatasetConfig] = useState<DatasetConfig>()
  const [fileUploaded, setFileUploaded] = useState<boolean>(false)
  const [fileMetadata, setFileMetadata] = useState<any>()
  const [file, setFile] = useState<File>()

  const onClose = useCallback(() => {
    setNewFourwingsDataset(false)
    setNewContextDataset(false)
    setFile(undefined)
    setError('')
    setLoading(false)
    setNewDatasetConfig(undefined)
    setFileMetadata(undefined)
    setFileUploaded(false)
  }, [setNewContextDataset, setNewFourwingsDataset])

  const onFileLoaded = useCallback(async (file: File) => {
    setFile(file)
  }, [])

  const onNextClick = useCallback(() => {
    console.log('TODO: fetch dataset metadata')
  }, [])

  const onConfirmClick = useCallback(() => {
    console.log('TODO: create dataset')
  }, [])

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
        <Fragment>
          <FileDropzone
            onFileLoaded={onFileLoaded}
            fileTypes={FILES_TYPES_BY_GEOMETRY_TYPE[datasetType]}
          />
          {/* {fileData && fileMetadata && (
            <DatasetConfig
              fileData={fileData as FeatureCollectionWithMetadata}
              metadata={metadata}
              datasetCategory={datasetCategory}
              // eslint-disable-next-line
              datasetGeometryType={datasetGeometryType!}
              onDatasetFieldChange={onDatasetFieldChange}
            />
          )} */}
        </Fragment>
      </div>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
        </div>
        {fileUploaded && fileMetadata ? (
          <Button className={styles.saveBtn} onClick={onNextClick} loading={loading}>
            Confirm
          </Button>
        ) : (
          <Button disabled={!file} className={styles.saveBtn} onClick={onConfirmClick}>
            Next
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default NewDatasetModal
