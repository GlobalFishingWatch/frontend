import cx from 'classnames'
import { Fragment } from 'react'
import type { SelectOption } from '@globalfishingwatch/ui-components';
import { InputText, Select } from '@globalfishingwatch/ui-components'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import type {
  APIDatasetUpdate,
  BaseDataset,
  ContextAPIDataset,
  DatasetType,
  FourwingsAPIDataset,
  FourwingsApiDatasetResolution,
  FourwingsAPIDatasetUpdate,
} from 'features/datasets/datasets.types'
import type { FileFields } from 'features/datasets/NewFourwingsDatasetModal'
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

export const getPropertyFieldsOptions = (fields: FileFields) => {
  if (!fields) return []
  return fields.map((property) => ({
    id: property.name,
    label: property.name,
  }))
}

interface DatasetConfigProps {
  className?: string
  datasetType: DatasetType
  onDatasetAttributeChange: (attribute: { [key in keyof Partial<BaseDataset>]: any }) => void
  onDatasetPropertyChange?: (field: APIDatasetUpdate['configuration']) => void
  onDatasetFieldChange?: (
    field: Partial<FourwingsAPIDatasetUpdate['configuration']['fields']>
  ) => void
  dataset: APIDatasetUpdate
  fields: FileFields
}

const AGGREGATION_OPERATION_OPTIONS: SelectOption<AggregationOperation>[] = [
  { id: AggregationOperation.Avg, label: 'Average' },
  { id: AggregationOperation.Sum, label: 'Sum' },
]

const TIME_RESOLUTION_OPTIONS: SelectOption<FourwingsApiDatasetResolution>[] = [
  { id: 'hour', label: 'Hourly' },
  { id: 'day', label: 'Daily' },
]

const NewDatasetConfig: React.FC<DatasetConfigProps> = (props) => {
  const {
    dataset,
    fields,
    className = '',
    datasetType,
    onDatasetAttributeChange,
    onDatasetPropertyChange,
    onDatasetFieldChange,
  } = props
  const fieldsOptions = getPropertyFieldsOptions(fields)
  return (
    <div className={cx(styles.datasetConfig, className)}>
      <InputText
        inputSize="small"
        value={dataset?.name}
        label="Name"
        className={styles.input}
        onChange={(e) => onDatasetAttributeChange({ name: e.target.value })}
      />
      <InputText
        inputSize="small"
        label="Description"
        value={dataset?.description}
        className={styles.input}
        onChange={(e) => onDatasetAttributeChange({ description: e.target.value })}
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
            onDatasetPropertyChange({ polygonId: selected.id })
          }}
          onRemove={() => {
            onDatasetPropertyChange({ polygonId: undefined })
          }}
        />
      ) : (
        <Fragment>
          <div className={cx(styles.multipleSelectContainer, styles.input)}>
            <Select
              label="Value field"
              placeholder="Select an option"
              options={fieldsOptions}
              selectedOption={fieldsOptions.find(
                ({ id }) => id === (dataset as FourwingsAPIDataset)?.configuration?.fields?.value
              )}
              onSelect={(selected) => {
                onDatasetFieldChange({ value: selected.id })
              }}
              onRemove={() => {
                onDatasetFieldChange({ value: undefined })
              }}
            />
            <Select
              label="Latitude field"
              placeholder="Select an option"
              options={fieldsOptions}
              selectedOption={fieldsOptions.find(
                ({ id }) => id === (dataset as FourwingsAPIDataset)?.configuration?.fields?.lat
              )}
              onSelect={(selected) => {
                onDatasetFieldChange({ lat: selected.id })
              }}
              onRemove={() => {
                onDatasetFieldChange({ lat: undefined })
              }}
            />
            <Select
              label="Longitude field"
              placeholder="Select an option"
              options={fieldsOptions}
              selectedOption={fieldsOptions.find(
                ({ id }) => id === (dataset as FourwingsAPIDataset)?.configuration?.fields?.lon
              )}
              onSelect={(selected) => {
                onDatasetFieldChange({ lon: selected.id })
              }}
              onRemove={() => {
                onDatasetFieldChange({ lon: undefined })
              }}
            />
          </div>
          <Select
            label="Time field"
            placeholder="Select an option"
            className={styles.input}
            options={fieldsOptions}
            selectedOption={fieldsOptions.find(
              ({ id }) => id === (dataset as FourwingsAPIDataset)?.configuration?.fields?.timestamp
            )}
            onSelect={(selected) => {
              onDatasetFieldChange({ timestamp: selected.id })
            }}
            onRemove={() => {
              onDatasetFieldChange({ timestamp: undefined })
            }}
          />
          <Select
            label="Time resolution"
            placeholder="Select an option"
            className={styles.input}
            options={TIME_RESOLUTION_OPTIONS}
            selectedOption={TIME_RESOLUTION_OPTIONS.find(
              ({ id }) => id === (dataset as FourwingsAPIDataset)?.configuration?.fields?.resolution
            )}
            onSelect={(selected) => {
              onDatasetFieldChange({ resolution: selected.id })
            }}
            onRemove={() => {
              onDatasetFieldChange({ resolution: undefined })
            }}
          />
          <Select
            label="Aggregation operation"
            placeholder="Select an option"
            className={styles.input}
            options={AGGREGATION_OPERATION_OPTIONS}
            selectedOption={AGGREGATION_OPERATION_OPTIONS.find(
              ({ id }) =>
                id === (dataset as FourwingsAPIDataset)?.configuration?.aggregationOperation
            )}
            onSelect={(selected) => {
              onDatasetPropertyChange({ aggregationOperation: selected.id })
            }}
            onRemove={() => {
              onDatasetPropertyChange({ aggregationOperation: undefined })
            }}
          />
        </Fragment>
      )}
    </div>
  )
}
export default NewDatasetConfig
