import { useCallback, useMemo, useState } from 'react'

import type { MultiSelectOption } from '@globalfishingwatch/api-client'
import type {
  DatasetConfiguration,
  DatasetConfigurationUI,
  DatasetSchemaItem,
  DatasetSchemaType,
} from '@globalfishingwatch/api-types'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import type { SelectOption } from '@globalfishingwatch/ui-components'

import DatasetFieldLabel from 'features/datasets/upload/DatasetFieldLabel'
import type { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { sortFields } from 'utils/shared'

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
        const {
          idProperty = meta.configuration?.idProperty,
          valueProperties = meta.configuration?.valueProperties,
          propertyToInclude = meta.configuration?.propertyToInclude,
          ...configurationUI
        } = newConfig as DatasetConfiguration
        return {
          ...meta,
          configuration: {
            ...meta?.configuration,
            idProperty,
            valueProperties,
            propertyToInclude,
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

  const setDatasetMetadataSchema = useCallback(
    (newSchemaEntry: Record<string, DatasetSchemaItem>) => {
      setDatasetMetadataState((meta = {} as DatasetMetadata) => {
        return {
          ...meta,
          schema: {
            ...meta?.schema,
            ...newSchemaEntry,
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
      setDatasetMetadataSchema,
    }),
    [datasetMetadata, setDatasetMetadata, setDatasetMetadataConfig, setDatasetMetadataSchema]
  )
}

export function useDatasetMetadataOptions(
  datasetMetadata?: DatasetMetadata,
  schemaTypes = [] as DatasetSchemaType[]
) {
  const fieldsOptions: SelectOption[] | MultiSelectOption[] = useMemo(() => {
    if (!datasetMetadata?.schema) return []

    const options = Object.entries(datasetMetadata.schema).flatMap(([field, fieldSchema]) => {
      if (schemaTypes.length > 0 && !schemaTypes.includes(fieldSchema.type)) {
        return []
      }
      return {
        id: field,
        label: <DatasetFieldLabel field={field} fieldSchema={fieldSchema} />,
      }
    })
    return options.sort(sortFields)
  }, [datasetMetadata?.schema, schemaTypes])

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

  const filtersFieldsOptions: SelectOption[] | MultiSelectOption[] = useMemo(() => {
    const options = datasetMetadata?.schema
      ? Object.keys(datasetMetadata.schema).flatMap((field) => {
          const schema = datasetMetadata.schema?.[field]
          if (schemaTypes.length > 0 && !schemaTypes.includes(schema?.type as DatasetSchemaType)) {
            return []
          }
          const isEnumAllowed = schema?.type === 'string' || schema?.type === 'boolean'
          const isRangeAllowed = schema?.type === 'range' && schema.enum?.length === 2
          return isEnumAllowed || isRangeAllowed
            ? { id: field, label: <DatasetFieldLabel field={field} fieldSchema={schema} /> }
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
  }, [datasetMetadata, schemaTypes])

  return useMemo(
    () => ({ fieldsOptions, getSelectedOption, filtersFieldsOptions }),
    [fieldsOptions, filtersFieldsOptions, getSelectedOption]
  )
}
