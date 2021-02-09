import React, { useState, useCallback } from 'react'
import cx from 'classnames'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import lowerCase from 'lodash/lowerCase'
import { useSelector } from 'react-redux'
import type { FeatureCollectionWithFilename } from 'shpjs'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import Button from '@globalfishingwatch/ui-components/dist/button'
import Select from '@globalfishingwatch/ui-components/dist/select'
import { DatasetConfiguration, DatasetTypes } from '@globalfishingwatch/api-types'
import { ReactComponent as FilesIcon } from 'assets/icons/files-supported.svg'
import { capitalize } from 'utils/shared'
import { SUPPORT_EMAIL } from 'data/config'
import { selectLocationType } from 'routes/routes.selectors'
import { readBlobAs } from 'utils/files'
import { useDatasetsAPI, useDatasetModalConnect, useNewDatasetConnect } from './datasets.hook'
import styles from './NewDataset.module.css'

const extractPropertiesFromGeojson = (geojson: GeoJSON.FeatureCollection) => {
  if (!geojson?.features) return []
  const uniqueProperties = Object.keys(
    geojson.features.reduce(function (acc, { properties }) {
      return { ...acc, ...properties }
    }, {})
  )
  return uniqueProperties
}

const getPropertyRangeValuesFromGeojson = (
  geojson: GeoJSON.FeatureCollection,
  property: string
) => {
  if (!geojson?.features) return
  const propertyRange = geojson.features.reduce(
    function (acc, { properties }) {
      const value = properties?.[property]
      if (!value) return acc
      return {
        min: value < acc.min ? value : acc.min,
        max: value > acc.max ? value : acc.max,
      }
    },
    { min: 0, max: 0 }
  )
  return propertyRange
}

interface DatasetConfigProps {
  className?: string
  onDatasetFieldChange: (field: any) => void
  fileData: FeatureCollectionWithFilename
  metadata: DatasetMetadata
}

const DatasetConfig: React.FC<DatasetConfigProps> = (props) => {
  const { metadata, fileData, className = '', onDatasetFieldChange } = props
  const { t } = useTranslation()
  const geojsonProperties = extractPropertiesFromGeojson(fileData)
  const colorByOptions = geojsonProperties.map((property) => ({
    id: property,
    label: capitalize(property),
  }))
  return (
    <div className={cx(styles.datasetConfig, className)}>
      <InputText
        inputSize="small"
        value={metadata.name}
        label={t('common.name', 'Name')}
        className={styles.input}
        onChange={(e) => onDatasetFieldChange({ name: e.target.value })}
      />
      <InputText
        inputSize="small"
        label={t('common.description', 'Description')}
        className={styles.input}
        onChange={(e) => onDatasetFieldChange({ description: e.target.value })}
      />
      {/*
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
      /> */}
      <div className={styles.row}>
        <label className={styles.selectLabel}>
          {t('dataset.colorByValue', 'Color features by value')}
        </label>
        <Select
          className={styles.selectShort}
          containerClassName={styles.selectContainer}
          options={colorByOptions}
          selectedOption={colorByOptions.find(
            ({ id }) => id === metadata.configuration?.propertyToInclude
          )}
          onSelect={(selected) => {
            // TODO: pre-populate min and max values depending on selection
            onDatasetFieldChange({ propertyToInclude: selected.id })
            const propertyRange = getPropertyRangeValuesFromGeojson(fileData, selected.id)
            if (propertyRange) {
              onDatasetFieldChange({
                propertyToIncludeRange: {
                  min: propertyRange.min,
                  max: propertyRange.max,
                },
              })
            }
          }}
          onRemove={() => {
            onDatasetFieldChange({ propertyToInclude: undefined })
          }}
          direction="top"
        />
        <InputText
          inputSize="small"
          type="number"
          step="0.1"
          value={metadata.configuration?.propertyToIncludeRange?.min}
          placeholder={t('common.min', 'Min')}
          className={styles.shortInput}
          onChange={(e) =>
            onDatasetFieldChange({
              propertyToIncludeRange: {
                min: parseFloat(e.target.value),
                max: metadata.configuration?.propertyToIncludeRange?.max,
              },
            })
          }
        />
        <InputText
          inputSize="small"
          type="number"
          step="0.1"
          placeholder={t('common.max', 'Max')}
          value={metadata.configuration?.propertyToIncludeRange?.max}
          className={styles.shortInput}
          onChange={(e) =>
            onDatasetFieldChange({
              propertyToIncludeRange: {
                min: metadata.configuration?.propertyToIncludeRange?.min,
                max: parseFloat(e.target.value),
              },
            })
          }
        />
      </div>
    </div>
  )
}

interface DatasetFileProps {
  className?: string
  onFileLoaded: (fileInfo: File) => void
}

