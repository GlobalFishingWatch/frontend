import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { debounce, identity } from 'lodash'
import {
  MultiSelect,
  MultiSelectOnChange,
  MultiSelectOption,
} from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import {
  getCommonSchemaFieldsInDataview,
  geSchemaFiltersInDataview,
  getIncompatibleFilterSelection,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import ActivitySchemaFilter, {
  showSchemaFilter,
} from 'features/workspace/activity/ActivitySchemaFilter'
import styles from './ActivityFilters.module.css'
import {
  areAllSourcesSelectedInDataview,
  getSourcesOptionsInDataview,
  getSourcesSelectedInDataview,
} from './activity.utils'
import ActivityVesselGroupFilter from './ActivityVesselGroupFilter'

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

const VESSEL_GROUP_MOCK = [
  { id: 'vesselGroup1', numVessels: 164, name: 'Long Xing' },
  { id: 'vesselGroup2', numVessels: 54, name: 'My Custom vessel group 1' },
]

function ActivityFilters({ dataview }: ActivityFiltersProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const sourceOptions = getSourcesOptionsInDataview(dataview)
  // insert the "All" option only when more than one option available
  const allOption = { id: 'all', label: t('selects.allSelected', 'All') }
  const allSourceOptions = sourceOptions.length > 1 ? [allOption, ...sourceOptions] : sourceOptions
  const allSelected = areAllSourcesSelectedInDataview(dataview)
  const sourcesSelected = allSelected ? [allOption] : getSourcesSelectedInDataview(dataview)

  const showSourceFilter = sourceOptions && sourceOptions?.length > 1

  const schemaFilters = geSchemaFiltersInDataview(dataview)

  const onSelectSourceClick: MultiSelectOnChange = (source) => {
    let datasets: string[] = []
    if (source.id === allOption.id) {
      datasets = sourceOptions.map((s) => s.id)
    } else {
      datasets = allSelected ? [source.id] : [...(dataview.config?.datasets || []), source.id]
    }
    const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}

    const newDataview = { ...dataview, config: { ...dataview.config, datasets } }
    if (filters['geartype']) {
      const newGeartypeOptions = getCommonSchemaFieldsInDataview(newDataview, 'geartype')
      const newGeartypeSelection = newGeartypeOptions?.filter((geartype) =>
        dataview.config?.filters?.geartype?.includes(geartype.id)
      )

      // We have to remove the geartype if it is not supported by the datasets selecion
      if (newGeartypeOptions.length === 0) {
        delete filters['geartype']
        // or keep only the options that every dataset have in common
      } else if (!newGeartypeSelection?.length !== dataview.config?.filters?.geartype?.length) {
        filters.geartype = newGeartypeSelection.map(({ id }) => id)
      }
    }

    if (filters['fleet']) {
      const newFleetOptions = getCommonSchemaFieldsInDataview(newDataview, 'fleet')
      const newFleetSelection = newFleetOptions?.filter((geartype) =>
        dataview.config?.filters?.geartype?.includes(geartype.id)
      )

      // We have to remove the geartype if it is not supported by the datasets selecion
      if (newFleetOptions.length === 0) {
        delete filters['fleet']
        // or keep only the options that every dataset have in common
      } else if (!newFleetSelection?.length !== dataview.config?.filters?.geartype?.length) {
        filters.fleet = newFleetSelection.map(({ id }) => id)
      }
    }
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
    delete filters[filterKey]
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters },
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

  const vesselGroups: MultiSelectOption[] = VESSEL_GROUP_MOCK.map(({ id, name, numVessels }) => ({
    id,
    label: t('vesselGroup.label', `{{name}} ({{count}} IDs)`, {
      name,
      count: numVessels,
    }),
  }))

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
        if (!showSchemaFilter(schemaFilter)) {
          return null
        }
        return (
          <ActivitySchemaFilter
            key={schemaFilter.id}
            schemaFilter={schemaFilter}
            onSelect={onSelectFilterClick}
            onRemove={onRemoveFilterClick}
            onClean={onCleanFilterClick}
          />
        )
      })}
      <ActivityVesselGroupFilter
        schemaFilter={{
          id: 'vesselGroup',
          disabled: false,
          options: vesselGroups,
          optionsSelected: [vesselGroups[0]],
          type: 'string',
        }}
        onSelect={onSelectFilterClick}
        onRemove={onRemoveFilterClick}
        onClean={onCleanFilterClick}
      />
    </Fragment>
  )
}

export default ActivityFilters
