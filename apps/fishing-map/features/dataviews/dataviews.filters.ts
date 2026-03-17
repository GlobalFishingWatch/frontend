import { uniq } from 'es-toolkit'
import intersection from 'lodash/intersection'

import type {
  Dataset,
  DatasetFilterOperation,
  DatasetFilterType,
  Dataview,
  FilterOperator,
  IdentityVessel,
} from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewCategory, INCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import {
  datasetHasFilter,
  datasetHasFilterAllowed,
  getDatasetFilterItem,
  getDatasetFiltersAllowed,
  getEnvironmentalDatasetRange,
  removeDatasetVersion,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { MultiSelectOption } from '@globalfishingwatch/ui-components'

import { getActiveDatasetsInDataview } from 'features/datasets/datasets.utils'
import i18n, { t } from 'features/i18n/i18n'
import { getFlags, getFlagsByIds } from 'utils/flags'
import { getVesselGearTypeLabel, getVesselShipTypeLabel } from 'utils/info'
import { getPorts, getPortsByIds } from 'utils/ports'
import { sortFields } from 'utils/shared'

import styles from '../vessel-groups/VesselGroupModal.module.css'

export const VESSEL_GROUPS_MODAL_ID = 'vesselGroupsOpenModalId'

const EXPERIMENTAL_FIELDS_BY_FILTER: { [key in SupportedDatasetFilter]?: string[] } = {
  encounter_type: ['FISHING-BUNKER', 'FISHING-FISHING', 'CARRIER-BUNKER'],
}

type FilterCompatibilityOperation = 'every' | 'some'
// TODO:DR review if FilterOriginParam is still needed
type FilterOriginParam = keyof Pick<IdentityVessel, 'selfReportedInfo' | 'registryInfo'> | 'all'
export type GetFiltersInDataviewParams = {
  fieldsToInclude?: SupportedDatasetFilter[]
  vesselGroups?: MultiSelectOption[]
  compatibilityOperation?: FilterCompatibilityOperation
  filterOrigin?: FilterOriginParam
  isGuestUser?: boolean
}

export type DataviewWithFilters =
  | UrlDataviewInstance
  | Pick<Dataview, 'category' | 'config' | 'datasets' | 'filtersConfig'>

export const isDataviewFilterSupported = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  const activeDatasets = dataview.config?.datasets
  const filtersSupported = dataview?.datasets
    ?.filter((dataset) => activeDatasets?.includes(dataset.id))
    .every((dataset) => {
      const filtersAllowed = getDatasetFiltersAllowed(dataset)
      const filterAllowed = filtersAllowed.includes(filter)
      const incompatibleSelection = getIncompatibleFilterSelection(dataview, filter)
      return filterAllowed && incompatibleSelection?.length === 0
    })
  return filtersSupported
}

export const getFilterLabel = (filter: SupportedDatasetFilter, datasetId: string) => {
  if (datasetId && i18n.exists(`datasets:${datasetId}.schema.${filter}.keyword`)) {
    const label = t((t) => t[datasetId]?.schema?.[filter]?.keyword, {
      ns: 'datasets',
      defaultValue: filter.toString(),
    })
    if (label !== filter) {
      return label
    }
  }
  if (i18n.exists(`vessel.${filter}`)) {
    const label = t((t: any) => t.vessel[filter], { defaultValue: filter.toString(), count: 2 })
    if (label !== filter) {
      return label
    }
  }
  return t((t: any) => t.layer[filter], { defaultValue: filter.toString() })
}

const getSupportedFilterDatasets = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  const datasetsWithFiltersSupport = dataview?.datasets?.flatMap((dataset) => {
    const hasFilter = datasetHasFilter(dataset, filter)
    const hasFiltersAllowed = datasetHasFilterAllowed(dataset, filter)
    return hasFilter && hasFiltersAllowed ? dataset : []
  })
  return datasetsWithFiltersSupport
}

export const getNotSupportedFilterDatasets = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  const datasetsWithoutFiltersSupport = dataview?.datasets?.flatMap((dataset) => {
    const hasFilter = datasetHasFilter(dataset, filter)
    const datasetSelected = dataview.config?.datasets?.includes(dataset.id)
    if (!datasetSelected || hasFilter) {
      return []
    }
    return dataset
  })
  return datasetsWithoutFiltersSupport
}

