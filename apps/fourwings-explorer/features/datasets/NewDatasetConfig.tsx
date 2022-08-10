import cx from 'classnames'
import { Fragment } from 'react'
import { InputText, Select } from '@globalfishingwatch/ui-components'
import {
  APIDataset,
  ContextAPIDataset,
  DatasetType,
  FourwingsAPIDataset,
} from 'features/datasets/datasets.types'
import { FileMetadata } from 'features/datasets/NewDatasetModal'
import styles from './NewDatasetModal.module.css'

export const extractPropertiesFromGeojson = (geojson: GeoJSON.FeatureCollection) => {
  if (!geojson?.features) return []
  const uniqueProperties = Object.keys(
    geojson.features.reduce(function (acc, { properties }) {
      return { ...acc, ...properties }
    }, {})
  )
  return uniqueProperties
}

export const getPropertyFieldsOptions = (fields: string[]) => {
  if (!fields) return []
  return fields.map((property) => ({
    id: property,
    label: property,
  }))
}

interface DatasetConfigProps {
  className?: string
  datasetType: DatasetType
  onDatasetFieldChange: (field: any) => void
  onDatasetConfigChange: (field: any) => void
  dataset: Partial<APIDataset>
  metadata: FileMetadata
}

const NewDatasetConfig: React.FC<DatasetConfigProps> = (props) => {
  const {
    dataset,
    metadata,
    className = '',
    datasetType,
    onDatasetFieldChange,
    onDatasetConfigChange,
  } = props
  const fieldsOptions = metadata ? getPropertyFieldsOptions(metadata?.fields) : []
  return (
    <div className={cx(styles.datasetConfig, className)}>
      <InputText
        inputSize="small"
        value={dataset.name}
        label="Name"
        className={styles.input}
        onChange={(e) => onDatasetFieldChange({ name: e.target.value })}
      />
      <InputText
        inputSize="small"
        label="Description"
        value={dataset.description}
        className={styles.input}
        onChange={(e) => onDatasetFieldChange({ description: e.target.value })}
      />
      {datasetType === 'context' ? (
        <Select
          label="Field to name each area"
          placeholder="Select an option"
          options={fieldsOptions}
          selectedOption={fieldsOptions.find(
            ({ id }) => id === (dataset as ContextAPIDataset).configuration?.polygonId
          )}
          className={styles.input}
          onSelect={(selected) => {
            onDatasetConfigChange({ polygonId: selected.id })
          }}
          onRemove={() => {
            onDatasetConfigChange({ polygonId: undefined })
          }}
        />
      ) : (
        <Fragment>
          <div className={cx(styles.multipleSelectContainer, styles.input)}>
            <Select
              label="Latitude field"
              placeholder="Select an option"
              options={fieldsOptions}
              selectedOption={fieldsOptions.find(
                ({ id }) => id === (dataset as FourwingsAPIDataset).configuration?.fields?.lat
              )}
              onSelect={(selected) => {
                onDatasetFieldChange({ latitude: selected.id })
              }}
              onRemove={() => {
                onDatasetFieldChange({ latitude: undefined })
              }}
            />
            <Select
              label="Longitude field"
              placeholder="Select an option"
              options={fieldsOptions}
              selectedOption={fieldsOptions.find(
                ({ id }) => id === (dataset as FourwingsAPIDataset).configuration?.fields?.lon
              )}
              onSelect={(selected) => {
                onDatasetFieldChange({ longitude: selected.id })
              }}
              onRemove={() => {
                onDatasetFieldChange({ longitude: undefined })
              }}
            />
          </div>
          <Select
            label="Time field"
            placeholder="Select an option"
            className={styles.input}
            options={fieldsOptions}
            selectedOption={fieldsOptions.find(
              ({ id }) => id === (dataset as FourwingsAPIDataset).configuration?.fields?.timestamp
            )}
            onSelect={(selected) => {
              onDatasetFieldChange({ timestamp: selected.id })
            }}
            onRemove={() => {
              onDatasetFieldChange({ timestamp: undefined })
            }}
          />
        </Fragment>
      )}
    </div>
  )
}
export default NewDatasetConfig
