import { useTranslation } from 'react-i18next'

import type { DatasetSchemaType } from '@globalfishingwatch/api-types'
import type { DatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import type { SelectOnChange, SelectOption } from '@globalfishingwatch/ui-components'
import { InputText, Select } from '@globalfishingwatch/ui-components'

import { useDatasetMetadataOptions } from 'features/datasets/upload/datasets-upload.hooks'
import type { DatasetMetadata } from 'features/datasets/upload/NewDataset'

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

const STRICT_PROPERTY_SELECTION_TYPES: Partial<
  Record<DatasetConfigurationProperty, DatasetSchemaType[]>
> = {
  polygonColor: ['range'],
  pointSize: ['range'],
}

function NewDatasetField({
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
  const schemaTypes = STRICT_PROPERTY_SELECTION_TYPES[property]
  const { fieldsOptions, filtersFieldsOptions, getSelectedOption } = useDatasetMetadataOptions(
    datasetMetadata,
    schemaTypes
  )
  const notEditableOptions = [
    'latitude',
    'longitude',
    'startTime',
    'endTime',
    'segmentId',
    'valueProperties',
    'lineId',
  ]
  const isNotEditableField = notEditableOptions.some((option) => option === property)
  const options = isNotEditableField ? fieldsOptions : filtersFieldsOptions
  const configurationProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property,
  })
  const configurationPropertyString = Array.isArray(configurationProperty)
    ? (configurationProperty[0] as string)
    : (configurationProperty as string)

  if (editable) {
    return (
      <Select
        label={label}
        placeholder={
          placeholder || t('dataset.fieldPlaceholder', 'Select a field from your dataset')
        }
        options={options}
        disabled={!options.length}
        selectedOption={getSelectedOption(configurationPropertyString, options) as SelectOption}
        onSelect={onSelect}
        onCleanClick={onCleanClick}
        className={styles.input}
        infoTooltip={infoTooltip}
      />
    )
  }
  return (
    <InputText
      value={configurationPropertyString}
      label={label}
      className={styles.input}
      disabled
    />
  )
}

export default NewDatasetField