export const getIncompatibleFilterSelection = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  return dataview?.datasets?.flatMap((dataset) => {
    const incompatibilityDict = dataview.filtersConfig?.incompatibility?.[dataset.id]
    if (!incompatibilityDict?.length) {
      return []
    }
    return incompatibilityDict.filter(({ id, value, valueNot, disabled }) => {
      const selectedFilterValue = dataview.config?.filters?.[id]
      if (value === 'undefined' && selectedFilterValue === undefined && valueNot === undefined) {
        return disabled.includes(filter)
      }

      const selectedFilterValues = Array.isArray(selectedFilterValue)
        ? selectedFilterValue
        : [selectedFilterValue]

      if (value !== undefined) {
        const matchedValue =
          selectedFilterValue?.length === 1 &&
          (selectedFilterValue?.includes(value) || selectedFilterValue?.includes(value.toString()))
        return matchedValue && disabled.includes(filter)
      }
      if (valueNot !== undefined) {
        const matchedValue = selectedFilterValue
          ? selectedFilterValues.some((f) => f !== value && f !== valueNot.toString())
          : true
        return matchedValue && disabled.includes(filter)
      }
      return false
    })
  })
}

const getCommonFilterTypeInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  const activeDatasets = getActiveDatasetsInDataview(dataview as UrlDataviewInstance)
  const datasetFilters = activeDatasets
    ?.map((d) => getDatasetFilterItem(d, filter)?.type)
    .filter(Boolean)
  return datasetFilters?.[0]
}

type DataviewFilterSelection = {
  id: string
  label: any
}

export const getCommonFiltersInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter,
  {
    vesselGroups = [],
    isGuestUser = true,
    compatibilityOperation = 'every',
  } = {} as GetFiltersInDataviewParams
): DataviewFilterSelection[] => {
  const activeDatasets = getActiveDatasetsInDataview(dataview as UrlDataviewInstance)
  if (filter === 'flag') {
    return getFlags()
  } else if (filter === 'next_port_id') {
    return getPorts()
  } else if (filter === 'vessel-groups') {
    if (activeDatasets?.every((d) => getDatasetFiltersAllowed(d)?.includes(filter))) {
      if (isGuestUser) {
        return vesselGroups
      }
      const addNewGroup = {
        id: VESSEL_GROUPS_MODAL_ID,
        label: t((t) => t.vesselGroup.createNewGroup),
        disableSelection: true,
        className: styles.openModalLink,
      } as MultiSelectOption
      return [addNewGroup, ...vesselGroups]
    }
    return []
  }
  const filterType = getCommonFilterTypeInDataview(dataview, filter)
  let filterFields = (activeDatasets || [])?.map((d) => {
    const filterConfig = getDatasetFilterItem(d, filter)
    const filterEnum = filterConfig?.enum || []
    return Array.isArray(filterEnum)
      ? filterEnum.filter((e) => e !== null && e !== undefined)
      : filterEnum
  })
  if (filterType === 'number' || filterType === 'range') {
    const filterConfig = getDatasetFilterItem(activeDatasets?.[0] as Dataset, filter)
    if (filterConfig && filterConfig.min && filterConfig.max) {
      filterFields = [[filterConfig?.min?.toString(), filterConfig?.max?.toString()]]
    }
  }
  const cleanFilterFields =
    compatibilityOperation === 'every' ? intersection(...filterFields) : uniq(filterFields.flat())
  const datasetId = removeDatasetVersion(activeDatasets?.[0]?.id as string)
  let commonFilters = filterFields
    ? cleanFilterFields.map((field) => {
        let label =
          filterType === 'range' || filterType === 'number'
            ? field
            : t((t: any) => t[datasetId]?.schema?.[filter]?.enum?.[field as string], {
                ns: 'datasets',
                defaultValue: field?.toString(),
              })
        if (EXPERIMENTAL_FIELDS_BY_FILTER[filter]?.includes(field as string)) {
          label += ' (Experimental)'
        }
        if (label === field) {
          if (filter === 'geartypes' || filter === 'geartype') {
            // There is an fixed list of gearTypes independant of the dataset
            label = getVesselGearTypeLabel({ geartypes: field as string })
          } else if (filter === 'vessel_type') {
            label = getVesselShipTypeLabel({ shiptypes: field as string })
          } else if (
            dataview.category !== DataviewCategory.Context &&
            filter !== 'vessel_id' &&
            filter !== 'speed' &&
            filter !== 'encounter_type'
          ) {
            const fallbackValue = typeof field === 'string' ? field : (field || '').toString()
            label = t((t: any) => t.vessel?.[filter]?.[field as string], {
              defaultValue: fallbackValue,
            })
          }
        }
        return { id: field?.toString(), label: label as string }
      })
    : []

  if (filter === 'encounter_type') {
    commonFilters = commonFilters.filter((field, index, self) => {
      const [first, second] = field.id.split('-')
      const reverseId = `${second}-${first}`
      const isReverse = !self.some((f, i) => i < index && f.id === reverseId)
      return isReverse
    })
  }

  return commonFilters.sort(sortFields)
}

const getFilterOptionsSelectedInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter,
  options: ReturnType<typeof getCommonFiltersInDataview>
) => {
  const filterType = getCommonFilterTypeInDataview(dataview, filter)
  if (filter === 'flag') {
    return getFlagsByIds(dataview.config?.filters?.flag || [])
  }
  if (filterType === 'range' && dataview.config?.filters?.[filter]) {
    return dataview.config?.filters?.[filter]?.map((o: string) => [
      {
        id: o.toString(),
        label: o.toString(),
      },
    ])
  }
  if (
    filter === 'visibleValues' &&
    (dataview.config?.minVisibleValue || dataview.config?.maxVisibleValue)
  ) {
    const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings) as Dataset
    const layerRange = getEnvironmentalDatasetRange(dataset)
    const min = dataview.config?.minVisibleValue || layerRange?.min
    const max = dataview.config?.maxVisibleValue || layerRange?.max
    return [
      {
        id: min.toString(),
        label: min,
      },
      {
        id: max.toString(),
        label: max,
      },
    ]
  }

  if (filter === 'next_port_id' && dataview.config?.filters?.next_port_id) {
    const ports = getPortsByIds(dataview.config?.filters?.next_port_id || [])
    if (ports.length) {
      return ports
    }
    const nextPortIds = Array.isArray(dataview.config?.filters?.next_port_id)
      ? dataview.config?.filters?.next_port_id
      : [dataview.config?.filters?.next_port_id]
    return nextPortIds.map((id) => ({ id, label: id }))
  }

  return options?.filter((option) => {
    const filterValues = dataview.config?.filters?.[filter] as string | string[]
    return Array.isArray(filterValues)
      ? filterValues.map((f) => f.toString()).includes(option.id)
      : filterValues?.toString() === option.id
  })
}

export const getFiltersSelectedInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter,
  params = {} as Pick<GetFiltersInDataviewParams, 'vesselGroups' | 'isGuestUser'>
) => {
  const options = getCommonFiltersInDataview(dataview, filter, params)
  const optionsSelected = getFilterOptionsSelectedInDataview(dataview, filter, options)
  return optionsSelected
}

export const getFilterOperationInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  if (
    filter === 'vessel-groups' ||
    filter === 'neural_vessel_type' ||
    dataview.category === DataviewCategory.Context
  ) {
    return
  }
  return dataview.config?.filterOperators?.[filter] || INCLUDE_FILTER_ID
}

export const getFilterUnitInDataview = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  return getDatasetFilterItem(dataview.datasets?.[0] as Dataset, filter)?.unit
}

const getIsFilterSingleSelection = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter
) => {
  const filterConfig = getDatasetFilterItem(dataview.datasets?.[0] as Dataset, filter)
  return filterConfig?.singleSelection
}

const getFilterOperation = (dataview: DataviewWithFilters, filter: SupportedDatasetFilter) => {
  const filterConfig = getDatasetFilterItem(dataview.datasets?.[0] as Dataset, filter)
  return filterConfig?.operation
}
export type DataviewFilterConfig = {
  type: DatasetFilterType
  id: SupportedDatasetFilter
  label: string
  disabled: boolean
  options: ReturnType<typeof getCommonFiltersInDataview>
  optionsSelected: ReturnType<typeof getCommonFiltersInDataview>
  unit?: string
  operation?: DatasetFilterOperation
  filterOperator: FilterOperator
  singleSelection?: boolean
}

