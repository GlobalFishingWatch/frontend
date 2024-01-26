import { useTranslation } from 'react-i18next'
import {
  DatasetConfigurationProperty,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import { InputText, Select, SelectOnChange, SelectOption } from '@globalfishingwatch/ui-components'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { useDatasetMetadataOptions } from 'features/datasets/upload/datasets-upload.hooks'
import styles from './NewDataset.module.css'

type NewDatasetFieldProps = {
  datasetMetadata: DatasetMetadata
  property: DatasetConfigurationProperty
  editable?: boolean | undefined
  label?: string
  placeholder?: string
  onSelect: SelectOnChange
  onCleanClick?: (e: React.MouseEvent) => void
  infoTooltip?: string
}

export function NewDatasetField({
  datasetMetadata,
  property,
  editable = true,
  label,
  placeholder,
  onSelect,
  onCleanClick,
  infoTooltip,
}: NewDatasetFieldProps) {
  const { t } = useTranslation()
  const { fieldsOptions, filtersFieldsOptions, getSelectedOption } =
    useDatasetMetadataOptions(datasetMetadata)
  const notEditableOptions = [
    'latitude',
    'longitude',
    'startTime',
    'endTime',
    'segmentId',
    'lineId',
  ]
  const isNotEditableField = notEditableOptions.some((option) => option === property)
  const options = isNotEditableField ? fieldsOptions : filtersFieldsOptions

  if (editable) {
    return (
      <Select
        label={label}
        placeholder={
          placeholder || t('dataset.fieldPlaceholder', 'Select a field from your dataset')
        }
        options={options}
        selectedOption={
          getSelectedOption(
            getDatasetConfigurationProperty({
              dataset: datasetMetadata,
              property,
            }) as string,
            options
          ) as SelectOption
        }
        onSelect={onSelect}
        onCleanClick={onCleanClick}
        className={styles.input}
        infoTooltip={infoTooltip}
      />
    )
  }
  return (
    <InputText
      value={
        getDatasetConfigurationProperty({
          dataset: datasetMetadata,
          property,
        }) as string
      }
      label={label}
      className={styles.input}
      disabled
    />
  )
}

export default NewDatasetField
