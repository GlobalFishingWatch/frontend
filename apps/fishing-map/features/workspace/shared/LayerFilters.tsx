import { Fragment, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { debounce } from 'es-toolkit'

import type { FilterOperator } from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewCategory, EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import {
  isHeatmapVectorsDataview,
  isTrackDataview,
  type UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { HEATMAP_HIGH_RES_ID, HEATMAP_ID } from '@globalfishingwatch/deck-layers'
import type { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { Button } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectActivityVisualizationMode,
  selectDetectionsVisualizationMode,
} from 'features/app/selectors/app.selectors'
import {
  getFiltersInDataview,
  getIncompatibleFilterSelection,
  VESSEL_GROUPS_MODAL_ID,
} from 'features/dataviews/dataviews.filters'
import { selectDataviewInstancesByCategory } from 'features/dataviews/selectors/dataviews.categories.selectors'
import UserGuideLink from 'features/help/UserGuideLink'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import { setVesselGroupsModalOpen } from 'features/vessel-groups/vessel-groups-modal.slice'
import LayerFiltersGap from 'features/workspace/shared/LayerFiltersGap'
import LayerFiltersSource from 'features/workspace/shared/LayerFiltersSource'
import LayerSchemaFilter from 'features/workspace/shared/LayerSchemaFilter'
import { showSchemaFilter } from 'features/workspace/shared/LayerSchemaFilter.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useReplaceQueryParams } from 'router/routes.hook'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import { usePorts } from 'utils/ports'
import { listAsSentence } from 'utils/shared'

import { getSourcesOptionsInDataview } from '../activity/activity.utils'

import { isHistogramDataviewSupported } from './layer-properties.utils'

import styles from './LayerFilters.module.css'

type LayerFiltersProps = {
  dataview: UrlDataviewInstance
  showApplyToAll?: boolean
  onConfirmCallback?: () => void
}

const HistogramRangeFilter = lazy(
  () => import('features/workspace/environmental/HistogramRangeFilter')
)

const trackEventCb = debounce((filterKey: string, label: string) => {
  trackEvent({
    category: TrackCategory.ActivityData,
    action: `Click on ${filterKey} filter`,
    label: label,
  })
}, 200)

export type OnSelectFilterArgs = {
  filterKey: string | SupportedDatasetFilter
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
  const { replaceQueryParams } = useReplaceQueryParams()
  const categoryDataviews = useSelector(selectDataviewInstancesByCategory(baseDataview?.category))
  const activityVisualizationMode = useSelector(selectActivityVisualizationMode)
  const detectionsVisualizationMode = useSelector(selectDetectionsVisualizationMode)
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

  const sourceOptions = getSourcesOptionsInDataview(dataview, [DatasetTypes.Fourwings])

  const showSourceFilter =
    sourceOptions && sourceOptions?.length > 1 && !isHeatmapVectorsDataview(dataview)
  const showGapsFilter = isTrackDataview(dataview)

  const { filtersAllowed, filtersDisabled } = getFiltersInDataview(dataview, {
    vesselGroups: vesselGroupsOptions,
    isGuestUser,
  })

  usePorts(filtersAllowed.some((f) => f.id === 'next_port_id'))

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
    [activityVisualizationMode, dataview.category, detectionsVisualizationMode]
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

  const onGapChange = (maxGapHours: number | undefined) => {
    onDataviewFilterChange({
      id: dataview.id,
      config: { maxGapHours },
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
      let value: string[] = typeof selection === 'number' ? [selection] : [selection.id]
      if (filterKey === 'encounter_type') {
        // For encounter_type we need to add the reverse value to ensure both types are included
        const [first, second] = (selection as MultiSelectOption).id.split('-')
        if (first && second) {
          if (first === second) {
            // when equal not need to add the reverse value
            value = [`${first}-${second}`]
          } else {
            value = [`${first}-${second}`, `${second}-${first}`]
          }
        }
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

  const onConfirmFilters = ({ applyToAll } = {} as { applyToAll: boolean }) => {
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
  }

  const showHistogramFilter = isHistogramDataviewSupported(dataview)
  const showSchemaFilters =
    showHistogramFilter || showSourceFilter || filtersAllowed.some(showSchemaFilter)

  if (!showSchemaFilters) {
    return <p className={styles.placeholder}>{t((t) => t.dataset.emptyFilters)}</p>
  }

  return (
    <Fragment>
      {showSourceFilter && (
        <LayerFiltersSource
          dataview={dataview}
          onSourceChange={onDataviewFilterChange}
          onIsOpenChange={handleIsOpenChange}
        />
      )}
      {showGapsFilter && <LayerFiltersGap dataview={dataview} onChange={onGapChange} />}
      {showHistogramFilter && (
        <Suspense fallback={null}>
          <HistogramRangeFilter dataview={dataview} onSelect={onSelectHistogramRangeFilterClick} />
        </Suspense>
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
          <Button
            type="secondary"
            disabled={!newDataviewInstanceConfig}
            onClick={() => onConfirmFilters({ applyToAll: true })}
          >
            {t((t) => t.common.applyToAll)}
          </Button>
        )}
        <Button
          disabled={!newDataviewInstanceConfig}
          onClick={() => onConfirmFilters()}
          testId="confirm-filters-button"
        >
          {t((t) => t.common.confirm)}
        </Button>
      </div>
      {filtersDisabled.length >= 1 && (
        <p className={styles.filtersDisabled}>
          {t((t) => t.layer.filtersDisabled, {
            filters: listAsSentence(filtersDisabled.map((filter) => filter.label)) ?? '',
          })}
        </p>
      )}
      {dataview.category === DataviewCategory.Activity && (
        <UserGuideLink slug="filtering-activity-layers" className={styles.userGuideLink} />
      )}
    </Fragment>
  )
}

export default LayerFilters
