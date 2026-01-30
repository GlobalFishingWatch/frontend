import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { MultiSelectOption } from '@globalfishingwatch/api-client'
import type {
  DatasetFilters,
  DatasetFilterType,
  FrontendConfiguration,
} from '@globalfishingwatch/api-types'
import {
  MAX_FILTERS_ENUM_VALUES,
  MAX_FILTERS_ENUM_VALUES_EXCEEDED,
} from '@globalfishingwatch/data-transforms'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
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

  const setDatasetMetadataConfig = useCallback((newConfig: Partial<DatasetMetadata>) => {
    // TODO:DR this is BROKEN, fix it!
    setDatasetMetadataState((meta: any = {} as any) => {
      const metaConfig = getDatasetConfiguration(meta, 'userContextLayerV1')
      const idProperty = metaConfig?.idProperty
      const valueProperties = meta.configuration?.frontend?.valueProperties
      const valuePropertyId = metaConfig.valuePropertyId
      return {
        ...meta,
        configuration: {
          ...meta?.configuration,
          userContextLayerV1: {
            idProperty,
            valueProperties,
            valuePropertyId,
          },
          frontend: {
            ...meta?.configuration?.frontend,
            ...(newConfig as FrontendConfiguration),
          },
        },
      }
    })
  }, [])

  const setDatasetMetadataSchema = useCallback((newSchemaEntry: Record<string, DatasetFilters>) => {
    setDatasetMetadataState((meta = {} as DatasetMetadata) => {
      // TODO:DR this is BROKEN, fix it!
      return {
        ...meta,
        schema: {
          ...meta?.filters,
          ...newSchemaEntry,
        },
      }
    })
  }, [])

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

const DISCARDED_FIELDS = ['gfw_id']
export function useDatasetMetadataOptions(
  datasetMetadata?: DatasetMetadata,
  filterTypes = [] as DatasetFilterType[]
) {
  const { t } = useTranslation()
  const filters = datasetMetadata?.filters
  const fieldsOptions: SelectOption[] | MultiSelectOption[] = useMemo(() => {
    if (!filters) return []

    const options = Object.entries(filters).flatMap(([field, fieldFilter]) => {
      return []
      // TODO:DR this is BROKEN, fix it!
      // if (filterTypes.length > 0 && !filterTypes.includes(fieldFilter.type) {
      //   return []
      // }
      // return {
      //   id: field,
      //   label: <DatasetFieldLabel field={field} fieldFilter={fieldFilter} />,
      // }
    })

    return options.sort(sortFields)
  }, [filterTypes, filters])

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

  const filtersFieldsOptions: ((SelectOption | MultiSelectOption) & {
    type?: DatasetFilterType
  })[] = useMemo(() => {
    return []
    // TODO:DR this is BROKEN, fix it!
    // const options = datasetMetadata?.schema
    //   ? Object.entries(datasetMetadata.schema).flatMap(([field, schema]) => {
    //       if (
    //         (schemaTypes.length > 0 && !schemaTypes.includes(schema?.type as DatasetSchemaType)) ||
    //         DISCARDED_FIELDS.includes(field)
    //       ) {
    //         return []
    //       }
    //       const isEnumAllowed =
    //         schema?.type === 'boolean' ||
    //         (schema?.type === 'string' && schema?.enum && schema?.enum?.length > 0)
    //       const isRangeAllowed = schema?.type === 'range' && schema.enum?.length === 2
    //       const isMaxValuesExceeded = schema.enum?.[0] === MAX_FILTERS_ENUM_VALUES_EXCEEDED
    //       return isEnumAllowed || isRangeAllowed
    //         ? {
    //             id: field,
    //             label: (
    //               <DatasetFieldLabel
    //                 field={
    //                   field +
    //                   (isMaxValuesExceeded
    //                     ? ` - ${t((t) => t.datasetUpload.maxValuesExceededForFiltering, {
    //                         max: MAX_FILTERS_ENUM_VALUES,
    //                       })}`
    //                     : '')
    //                 }
    //                 fieldSchema={schema}
    //               />
    //             ),
    //             type: schema?.type,
    //             disableSelection: isMaxValuesExceeded,
    //             tooltip: isMaxValuesExceeded
    //               ? t((t) => t.datasetUpload.maxValuesExceededForFilteringTooltip, {
    //                   max: MAX_FILTERS_ENUM_VALUES,
    //                 })
    //               : undefined,
    //           }
    //         : []
    //     })
    //   : []
    // return options
    //   .filter((o) => {
    //     return (
    //       o.id !==
    //         getDatasetConfigurationProperty({ dataset: datasetMetadata, property: 'latitude' }) &&
    //       o.id !==
    //         getDatasetConfigurationProperty({
    //           dataset: datasetMetadata,
    //           property: 'longitude',
    //         }) &&
    //       o.id !==
    //         getDatasetConfigurationProperty({ dataset: datasetMetadata, property: 'timestamp' })
    //     )
    //   })
    //   .sort(sortFields)
  }, [])

  return useMemo(
    () => ({ fieldsOptions, getSelectedOption, filtersFieldsOptions }),
    [fieldsOptions, filtersFieldsOptions, getSelectedOption]
  )
}
