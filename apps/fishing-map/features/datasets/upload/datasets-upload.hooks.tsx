import { useCallback, useMemo, useState } from 'react'
import {
  DatasetConfiguration,
  DatasetConfigurationUI,
  DatasetSchema,
  DatasetSchemaItem,
} from '@globalfishingwatch/api-types'
import { SelectOption } from '@globalfishingwatch/ui-components'
import { MultiSelectOption } from '@globalfishingwatch/api-client'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import { sortFields } from 'utils/shared'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'

export function useDatasetMetadata() {
  const [datasetMetadata, setDatasetMetadataState] = useState({} as DatasetMetadata)

  const setDatasetMetadata = useCallback((newFields: Partial<DatasetMetadata>) => {
    setDatasetMetadataState((meta = {} as DatasetMetadata) => ({
      ...meta,
      ...(newFields as DatasetMetadata),
    }))
  }, [])

  const setDatasetMetadataConfig = useCallback(
    (newConfig: Partial<DatasetConfiguration | DatasetConfigurationUI>) => {
      setDatasetMetadataState((meta = {} as DatasetMetadata) => {
        const { idProperty, valueProperties, propertyToInclude, ...configurationUI } =
          newConfig as DatasetConfiguration
        return {
          ...meta,
          configuration: {
            ...meta?.configuration,
            ...(idProperty && { idProperty }),
            ...(valueProperties && { valueProperties }),
            ...(propertyToInclude && { propertyToInclude }),
            configurationUI: {
              ...meta?.configuration?.configurationUI,
              ...(configurationUI as DatasetConfigurationUI),
            },
          },
        }
      })
    },
    []
  )

  return useMemo(
    () => ({
      datasetMetadata,
      setDatasetMetadata,
      setDatasetMetadataConfig,
    }),
    [datasetMetadata, setDatasetMetadata, setDatasetMetadataConfig]
  )
}

const OptionLabel = ({
  field,
  fieldSchema,
}: {
  field: string
  fieldSchema: DatasetSchema | DatasetSchemaItem
}) => {
  return (
    <span>
      <label style={{ display: 'inline', marginRight: 'var(--space-XS)' }}>
        {fieldSchema.type === 'range' ? '123' : 'ABC'}
      </label>
      {field}
    </span>
  )
}

export function useDatasetMetadataOptions(datasetMetadata?: DatasetMetadata) {
  const fieldsOptions: SelectOption[] | MultiSelectOption[] = useMemo(() => {
    const options = datasetMetadata?.schema
      ? Object.entries(datasetMetadata.schema).map(([field, fieldSchema]) => {
          return {
            id: field,
            label: <OptionLabel field={field} fieldSchema={fieldSchema} />,
          }
        })
      : []
    return options.sort(sortFields)
  }, [datasetMetadata])

  const getSelectedOption = useCallback(
    (
      option: string | string[],
      options?: SelectOption[] | MultiSelectOption[]
    ): SelectOption | MultiSelectOption[] | undefined => {
      const opts = options ?? fieldsOptions
      if (option) {
        if (Array.isArray(option)) {
          return opts.filter((o) => option.includes(o.id)) || ([] as SelectOption[])
        }
        return opts.find((o) => o.id === option)
      }
    },
    [fieldsOptions]
  )

  const schemaRangeOptions: SelectOption[] | MultiSelectOption[] = useMemo(() => {
    const options = datasetMetadata?.schema
      ? Object.entries(datasetMetadata.schema)
          .filter(([_, fieldSchema]) => fieldSchema.type === 'range')
          .map(([field, fieldSchema]) => {
            return { id: field, label: <OptionLabel field={field} fieldSchema={fieldSchema} /> }
          })
      : []
    return options.sort(sortFields)
  }, [datasetMetadata])

  const filtersFieldsOptions: SelectOption[] | MultiSelectOption[] = useMemo(() => {
    const options = datasetMetadata?.schema
      ? Object.keys(datasetMetadata.schema).flatMap((field) => {
          const schema = datasetMetadata.schema?.[field]
          const isEnumAllowed =
            (schema?.type === 'string' || schema?.type === 'boolean') && schema?.enum?.length
          const isRangeAllowed = schema?.type === 'range' && schema?.min && schema?.max
          return isEnumAllowed || isRangeAllowed
            ? { id: field, label: <OptionLabel field={field} fieldSchema={schema} /> }
            : []
        })
      : []
    return options
      .filter((o) => {
        return (
          o.id !==
            getDatasetConfigurationProperty({ dataset: datasetMetadata, property: 'latitude' }) &&
          o.id !==
            getDatasetConfigurationProperty({ dataset: datasetMetadata, property: 'longitude' }) &&
          o.id !==
            getDatasetConfigurationProperty({ dataset: datasetMetadata, property: 'timestamp' })
        )
      })
      .sort(sortFields)
  }, [datasetMetadata])

  return useMemo(
    () => ({ fieldsOptions, getSelectedOption, schemaRangeOptions, filtersFieldsOptions }),
    [fieldsOptions, filtersFieldsOptions, getSelectedOption, schemaRangeOptions]
  )
}
