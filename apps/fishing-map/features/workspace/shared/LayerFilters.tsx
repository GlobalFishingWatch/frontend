import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { debounce } from 'es-toolkit'

import type { FilterOperator } from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewCategory, EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { MultiSelectOnChange, MultiSelectOption } from '@globalfishingwatch/ui-components'
import { Button, MultiSelect } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import type { SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import {
  getCommonSchemaFieldsInDataview,
  getIncompatibleFilterSelection,
  getSchemaFiltersInDataview,
  VESSEL_GROUPS_MODAL_ID,
} from 'features/datasets/datasets.utils'
import { selectDataviewInstancesByCategory } from 'features/dataviews/selectors/dataviews.categories.selectors'
import UserGuideLink from 'features/help/UserGuideLink'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import { setVesselGroupsModalOpen } from 'features/vessel-groups/vessel-groups-modal.slice'
import HistogramRangeFilter from 'features/workspace/environmental/HistogramRangeFilter'
import LayerSchemaFilter, { showSchemaFilter } from 'features/workspace/shared/LayerSchemaFilter'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import { listAsSentence } from 'utils/shared'

import {
  areAllSourcesSelectedInDataview,
  getSourcesOptionsInDataview,
  getSourcesSelectedInDataview,
} from '../activity/activity.utils'

import styles from './LayerFilters.module.css'

type LayerFiltersProps = {
  dataview: UrlDataviewInstance
  showApplyToAll?: boolean
  onConfirmCallback?: () => void
}

const trackEventCb = debounce((filterKey: string, label: string) => {
  trackEvent({
    category: TrackCategory.ActivityData,
    action: `Click on ${filterKey} filter`,
    label: label,
  })
}, 200)

const cleanDataviewFiltersNotAllowed = (
  dataview: UrlDataviewInstance,
  vesselGroups: MultiSelectOption[],
  isGuestUser?: boolean
) => {
  const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}
  Object.keys(filters).forEach((k) => {
    const key = k as SupportedDatasetSchema
    if (filters[key]) {
      const newFilterOptions = getCommonSchemaFieldsInDataview(dataview, key, {
        vesselGroups,
        isGuestUser,
      })
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

export const isHistogramDataviewSupported = (dataview: UrlDataviewInstance) => {
  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
  const { max, min } = dataset?.configuration || {}
  return (
    max !== undefined &&
    min !== undefined &&
    max !== null &&
    min !== null &&
    (max !== 0 || min !== 0)
  )
}

export type OnSelectFilterArgs = {
  filterKey: string | SupportedDatasetSchema
  selection: number | MultiSelectOption | MultiSelectOption[]
  singleValue?: boolean
}

function LayerFilters({
  showApplyToAll,
  dataview: baseDataview,
  onConfirmCallback,
}: LayerFiltersProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const isGuestUser = useSelector(selectIsGuestUser)
  const categoryDataviews = useSelector(selectDataviewInstancesByCategory(baseDataview?.category))

  const [newDataviewInstanceConfig, setNewDataviewInstanceConfig] = useState<
    UrlDataviewInstance | undefined
  >()
  const newDataviewInstanceConfigRef = useRef<UrlDataviewInstance | undefined>(
    newDataviewInstanceConfig
  )

  const dispatch = useAppDispatch()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const vesselGroupsOptions = useVesselGroupsOptions()

  const dataview = useMemo(() => {
    if (!newDataviewInstanceConfig) {
      return baseDataview
    }
    return {
      ...baseDataview,
      ...newDataviewInstanceConfig,
      config: {
        ...baseDataview.config,
        ...newDataviewInstanceConfig.config,
      },
    }
  }, [baseDataview, newDataviewInstanceConfig])

  const sourceOptions = getSourcesOptionsInDataview(dataview)
  // insert the "All" option only when more than one option available
  const allOption = { id: 'all', label: t('selects.allSelected', 'All') }
  const allSourceOptions = sourceOptions.length > 1 ? [allOption, ...sourceOptions] : sourceOptions
  const allSelected = areAllSourcesSelectedInDataview(dataview)
  const sourcesSelected = allSelected ? [allOption] : getSourcesSelectedInDataview(dataview)

  const showSourceFilter = sourceOptions && sourceOptions?.length > 1

  const { filtersAllowed, filtersDisabled } = getSchemaFiltersInDataview(dataview, {
    vesselGroups: vesselGroupsOptions,
    isGuestUser,
  })

  const onDataviewFilterChange = useCallback(
    (dataviewInstance: UrlDataviewInstance) => {
      if (!newDataviewInstanceConfig) {
        setNewDataviewInstanceConfig(dataviewInstance)
      } else {
        setNewDataviewInstanceConfig({
          ...newDataviewInstanceConfig,
          ...dataviewInstance,
          config: {
            ...newDataviewInstanceConfig.config,
            ...dataviewInstance.config,
          },
        })
      }
    },
    [newDataviewInstanceConfig]
  )

  const handleIsOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setNewDataviewInstanceConfig(newDataviewInstanceConfig)
      }
    },
    [newDataviewInstanceConfig]
  )

  useEffect(() => {
    newDataviewInstanceConfigRef.current = newDataviewInstanceConfig
  }, [newDataviewInstanceConfig])

  useEffect(() => {
    return () => {
      if (newDataviewInstanceConfigRef.current) {
        if (
          window.confirm(
            t('layer.filtersConfirmAbort', 'Do you want to apply the changes made to the layer?')
          ) === true
        ) {
          upsertDataviewInstance(newDataviewInstanceConfigRef.current)
        }
      }
    }
    // Running on effect to ensure the dataview update is running when we close the filter from outside
  }, [])

  const onSelectSourceClick: MultiSelectOnChange = (source) => {
    let datasets: string[] = []
    if (source.id === allOption.id) {
      datasets = sourceOptions.map((s) => s.id)
    } else {
      datasets = allSelected ? [source.id] : [...(dataview.config?.datasets || []), source.id]
    }

    const newDataview = { ...dataview, config: { ...dataview.config, datasets } }
    const filters = cleanDataviewFiltersNotAllowed(newDataview, vesselGroupsOptions, isGuestUser)
    setNewDataviewInstanceConfig({
      id: dataview.id,
      config: {
        datasets,
        filters,
      },
    })
  }

  const onSelectHistogramRangeFilterClick = ({
    minVisibleValue,
    maxVisibleValue,
  }: {
    minVisibleValue: number | undefined
    maxVisibleValue: number | undefined
  }) => {
    setNewDataviewInstanceConfig({
      id: dataview.id,
      config: {
        minVisibleValue,
        maxVisibleValue,
      },
    })
  }

  const onRemoveSourceClick: MultiSelectOnChange = (source) => {
    const datasets =
      dataview.config?.datasets?.filter((datasetId: string) => datasetId !== source.id) || undefined
    onDataviewFilterChange({
      id: dataview.id,
      config: { datasets },
    })
  }

  const onSelectFilterClick = ({
    filterKey,
    selection,
    singleValue = false,
  }: OnSelectFilterArgs) => {
    if ((selection as MultiSelectOption)?.id === VESSEL_GROUPS_MODAL_ID) {
      dispatch(setVesselGroupsModalOpen(true))
      return
    }
    let filterValues: number | string[]
    if (Array.isArray(selection)) {
      filterValues = selection.map(({ id }) => id).sort((a, b) => a - b)
    } else if (singleValue) {
      if (typeof selection === 'number') {
        filterValues = selection
      } else {
        filterValues = [selection.id]
      }
    } else {
      const value = typeof selection === 'number' ? selection : selection.id
      filterValues = [...(dataview.config?.filters?.[filterKey] || []), value]
    }
    const newDataviewConfig = {
      filters: {
        ...(dataview.config?.filters || {}),
        [filterKey]: filterValues,
      },
    }
    const newDataview = { ...dataview, config: { ...dataview.config, ...newDataviewConfig } }
    const incompatibleFilters = Object.keys(newDataview.config?.filters || {}).flatMap((key) => {
      const incompatibleFilterSelection = getIncompatibleFilterSelection(
        newDataview,
        key as SupportedDatasetSchema
      )
      const hasIncompatibleFilterSelection =
        incompatibleFilterSelection?.length && incompatibleFilterSelection.length > 0
      return hasIncompatibleFilterSelection ? key : []
    })
    if (incompatibleFilters.length) {
      incompatibleFilters.forEach((f) => {
        delete newDataviewConfig.filters[f]
      })
    }
    onDataviewFilterChange({
      id: dataview.id,
      config: newDataviewConfig,
    })
    const eventLabel = getEventLabel([
      'select',
      getActivitySources(dataview),
      ...getActivityFilters({ [filterKey]: filterValues }),
    ])
    trackEventCb(filterKey, eventLabel)
  }

  const onSelectFilterOperationClick = (
    filterKey: string | SupportedDatasetSchema,
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

    onDataviewFilterChange({
      id: dataview.id,
      config: newDataviewConfig,
    })
    const eventLabel = getEventLabel([
      'select',
      getActivitySources(dataview),
      ...getActivityFilters({ [filterKey]: [filterOperator] }),
    ])
    trackEventCb(filterKey, eventLabel)
  }

  const onRemoveFilterClick = (filterKey: string, selection: MultiSelectOption[]) => {
    const filterValue = selection?.length ? selection.map((f) => f.id) : null
    const filters = dataview.config?.filters || {}
    onDataviewFilterChange({
      id: dataview.id,
      config: { filters: { ...filters, [filterKey]: filterValue } },
    })
    trackEvent({
      category: TrackCategory.ActivityData,
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
    onDataviewFilterChange({
      id: dataview.id,
      config: { filters, filterOperators },
    })
    trackEvent({
      category: TrackCategory.ActivityData,
      action: `Click on ${filterKey} filter`,
      label: getEventLabel(['clear', getActivitySources(dataview)]),
    })
  }

  const onConfirmFilters = ({ applyToAll } = {} as { applyToAll: boolean }) => {
    if (newDataviewInstanceConfig) {
      const newDataviewInstancesConfig = applyToAll
        ? categoryDataviews.map((d) => ({
            ...newDataviewInstanceConfig,
            id: d.id,
          }))
        : newDataviewInstanceConfig
      upsertDataviewInstance(newDataviewInstancesConfig)
      newDataviewInstanceConfigRef.current = undefined
    } else if (applyToAll && baseDataview.config?.filters) {
      const newDataviewInstancesConfig = categoryDataviews.map((d) => ({
        config: { filters: baseDataview.config?.filters },
        id: d.id,
      }))
      upsertDataviewInstance(newDataviewInstancesConfig)
    }
    if (onConfirmCallback) {
      onConfirmCallback()
    }
  }

  const showHistogramFilter = isHistogramDataviewSupported(dataview)
  const showSchemaFilters =
    showHistogramFilter || showSourceFilter || filtersAllowed.some(showSchemaFilter)

  if (!showSchemaFilters) {
    return <p className={styles.placeholder}>{t('dataset.emptyFilters', 'No filters available')}</p>
  }

  return (
    <Fragment>
      {showSourceFilter && (
        <MultiSelect
          testId="activity-filters"
          label={t('layer.source_other', 'Sources') as string}
          placeholder={getPlaceholderBySelections({
            selection: sourcesSelected.map(({ id }) => id),
            options: allSourceOptions,
          })}
          options={allSourceOptions}
          labelContainerClassName={styles.labelContainer}
          selectedOptions={sourcesSelected}
          onSelect={onSelectSourceClick}
          onIsOpenChange={handleIsOpenChange}
          onRemove={sourcesSelected?.length > 1 ? onRemoveSourceClick : undefined}
        />
      )}
      {showHistogramFilter && (
        <HistogramRangeFilter dataview={dataview} onSelect={onSelectHistogramRangeFilterClick} />
      )}
      {filtersAllowed.map((schemaFilter) => {
        if (!showSchemaFilter(schemaFilter)) {
          return null
        }
        return (
          <LayerSchemaFilter
            key={schemaFilter.id}
            schemaFilter={schemaFilter}
            onSelect={onSelectFilterClick}
            onSelectOperation={onSelectFilterOperationClick}
            onIsOpenChange={handleIsOpenChange}
            onRemove={onRemoveFilterClick}
            onClean={onCleanFilterClick}
          />
        )
      })}
      <div className={cx(styles.footer, { [styles.spaceBetween]: showApplyToAll })}>
        {showApplyToAll && (
          <Button type="secondary" onClick={() => onConfirmFilters({ applyToAll: true })}>
            {t('common.applyToAll', 'Apply to all')}
          </Button>
        )}
        <Button onClick={() => onConfirmFilters()}>{t('common.confirm', 'confirm')}</Button>
      </div>
      {filtersDisabled.length >= 1 && (
        <p className={styles.filtersDisabled}>
          {t('layer.filtersDisabled', {
            defaultValue: 'Other filters ({{filters}}) are available depending on your selection',
            filters: listAsSentence(filtersDisabled.map((filter) => filter.label)),
          })}
        </p>
      )}
      {dataview.category === DataviewCategory.Activity && (
        <UserGuideLink section="activityFilters" className={styles.userGuideLink} />
      )}
    </Fragment>
  )
}

export default LayerFilters
