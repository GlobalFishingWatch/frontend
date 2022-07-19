import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'
import {
  MultiSelect,
  MultiSelectOnChange,
  MultiSelectOption,
} from '@globalfishingwatch/ui-components'
import { EXCLUDE_FILTER_ID, FilterOperator } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import {
  getCommonSchemaFieldsInDataview,
  getSchemaFiltersInDataview,
  getIncompatibleFilterSelection,
  SupportedDatasetSchema,
  VESSEL_GROUPS_MODAL_ID,
} from 'features/datasets/datasets.utils'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import ActivitySchemaFilter, {
  showSchemaFilter,
} from 'features/workspace/activity/ActivitySchemaFilter'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import { selectVessselGroupsAllowed } from 'features/vessel-groups/vessel-groups.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  setCurrentDataviewId,
  setVesselGroupsModalOpen,
} from 'features/vessel-groups/vessel-groups.slice'
import styles from './ActivityFilters.module.css'
import {
  areAllSourcesSelectedInDataview,
  getSourcesOptionsInDataview,
  getSourcesSelectedInDataview,
} from './activity.utils'

type ActivityFiltersProps = {
  dataview: UrlDataviewInstance
}

const trackEvent = debounce((filterKey: string, label: string) => {
  uaEvent({
    category: 'Activity data',
    action: `Click on ${filterKey} filter`,
    label: label,
  })
}, 200)

const cleanDataviewFiltersNotAllowed = (
  dataview: UrlDataviewInstance,
  vesselGroupOptions: MultiSelectOption[]
) => {
  const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}
  Object.keys(filters).forEach((key: SupportedDatasetSchema) => {
    if (filters[key]) {
      const newFilterOptions = getCommonSchemaFieldsInDataview(dataview, key, vesselGroupOptions)
      const newFilterSelection = newFilterOptions?.filter((option) =>
        dataview.config?.filters?.[key]?.includes(option.id)
      )

      // We have to remove the key if it is not supported by the datasets selecion
      if (newFilterOptions.length === 0) {
        delete filters[key]
        // or keep only the options that every dataset have in common
      } else if (!newFilterSelection?.length !== dataview.config?.filters?.[key]?.length) {
        filters[key] = newFilterSelection.map(({ id }) => id)
      }
    }
  })

  return filters
}

