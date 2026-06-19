import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { FilterOperator } from '@globalfishingwatch/api-types'
import { DataviewCategory, EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import { type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { HEATMAP_HIGH_RES_ID, HEATMAP_ID } from '@globalfishingwatch/deck-layers'
import type { MultiSelectOption } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectActivityVisualizationMode,
  selectDetectionsVisualizationMode,
} from 'features/app/selectors/app.selectors'
import {
  getIncompatibleFilterSelection,
  VESSEL_GROUPS_MODAL_ID,
} from 'features/dataviews/dataviews.filters'
import { setVesselGroupsModalOpen } from 'features/vessel-groups/vessel-groups-modal.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useReplaceQueryParams } from 'router/routes.hook'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import { getEncounterTypesFromId } from 'utils/encounter-types'

import { type OnSelectFilterArgs, trackEventCb } from './LayerFilters.utils'

type UseLayerFilterStateParams = {
  baseDataview: UrlDataviewInstance
  categoryDataviews: UrlDataviewInstance[]
  onConfirmCallback?: () => void
}

export function useLayerFilterState({
  baseDataview,
  categoryDataviews,
  onConfirmCallback,
}: UseLayerFilterStateParams) {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const activityVisualizationMode = useSelector(selectActivityVisualizationMode)
  const detectionsVisualizationMode = useSelector(selectDetectionsVisualizationMode)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const [newDataviewInstanceConfig, setNewDataviewInstanceConfig] = useState<
    UrlDataviewInstance | undefined
  >()
  const newDataviewInstanceConfigRef = useRef<UrlDataviewInstance | undefined>(
    newDataviewInstanceConfig
  )

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

  const checkVesselGroupsFilter = useCallback(
    (dataviewInstance: UrlDataviewInstance) => {
      const isHighRes =
        dataview.category === DataviewCategory.Activity
          ? activityVisualizationMode === HEATMAP_HIGH_RES_ID
          : dataview.category === DataviewCategory.Detections
            ? detectionsVisualizationMode === HEATMAP_HIGH_RES_ID
            : false
      if (isHighRes && dataviewInstance?.config?.filters?.['vessel-groups']) {
        const categoryQueryParam = `${dataview.category}VisualizationMode`
        replaceQueryParams({ [categoryQueryParam]: HEATMAP_ID })
      }
    },
    [activityVisualizationMode, dataview.category, detectionsVisualizationMode, replaceQueryParams]
  )

  useEffect(() => {
    return () => {
      if (newDataviewInstanceConfigRef.current) {
        if (window.confirm(t((t) => t.layer.filtersConfirmAbort)) === true) {
          upsertDataviewInstance(newDataviewInstanceConfigRef.current)
          checkVesselGroupsFilter(newDataviewInstanceConfigRef.current)
        }
      }
    }
    // Running on effect to ensure the dataview update is running when we close the filter from outside
  }, [])

  const onConfirmFilters = useCallback(
    ({ applyToAll } = {} as { applyToAll: boolean }) => {
      if (newDataviewInstanceConfig) {
        const newDataviewInstancesConfig = applyToAll
          ? categoryDataviews.map((d) => ({
              ...newDataviewInstanceConfig,
              id: d.id,
            }))
          : newDataviewInstanceConfig
        upsertDataviewInstance(newDataviewInstancesConfig)
        checkVesselGroupsFilter(newDataviewInstancesConfig as UrlDataviewInstance)
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
    },
    [
      baseDataview.config?.filters,
      categoryDataviews,
      checkVesselGroupsFilter,
      newDataviewInstanceConfig,
      onConfirmCallback,
      upsertDataviewInstance,
    ]
  )

  return {
    dataview,
    newDataviewInstanceConfig,
    setNewDataviewInstanceConfig,
    onDataviewFilterChange,
    handleIsOpenChange,
    onConfirmFilters,
  }
}

type UseLayerFilterHandlersParams = {
  dataview: UrlDataviewInstance
  onDataviewFilterChange: (dataviewInstance: UrlDataviewInstance) => void
  setNewDataviewInstanceConfig: (dataviewInstance: UrlDataviewInstance) => void
}

export function useLayerFilterHandlers({
  dataview,
  onDataviewFilterChange,
  setNewDataviewInstanceConfig,
}: UseLayerFilterHandlersParams) {
  const dispatch = useAppDispatch()

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
    const eventLabel = getEventLabel([
      'select',
      getActivitySources(dataview),
      ...getActivityFilters({ minVisibleValue, maxVisibleValue }),
    ])
    trackEventCb('visibleValue', eventLabel)
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
      let value: string[] = typeof selection === 'number' ? [selection] : [selection.id]
      if (filterKey === 'encounter_type') {
        // For encounter_type we need to add the reverse value to ensure both types are included
        value = getEncounterTypesFromId((selection as MultiSelectOption).id)
      }
      filterValues = [...(dataview.config?.filters?.[filterKey] || []), ...value]
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
        key as SupportedDatasetFilter
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
    filterKey: string | SupportedDatasetFilter,
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

  return {
    onSelectHistogramRangeFilterClick,
    onSelectFilterClick,
    onSelectFilterOperationClick,
    onRemoveFilterClick,
    onCleanFilterClick,
  }
}
