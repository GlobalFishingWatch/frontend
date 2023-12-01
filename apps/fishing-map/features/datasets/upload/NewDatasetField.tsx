import { useTranslation } from 'react-i18next'
import {
  VesselConfigurationProperty,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import { InputText, Select, SelectOnChange, SelectOption } from '@globalfishingwatch/ui-components'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { useDatasetMetadataOptions } from 'features/datasets/upload/datasets-upload.hooks'
import styles from './NewDataset.module.css'

type NewDatasetFieldProps = {
  datasetMetadata: DatasetMetadata
  property: VesselConfigurationProperty
  editable: boolean
  label?: string
  onSelect: SelectOnChange
  onCleanClick?: (e: React.MouseEvent) => void
}

export function NewDatasetField({
  datasetMetadata,
  property,
  editable,
  label,
  onSelect,
  onCleanClick,
}: NewDatasetFieldProps) {
  const { t } = useTranslation()
  const { fieldsOptions, filtersFieldsOptions, getSelectedOption } =
    useDatasetMetadataOptions(datasetMetadata)
  const options =
    property === 'latitude' || property === 'longitude' || property === 'timestamp'
      ? fieldsOptions
      : filtersFieldsOptions

  if (editable) {
    return (
      <Select
        label={label}
        placeholder={t('dataset.fieldPlaceholder', 'Select a field from your dataset')}
        options={options}
        selectedOption={
          getSelectedOption(
            getDatasetConfigurationProperty({
              dataset: datasetMetadata,
              property,
            }),
            options
          ) as SelectOption
        }
        onSelect={onSelect}
        onCleanClick={onCleanClick}
      />
    )
  }
  return (
    <InputText
      value={getDatasetConfigurationProperty({
        dataset: datasetMetadata,
        property: 'timestamp',
      })}
      label={label}
      className={styles.input}
      disabled
    />
  )
}

export default NewDatasetField
