import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import { VESSEL_GRAPH_COLORS } from '@globalfishingwatch/deck-layers'
import type { ColorRampBrushRange, UILegendColorRamp } from '@globalfishingwatch/ui-components'
import { LegendType, MapLegend } from '@globalfishingwatch/ui-components'

import {
  getFiltersInDataview,
  isDataviewFilterSupported,
} from 'features/_map/dataviews/dataviews.filters'
import { selectVesselsDataviews } from 'features/_map/dataviews/selectors/dataviews.instances.selectors'
import {
  useTimebarTracksGraphExtent,
  useTimebarTracksGraphSteps,
} from 'features/_map/map/timebar-graph.hooks'
import { selectTimebarGraph } from 'features/_map/workspace/selectors/app.timebar.selectors'
import { getFilterValueById } from 'features/_map/workspace/shared/LayerSchemaFilter.utils'
import { useDataviewInstancesConnect } from 'features/_map/workspace/workspace.hook'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'

import MapLegendPlaceholder from '../shared/MapLegendPlaceholder'

import styles from 'features/_map/workspace/shared/Section.module.css'

const ascending = (a: number, b: number) => a - b

function VesselTracksLegend(): React.ReactElement<any> | null {
  const { t } = useTranslation()
  const steps = useTimebarTracksGraphSteps()
  const extent = useTimebarTracksGraphExtent()
  const dataviews = useSelector(selectVesselsDataviews)
  const vesselsTimebarGraph = useSelector(selectTimebarGraph)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const isDepth = vesselsTimebarGraph === 'elevation'
  const filterKey: SupportedDatasetFilter = isDepth ? 'elevation' : 'speed'

  const [lastGraph, setLastGraph] = useState<{
    graph: typeof vesselsTimebarGraph
    steps: typeof steps
    extent: NonNullable<typeof extent>
  }>()
  useEffect(() => {
    if (steps.length && extent) {
      setLastGraph({ graph: vesselsTimebarGraph, steps, extent })
    }
  }, [steps, extent, vesselsTimebarGraph])
  const graph =
    steps.length && extent
      ? { steps, extent }
      : lastGraph?.graph === vesselsTimebarGraph
        ? lastGraph
        : undefined

  const toStored = (value: number) => (isDepth ? -value : value)

  const displayExtent = graph
    ? ([Math.abs(graph.extent[0]), Math.abs(graph.extent[1])].sort(ascending) as [number, number])
    : undefined

  // One legend for every vessel, so a brush writes the same filter to all of them
  const filterableDataviews = dataviews.filter((dataview) =>
    isDataviewFilterSupported(dataview, filterKey)
  )

  const limitOptions = filterableDataviews.length
    ? getFiltersInDataview(filterableDataviews[0], { fieldsToInclude: [filterKey] })
        .filtersAllowed[0]?.options?.map(({ id }) => getFilterValueById(id, { id: filterKey }))
        .sort(ascending)
    : undefined
  const displayLimits = limitOptions?.length
    ? ([limitOptions[0], limitOptions[limitOptions.length - 1]] as [number, number])
    : undefined

  const onBrushChange = ([min, max]: ColorRampBrushRange) => {
    if (!displayLimits) {
      return
    }
    const filterValues =
      min === undefined && max === undefined
        ? ''
        : [min ?? displayLimits[0], max ?? displayLimits[1]]
            .map(toStored)
            .sort(ascending)
            .map(String)
    upsertDataviewInstance(
      filterableDataviews.map((dataview) => ({
        id: dataview.id,
        config: {
          filters: { ...(dataview.config?.filters || {}), [filterKey]: filterValues },
        },
      }))
    )
    trackEvent({
      category: TrackCategory.Tracks,
      action: `Filter vessel tracks by ${filterKey}`,
      label: `${min} - ${max}`,
    })
  }

  if (vesselsTimebarGraph === 'none') {
    return null
  }

  if (!graph) {
    return (
      <div className={styles.legend}>
        <MapLegendPlaceholder />
      </div>
    )
  }

  // The brush can only stand for a filter that every vessel shares.
  // Once one of them is filtered on its own the handles go back to the edges and dim
  const filters = filterableDataviews.map(
    (dataview) => dataview.config?.filters?.[filterKey] as string[] | undefined
  )
  const sharedFilter = filters[0]?.length === 2 ? filters[0] : undefined
  const isShared =
    sharedFilter && filters.every((f) => f?.[0] === sharedFilter[0] && f?.[1] === sharedFilter[1])

  const legend: UILegendColorRamp = {
    id: `${vesselsTimebarGraph}|${filters.map((filter) => filter ?? '').join(';')}`,
    type: LegendType.ColorRampDiscrete,
    label: isDepth ? t((t) => t.eventInfo.depth) : t((t) => t.eventInfo.speed),
    unit: isDepth ? t((t) => t.common.meters) : t((t) => t.common.knots),
    values: graph.steps.map((step) => Math.abs(step.value)),
    colors: isDepth ? VESSEL_GRAPH_COLORS.slice().reverse() : VESSEL_GRAPH_COLORS,
  }

  const displayRange =
    isShared && displayExtent
      ? ([Math.abs(parseFloat(sharedFilter[0])), Math.abs(parseFloat(sharedFilter[1]))].sort(
          ascending
        ) as [number, number])
      : undefined
  // A bound sitting on the graph extent is not a filter anybody applied, and reading it back as
  // undefined is what lets dragging both handles to the edges clear the filter again
  const range = (
    displayRange && displayExtent
      ? [
          displayRange[0] <= displayExtent[0] ? undefined : displayRange[0],
          displayRange[1] >= displayExtent[1] ? undefined : displayRange[1],
        ]
      : [undefined, undefined]
  ) as ColorRampBrushRange

  return (
    <div className={styles.legend}>
      <MapLegend
        layer={legend}
        roundValues={false}
        {...(displayExtent &&
          filterableDataviews.length > 0 && {
            brush: {
              range,
              onChange: onBrushChange,
              handleTooltip: t((t) => t.map.legendBrushHelp),
            },
          })}
      />
    </div>
  )
}

export default VesselTracksLegend