function ActivityFilters({ dataview }: ActivityFiltersProps): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const allowVesselGroup = useSelector(selectVessselGroupsAllowed)
  const vesselGroupsOptions = useVesselGroupsOptions()

  const sourceOptions = getSourcesOptionsInDataview(dataview)
  // insert the "All" option only when more than one option available
  const allOption = { id: 'all', label: t('selects.allSelected', 'All') }
  const allSourceOptions = sourceOptions.length > 1 ? [allOption, ...sourceOptions] : sourceOptions
  const allSelected = areAllSourcesSelectedInDataview(dataview)
  const sourcesSelected = allSelected ? [allOption] : getSourcesSelectedInDataview(dataview)

  const showSourceFilter = sourceOptions && sourceOptions?.length > 1

  const schemaFilters = getSchemaFiltersInDataview(dataview, vesselGroupsOptions)

  const onSelectSourceClick: MultiSelectOnChange = (source) => {
    let datasets: string[] = []
    if (source.id === allOption.id) {
      datasets = sourceOptions.map((s) => s.id)
    } else {
      datasets = allSelected ? [source.id] : [...(dataview.config?.datasets || []), source.id]
    }

    const newDataview = { ...dataview, config: { ...dataview.config, datasets } }
    const filters = cleanDataviewFiltersNotAllowed(newDataview, vesselGroupsOptions)
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        datasets,
        filters,
      },
    })
  }

  const onRemoveSourceClick: MultiSelectOnChange = (source) => {
    const datasets =
      dataview.config?.datasets?.filter((datasetId: string) => datasetId !== source.id) || null
    upsertDataviewInstance({
      id: dataview.id,
      config: { datasets },
    })
  }

  const onSelectFilterClick = (
    filterKey: SupportedDatasetSchema,
    selection: MultiSelectOption | MultiSelectOption[]
  ) => {
    if ((selection as MultiSelectOption)?.id === VESSEL_GROUPS_MODAL_ID) {
      dispatch(setVesselGroupsModalOpen(true))
      dispatch(setCurrentDataviewId(dataview.id))
      return
    }
    const filterValues = Array.isArray(selection)
      ? selection.map(({ id }) => id).sort((a, b) => a - b)
      : [...(dataview.config?.filters?.[filterKey] || []), selection.id]
    const newDataviewConfig = {
      filters: {
        ...(dataview.config?.filters || {}),
        [filterKey]: filterValues,
      },
    }
    const newDataview = { ...dataview, config: { ...dataview.config, ...newDataviewConfig } }
    const incompatibleFilters = Object.keys(newDataview.config?.filters || {}).flatMap((key) => {
      const incompatibleFilterSelection =
        getIncompatibleFilterSelection(newDataview, key as SupportedDatasetSchema)?.length > 0
      return incompatibleFilterSelection ? key : []
    })
    if (incompatibleFilters.length) {
      incompatibleFilters.forEach((f) => {
        delete newDataviewConfig.filters[f]
      })
    }
    upsertDataviewInstance({
      id: dataview.id,
      config: newDataviewConfig,
    })
    const eventLabel = getEventLabel([
      'select',
      getActivitySources(dataview),
      ...getActivityFilters({ [filterKey]: filterValues }),
    ])
    trackEvent(filterKey, eventLabel)
  }

  const onSelectFilterOperationClick = (
    filterKey: SupportedDatasetSchema,
    filterOperator: FilterOperator
  ) => {
    const newDataviewConfig = {
      filterOperators: {
        ...(dataview.config?.filterOperators || {}),
      },
    }

    if (filterOperator === EXCLUDE_FILTER_ID) {
      newDataviewConfig.filterOperators[filterKey] = filterOperator
    } else if (newDataviewConfig.filterOperators[filterKey]) {
      delete newDataviewConfig.filterOperators[filterKey]
    }

    upsertDataviewInstance({
      id: dataview.id,
      config: newDataviewConfig,
    })
    const eventLabel = getEventLabel([
      'select',
      getActivitySources(dataview),
      ...getActivityFilters({ [filterKey]: [filterOperator] }),
    ])
    trackEvent(filterKey, eventLabel)
  }

  const onRemoveFilterClick = (filterKey: string, selection: MultiSelectOption[]) => {
    const filterValue = selection?.length ? selection.map((f) => f.id) : null
    const filters = dataview.config?.filters || {}
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters: { ...filters, [filterKey]: filterValue } },
    })
    uaEvent({
      category: 'Activity data',
      action: `Click on ${filterKey} filter`,
      label: getEventLabel([
        'deselect',
        getActivitySources(dataview),
        ...getActivityFilters({ [filterKey]: filterValue ?? [] }),
      ]),
    })
  }

  const onCleanFilterClick = (filterKey: string) => {
    const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}
    const filterOperators = dataview.config?.filterOperators
      ? { ...dataview.config.filterOperators }
      : {}
    delete filters[filterKey]
    delete filterOperators[filterKey]
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters, filterOperators },
    })
    uaEvent({
      category: 'Activity data',
      action: `Click on ${filterKey} filter`,
      label: getEventLabel(['clear', getActivitySources(dataview)]),
    })
  }

  const showSchemaFilters = showSourceFilter || schemaFilters.some(showSchemaFilter)

  if (!showSchemaFilters) {
    return <p className={styles.placeholder}>{t('dataset.emptyFilters', 'No filters available')}</p>
  }

  return (
    <Fragment>
      {showSourceFilter && (
        <MultiSelect
          label={t('layer.source_other', 'Sources')}
          placeholder={getPlaceholderBySelections(sourcesSelected)}
          options={allSourceOptions}
          selectedOptions={sourcesSelected}
          onSelect={onSelectSourceClick}
          onRemove={sourcesSelected?.length > 1 ? onRemoveSourceClick : undefined}
        />
      )}
      {schemaFilters.map((schemaFilter) => {
        if (
          schemaFilter.id === 'vessel-groups' &&
          !schemaFilter.optionsSelected.length &&
          !allowVesselGroup
        ) {
          return null
        }
        if (!showSchemaFilter(schemaFilter)) {
          return null
        }
        return (
          <ActivitySchemaFilter
            key={schemaFilter.id}
            schemaFilter={schemaFilter}
            onSelect={onSelectFilterClick}
            onSelectOperation={onSelectFilterOperationClick}
            onRemove={onRemoveFilterClick}
            onClean={onCleanFilterClick}
          />
        )
      })}
    </Fragment>
  )
}

export default ActivityFilters
