import React, { useState, useCallback } from 'react'
import cx from 'classnames'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import Button from '@globalfishingwatch/ui-components/dist/button'
// import Select from '@globalfishingwatch/ui-components/dist/select'
import { Dataset } from '@globalfishingwatch/api-types/dist'
import { ReactComponent as ZipIcon } from 'assets/zip.svg'
import { useDatasetsAPI, useNewDatasetModalConnect } from './datasets.hook'
import styles from './NewDataset.module.css'

interface DatasetConfigProps {
  className?: string
  onDatasetFieldChange: (field: any) => void
  metadata: {
    name: string
  }
}

const DatasetConfig: React.FC<DatasetConfigProps> = (props) => {
  const { metadata, className = '', onDatasetFieldChange } = props
  const { t } = useTranslation()
  return (
    <div className={cx(styles.datasetConfig, className)}>
      <InputText
        inputSize="small"
        value={metadata.name}
        label={t('common.name', 'Name')}
        className={styles.input}
        onChange={(e) => onDatasetFieldChange({ name: e.target.value })}
      />
      {/* <InputText
        inputSize="small"
        label={t('common.description', 'Description')}
        className={styles.input}
        onChange={(e) => console.log(e.target.value)}
      />
      <Select
        label={t('dataset.typeOfFeatures', 'Type of features')}
        options={[]}
        selectedOption={undefined}
        onSelect={(selected) => {
          console.log('selected', selected)
        }}
        onRemove={(removed) => {
          console.log('removed', removed)
        }}
        direction="top"
      />
      <Select
        label={t('dataset.featuresNameField', 'Features name field')}
        options={[]}
        selectedOption={undefined}
        onSelect={(selected) => {
          console.log('selected', selected)
        }}
        onRemove={(removed) => {
          console.log('removed', removed)
        }}
        direction="top"
      />
      <Select
        label={t('dataset.timeField', 'Time field')}
        options={[]}
        selectedOption={undefined}
        onSelect={(selected) => {
          console.log('selected', selected)
        }}
        onRemove={(removed) => {
          console.log('removed', removed)
        }}
        direction="top"
      />
      <div className={styles.row}>
        <label className={styles.selectLabel}>
          {t('dataset.colorByValue', 'Color features by value')}
        </label>
        <Select
          className={styles.selectShort}
          options={[]}
          selectedOption={undefined}
          onSelect={(selected) => {
            console.log('selected', selected)
          }}
          onRemove={(removed) => {
            console.log('removed', removed)
          }}
          direction="top"
        />
        <InputText
          inputSize="small"
          placeholder={t('common.min', 'Min')}
          className={styles.shortInput}
          onChange={(e) => console.log(e.target.value)}
        />
        <InputText
          inputSize="small"
          placeholder={t('common.max', 'Max')}
          className={styles.shortInput}
          onChange={(e) => console.log(e.target.value)}
        />
      </div> */}
    </div>
  )
}

interface DatasetFileProps {
  className?: string
  onFileLoaded: (fileInfo: File) => void
}

const DatasetFile: React.FC<DatasetFileProps> = ({ onFileLoaded, className = '' }) => {
  const onDropAccepted = useCallback(
    (files) => {
      onFileLoaded(files[0])
    },
    [onFileLoaded]
  )
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    accept: '.zip, .json',
    onDropAccepted,
  })
  return (
    <div className={cx(styles.dropFiles, className)} {...(getRootProps() as any)}>
      <ZipIcon />
      <input {...getInputProps()} />
      {acceptedFiles.length ? (
        <p className={styles.fileText}>File: {acceptedFiles[0].name}</p>
      ) : isDragActive ? (
        <p className={styles.fileText}>Drop the file here ...</p>
      ) : (
        <p className={styles.fileText}>
          Drop a compressed shapefile here
          <br />
          or click to select it.
        </p>
      )}
      {fileRejections.length > 0 && (
        <p className={cx(styles.fileText, styles.warning)}>(Only .zip files are allowed)</p>
      )}
    </div>
  )
}

export type DatasetTypes = 'points' | 'lines' | 'geometries'
export type NewDatasetType = Partial<Dataset> & { type?: DatasetTypes }

function NewDataset(): React.ReactElement {
  const { t } = useTranslation()
  const { newDatasetModal, dispatchNewDatasetModal } = useNewDatasetModalConnect()

  const [file, setFile] = useState<File | undefined>()
  const [loading, setLoading] = useState(false)
  const [metadata, setMetadata] = useState<{ name: string } | undefined>()
  // const { dispatchCreateDataset } = useDatasetsAPI()

  const onFileLoaded = (file: File) => {
    setFile(file)
    setMetadata({ name: file.name.split(',')[0] })
  }

  const onDatasetFieldChange = (field: any) => {
    setMetadata({ ...metadata, ...field })
  }

  const onConfirmClick = async () => {
    setLoading(true)
    // await dispatchCreateDataset({ ...newDataset, file })
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const onClose = async () => {
    setLoading(false)
    setMetadata(undefined)
    dispatchNewDatasetModal(false)
  }

  return (
    <Modal
      title={t('datasets.uploadNew', 'Upload new dataset')}
      isOpen={newDatasetModal}
      contentClassName={styles.modalContainer}
      onClose={onClose}
    >
      <div className={styles.modalContent}>
        <DatasetFile onFileLoaded={onFileLoaded} />
        {file && metadata && (
          <DatasetConfig metadata={metadata} onDatasetFieldChange={onDatasetFieldChange} />
        )}
      </div>
      <div className={styles.modalFooter}>
        <Button
          disabled={!file}
          className={styles.saveBtn}
          onClick={onConfirmClick}
          loading={loading}
        >
          {t('common.confirm', 'Confirm') as string}
        </Button>
      </div>
    </Modal>
  )
}

export default NewDataset