export const getDataviewFilterConfig = (
  dataview: DataviewWithFilters,
  filter: SupportedDatasetFilter,
  {
    vesselGroups = [],
    compatibilityOperation = 'every',
    filterOrigin,
    isGuestUser,
  } = {} as GetFiltersInDataviewParams
): DataviewFilterConfig => {
  const options = getCommonFiltersInDataview(dataview, filter, {
    vesselGroups,
    compatibilityOperation,
    filterOrigin,
    isGuestUser,
  })
  const type = getCommonFilterTypeInDataview(dataview, filter) as DatasetFilterType
  const singleSelection = getIsFilterSingleSelection(dataview, filter)
  const operation = getFilterOperation(dataview, filter) as DatasetFilterOperation
  const filterOperator = getFilterOperationInDataview(dataview, filter) as FilterOperator
  const optionsSelected = getFilterOptionsSelectedInDataview(dataview, filter, options)
  const unit = getFilterUnitInDataview(dataview, filter)
  const datasetsWithFilter = getSupportedFilterDatasets(dataview, filter)?.map((d) => d.id)
  const activeDatasets = getActiveDatasetsInDataview(dataview as UrlDataviewInstance)?.map(
    (d) => d.id
  )
  const hasDatasetsWithFilter =
    compatibilityOperation === 'some'
      ? activeDatasets?.some((d) => (datasetsWithFilter as string[]).includes(d))
      : activeDatasets?.every((d) => (datasetsWithFilter as string[]).includes(d))

  const incompatibleFilterSelection = getIncompatibleFilterSelection(dataview, filter)
  const hasIncompatibleFilterSelection =
    incompatibleFilterSelection !== undefined && incompatibleFilterSelection?.length > 0
  const disabled = !hasDatasetsWithFilter || hasIncompatibleFilterSelection
  const datasetId = removeDatasetVersion(
    getActiveDatasetsInDataview(dataview as UrlDataviewInstance)?.[0]?.id as string
  )
  const label = getFilterLabel(filter, datasetId)

  return {
    id: filter,
    label,
    unit,
    disabled,
    options,
    optionsSelected,
    type,
    operation,
    filterOperator,
    singleSelection,
  }
}

export const getFiltersInDataview = (
  dataview: DataviewWithFilters,
  { vesselGroups, fieldsToInclude, isGuestUser } = {} as GetFiltersInDataviewParams
): { filtersAllowed: DataviewFilterConfig[]; filtersDisabled: DataviewFilterConfig[] } => {
  let fieldsIds = uniq(
    dataview.datasets?.flatMap((dataset) => getDatasetFiltersAllowed(dataset)) || []
  ) as SupportedDatasetFilter[]
  if (fieldsToInclude?.length) {
    fieldsIds = fieldsIds.filter((f) => fieldsToInclude.includes(f))
  }
  if (dataview.datasets?.some((t) => t.type === DatasetTypes.Fourwings)) {
    // This filter avoids to show the selector for the vessel ids in fourwings layers
    fieldsIds = fieldsIds.filter((f) => f !== 'vessel_id')
  }

  const fieldsOrder = dataview.filtersConfig?.order as SupportedDatasetFilter[]
  const fieldsAllowed = fieldsIds.filter((f) => isDataviewFilterSupported(dataview, f))
  const fieldsDisabled = fieldsIds.filter((f) => !isDataviewFilterSupported(dataview, f))
  const fielsAllowedOrdered =
    fieldsOrder && fieldsOrder.length > 0
      ? fieldsAllowed.sort((a, b) => {
          const aIndex = fieldsOrder.findIndex((f) => f === a)
          const bIndex = fieldsOrder.findIndex((f) => f === b)
          return aIndex - bIndex
        })
      : fieldsAllowed
  const filtersAllowed = fielsAllowedOrdered.map((id) => {
    return getDataviewFilterConfig(dataview, id, {
      vesselGroups,
      isGuestUser,
      compatibilityOperation: id === 'speed' || id === 'elevation' ? 'some' : 'every',
    })
  })
  const filtersDisabled = fieldsDisabled.map((id) => {
    return getDataviewFilterConfig(dataview, id, {
      vesselGroups,
      isGuestUser,
      compatibilityOperation: id === 'speed' || id === 'elevation' ? 'some' : 'every',
    })
  })
  return {
    filtersAllowed,
    filtersDisabled,
  }
}