const DatasetFile: React.FC<DatasetFileProps> = ({ onFileLoaded, className = '' }) => {
  const { t } = useTranslation()
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
      <FilesIcon />
      <input {...getInputProps()} />
      {acceptedFiles.length ? (
        <p className={styles.fileText}>
          {t('dataset.file', 'File')}: {acceptedFiles[0].name}
        </p>
      ) : isDragActive ? (
        <p className={styles.fileText}>{t('dataset.dragActive', 'Drop the file here ...')}</p>
      ) : (
        <p className={styles.fileText}>
          {t('dataset.dragFilePlaceholder', {
            defaultValue:
              'Drag and drop a compressed shapefile or geojson here or click to select it',
            interpolation: { escapeValue: false, useRawValueToEscape: true },
          })}
        </p>
      )}
      {fileRejections.length > 0 && (
        <p className={cx(styles.fileText, styles.warning)}>
          {t('dataset.fileNotAllowed', '(Only .zip or geo.json files are allowed)')}
        </p>
      )}
    </div>
  )
}

export type DatasetMetadata = {
  name: string
  description?: string
  type: DatasetTypes.Context
  configuration?: DatasetConfiguration
}

function NewDataset(): React.ReactElement {
  const { t } = useTranslation()
  const { datasetModal, dispatchDatasetModal } = useDatasetModalConnect()
  const { addNewDatasetToWorkspace } = useNewDatasetConnect()

  const [file, setFile] = useState<File | undefined>()
  const [fileData, setFileData] = useState<FeatureCollectionWithFilename | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [metadata, setMetadata] = useState<DatasetMetadata | undefined>()
  const locationType = useSelector(selectLocationType)
  const { dispatchCreateDataset } = useDatasetsAPI()

  const onFileLoaded = useCallback(
    async (file: File) => {
      setLoading(true)
      setError('')
      setFile(file)
      const isZip = file.type === 'application/zip'
      const isGeojson = !isZip && file.type === 'application/json'
      let geojson: FeatureCollectionWithFilename | undefined = undefined
      if (isZip) {
        try {
          const shpjs = await import('shpjs').then((module) => module.default)
          const fileData = await readBlobAs(file, 'arrayBuffer')
          // TODO support multiple files in shapefile
          geojson = (await shpjs(fileData)) as FeatureCollectionWithFilename
        } catch (e) {
          console.warn('Error reading file:', e)
        }
      } else {
        const fileData = await readBlobAs(file, 'text')
        try {
          geojson = JSON.parse(fileData)
        } catch (e) {
          console.warn('Error reading file:', e)
        }
      }
      const name =
        file.name.lastIndexOf('.') > 0 ? file.name.substr(0, file.name.lastIndexOf('.')) : file.name
      if (geojson !== undefined) {
        setFileData(geojson)
        setMetadata((metadata) => ({
          ...metadata,
          name: capitalize(lowerCase(name)),
          type: DatasetTypes.Context,
          configuration: {
            // TODO when supporting multiple files upload
            // ...(geojson?.fileName && { file: geojson.fileName }),
            ...(isGeojson && { format: 'geojson' }),
          },
        }))
      } else {
        setFileData(undefined)
        setError(t('errors.datasetNotValid', 'It seems to be something wrong with your file'))
      }
      setLoading(false)
    },
    [t]
  )

  const onDatasetFieldChange = (field: DatasetMetadata | DatasetConfiguration) => {
    // TODO insert fields validation here
    setMetadata((meta) => {
      const newMetadata =
        field.hasOwnProperty('name') || field.hasOwnProperty('description')
          ? { ...meta, ...(field as DatasetMetadata) }
          : {
              ...(meta as DatasetMetadata),
              configuration: {
                ...meta?.configuration,
                ...(field as DatasetConfiguration),
              },
            }
      return newMetadata
    })
  }

  const onConfirmClick = async () => {
    if (file) {
      setLoading(true)
      const { payload, error } = await dispatchCreateDataset({ dataset: { ...metadata }, file })
      setLoading(false)
      if (error) {
        setError(
          `${t('errors.generic', 'Something went wrong, try again or contact:')} ${SUPPORT_EMAIL}`
        )
      } else if (payload) {
        if (locationType === 'HOME' || locationType === 'WORKSPACE') {
          addNewDatasetToWorkspace(payload)
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
  }

  return (
    <Modal
      title={t('dataset.uploadNewContex', 'Upload new context areas')}
      isOpen={datasetModal === 'new'}
      contentClassName={styles.modalContainer}
      onClose={onClose}
    >
      <div className={styles.modalContent}>
        <DatasetFile onFileLoaded={onFileLoaded} />
        {fileData && metadata && (
          <DatasetConfig
            fileData={fileData}
            metadata={metadata}
            onDatasetFieldChange={onDatasetFieldChange}
          />
        )}
      </div>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
          <span className={styles.hint}>
            <a href="https://globalfishingwatch.org/faqs/" target="_blank" rel="noreferrer">
              {t('dataset.hint', 'Find out more about the supported formats')}
            </a>
          </span>
        </div>
        <Button
          disabled={!file || !metadata?.name || !metadata?.description}
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
