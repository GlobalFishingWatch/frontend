import { useState, useCallback, Fragment } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Modal, Button } from '@globalfishingwatch/ui-components'
import type { ColorRampId } from '@globalfishingwatch/layer-composer'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useModal } from 'features/modals/modals.hooks'
import { useCreateDataset } from 'features/datasets/new-datasets.hooks'
import type {
  FileField} from 'features/datasets/files.hooks';
import {
  FETCH_FIELDS_QUERY,
  useFetchFileFields,
  useUploadFile,
} from 'features/datasets/files.hooks'
import type { FourwingsAPIDatasetUpdate } from 'features/datasets/datasets.types'
import NewDatasetConfig from 'features/datasets/NewDatasetConfig'
import { useLayersConfig } from 'features/layers/layers.hooks'
import LocalDatasetsLibrary from 'features/datasets/DatasetsLibraryLocal'
import { useAPIDatasets } from 'features/datasets/datasets.hooks'
import { getNextColor } from 'features/layers/layers.utils'
import styles from './NewDatasetModal.module.css'
import FileDropzone from './FileDropzone'

export type FileFields = FileField[]

const DATASET_TYPE = '4wings'
export type CSV = Record<string, any>[]

function NewFourwingsDatasetModal(): React.ReactElement {
  const queryClient = useQueryClient()
  const [newFourwingsDataset, setNewFourwingsDataset] = useModal('newFourwingsDataset')
  const apiLocalDatasets = useAPIDatasets({ source: 'LOCAL', type: DATASET_TYPE })
  const { addLayer } = useLayersConfig()
  const [newDataset, setNewDataset] = useState<FourwingsAPIDatasetUpdate>(
    {} as FourwingsAPIDatasetUpdate
  )
  const [file, setFile] = useState<File>()
  const uploadFile = useUploadFile()
  const fetchFileFields = useFetchFileFields(newDataset?.configuration?.fileId)
  const createDataset = useCreateDataset()

  const onClose = useCallback(() => {
    setFile(undefined)
    setNewFourwingsDataset(false)
    setNewDataset(undefined)
    uploadFile.reset()
    createDataset.reset()
    queryClient.invalidateQueries([FETCH_FIELDS_QUERY])
  }, [createDataset, queryClient, setNewFourwingsDataset, uploadFile])

  const onDatasetAttributeChange = useCallback((datasetField: FourwingsAPIDatasetUpdate) => {
    setNewDataset((dataset) => ({ ...dataset, ...datasetField }))
  }, [])

  const onDatasetPropertyChange = useCallback(
    (datasetConfiguration: FourwingsAPIDatasetUpdate['configuration']) => {
      setNewDataset(
        (dataset) =>
          ({
            ...dataset,
            configuration: { ...dataset.configuration, ...datasetConfiguration },
          } as any)
      )
    },
    []
  )

  const onDatasetFieldChange = useCallback(
    (datasetField: FourwingsAPIDatasetUpdate['configuration']['fields']) => {
      setNewDataset((dataset) => ({
        ...dataset,
        configuration: {
          ...dataset.configuration,
          fields: {
            ...dataset.configuration.fields,
            ...datasetField,
          },
        },
      }))
    },
    []
  )

  const onNextClick = useCallback(() => {
    uploadFile.mutate(
      { file: file, type: DATASET_TYPE },
      {
        onSuccess: ({ filename }) => {
          setNewDataset({
            source: 'LOCAL',
            type: DATASET_TYPE,
            configuration: { fileId: filename },
          })
        },
      }
    )
  }, [file, uploadFile])

  const onConfirmClick = useCallback(() => {
    createDataset.mutate(newDataset, {
      onSuccess: (dataset) => {
        const color = getNextColor('fill', [])
        addLayer({
          id: dataset.id,
          config: {
            visible: true,
            color: color.value,
            colorRamp: color.id as ColorRampId,
          },
        })
        onClose()
      },
    })
  }, [addLayer, createDataset, newDataset, onClose])

  const fileUploadReady = uploadFile.isSuccess && fetchFileFields.isSuccess
  const isUploadLoading =
    uploadFile.isLoading || (fetchFileFields.isFetching && fetchFileFields.isLoading)

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title="Add dataset from local file"
      isOpen={newFourwingsDataset}
      className={styles.modal}
      contentClassName={styles.modalContainer}
      onClose={onClose}
    >
      <div className={styles.modalContent}>
        {fileUploadReady && fetchFileFields.data ? (
          <NewDatasetConfig
            datasetType={DATASET_TYPE}
            dataset={newDataset}
            fields={fetchFileFields.data}
            onDatasetAttributeChange={onDatasetAttributeChange}
            onDatasetPropertyChange={onDatasetPropertyChange}
            onDatasetFieldChange={onDatasetFieldChange}
          />
        ) : (
          <Fragment>
            <LocalDatasetsLibrary datasets={apiLocalDatasets.data} />
            <FileDropzone onFileLoaded={setFile} fileTypes={['csv']} />
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

export default NewFourwingsDatasetModal
