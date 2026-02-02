import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { MultiSelectOption } from '@globalfishingwatch/api-client'
import type {
  DatasetConfiguration,
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

  const setDatasetMetadataConfig = useCallback((newConfig: DatasetConfiguration['frontend']) => {
    setDatasetMetadataState((meta = {} as DatasetMetadata) => {
      const contextConfig = getDatasetConfiguration(meta, 'userContextLayerV1')
      const frontendConfig = getDatasetConfiguration(meta)
      const idProperty = contextConfig?.idProperty
      const valuePropertyId = contextConfig.valuePropertyId
      const valueProperties = frontendConfig?.valueProperties
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
            ...frontendConfig,
            ...newConfig,
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
    const options =
      datasetMetadata?.filters?.userContext && datasetMetadata?.filters?.userContext?.length > 0
        ? datasetMetadata.filters.userContext.flatMap((filter) => {
            if (
              (filterTypes.length > 0 && !filterTypes.includes(filter.type as DatasetFilterType)) ||
              DISCARDED_FIELDS.includes(filter.id)
            ) {
              return []
            }
            const isEnumAllowed =
              filter?.type === 'boolean' ||
              (filter?.type === 'string' && filter?.enum && filter?.enum?.length > 0)
            const isRangeAllowed = filter?.type === 'range' && filter.enum?.length === 2
            const isMaxValuesExceeded = filter.enum?.[0] === MAX_FILTERS_ENUM_VALUES_EXCEEDED
            return isEnumAllowed || isRangeAllowed
              ? {
                  id: filter.id,
                  label: (
                    <DatasetFieldLabel
                      field={
                        filter.id +
                        (isMaxValuesExceeded
                          ? ` - ${t((t) => t.datasetUpload.maxValuesExceededForFiltering, {
                              max: MAX_FILTERS_ENUM_VALUES,
                            })}`
                          : '')
                      }
                      fieldFilter={filter}
                    />
                  ),
                  type: filter.type,
                  disableSelection: isMaxValuesExceeded,
                  tooltip: isMaxValuesExceeded
                    ? t((t) => t.datasetUpload.maxValuesExceededForFilteringTooltip, {
                        max: MAX_FILTERS_ENUM_VALUES,
                      })
                    : undefined,
                }
              : []
          })
        : []
    return options
      .filter((o) => {
        const { latitude, longitude, timestamp } = getDatasetConfiguration(
          datasetMetadata,
          'frontend'
        )
        return (
          o.id !== latitude?.toString() &&
          o.id !== longitude?.toString() &&
          o.id !== timestamp?.toString()
        )
      })
      .sort(sortFields)
  }, [datasetMetadata, filterTypes, t])

  return useMemo(
    () => ({ fieldsOptions, getSelectedOption, filtersFieldsOptions }),
    [fieldsOptions, filtersFieldsOptions, getSelectedOption]
  )
}
