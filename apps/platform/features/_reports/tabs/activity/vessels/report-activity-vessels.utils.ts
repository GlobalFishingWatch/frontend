import { groupBy, sum } from 'es-toolkit'

import type { DatasetFilter, FilterOperator } from '@globalfishingwatch/api-types'
import { INCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import { getFlattenDatasetFilters } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getDataviewFilters } from '@globalfishingwatch/dataviews-client'

// Filters that keep or drop all of a vessel's activity, so a vessel matching two sublayers has the same hours in both.
// Any other filter (speed, distance_from_port_km, elevation_m, …) keeps only part of a vessel's positions.
const VESSEL_LEVEL_FILTERS = new Set([
  'flag',
  'geartype',
  'vessel_type',
  'vessel-groups',
  'vessel_id',
  'origin',
  'source_fleet',
])

type SublayerFilter = {
  values: (string | number)[]
  operator: FilterOperator
  schema?: DatasetFilter
}

export type SublayerFilters = Record<string, SublayerFilter>

export const getSublayerFilters = (
  dataview: UrlDataviewInstance,
  { withVesselLevel = false } = {}
): SublayerFilters => {
  const schemas = (dataview.datasets || []).flatMap((d) => getFlattenDatasetFilters(d.filters))
  return Object.fromEntries(
    Object.entries(getDataviewFilters(dataview)).flatMap(([id, value]) => {
      const values = Array.isArray(value) ? value : value ? [value] : []
      if ((!withVesselLevel && VESSEL_LEVEL_FILTERS.has(id)) || !values.length) {
        return []
      }
      const filter: SublayerFilter = {
        values,
        operator: dataview.config?.filterOperators?.[id] || INCLUDE_FILTER_ID,
        schema: schemas.find((s) => s.id === id),
      }
      return [[id, filter]]
    })
  )
}

/** Whether every position that filter `b` keeps is also kept by filter `a` */
const filterTotalOverlap = (a: SublayerFilter | undefined, b: SublayerFilter | undefined) => {
  if (!a) {
    return true
  }
  if (!b) {
    return false
  }
  const { type, operation } = a.schema || {}
  if (type === 'range') {
    return (
      Number(a.values[0]) <= Number(b.values[0]) &&
      Number(a.values.at(-1)) >= Number(b.values.at(-1))
    )
  }
  if (type === 'number' && operation) {
    const [aValue, bValue] = [Number(a.values[0]), Number(b.values[0])]
    return operation === 'gte' || operation === 'gt' ? aValue <= bValue : aValue >= bValue
  }
  // Sets: including more, or excluding less, keeps more. Mixed operators count as not contained.
  if (a.operator !== b.operator) {
    return false
  }
  const [outer, inner] = a.operator === INCLUDE_FILTER_ID ? [a, b] : [b, a]
  const outerValues = new Set(outer.values.map(String))
  return inner.values.every((v) => outerValues.has(String(v)))
}

/** Whether sublayer `a` keeps every position sublayer `b` keeps, for a vessel matching both */
export const sublayerFiltersTotalOverlap = (a: SublayerFilters, b: SublayerFilters) =>
  Object.keys({ ...a, ...b }).every((id) => filterTotalOverlap(a[id], b[id]))

/** Whether no position kept by filter `a` is kept by filter `b` */
const filterNonOverlapping = (a: SublayerFilter, b: SublayerFilter) => {
  const { type, operation } = a.schema || {}
  if (type === 'range') {
    const [aMin, aMax, bMin, bMax] = [a.values[0], a.values.at(-1), b.values[0], b.values.at(-1)]
    return Number(aMax) < Number(bMin) || Number(bMax) < Number(aMin)
  }
  // Two thresholds of the same operation always share the values past the larger one
  if (type === 'number' && operation) {
    return false
  }
  // Sets: exclude keeps the rows without a value, so two excludes always share those
  if (a.operator !== INCLUDE_FILTER_ID && b.operator !== INCLUDE_FILTER_ID) {
    return false
  }
  const [included, other] = a.operator === INCLUDE_FILTER_ID ? [a, b] : [b, a]
  const otherValues = new Set(other.values.map(String))
  return other.operator === INCLUDE_FILTER_ID
    ? !included.values.some((v) => otherValues.has(String(v)))
    : included.values.every((v) => otherValues.has(String(v)))
}

/** Whether sublayers `a` and `b` share no position: some filter they both set keeps different ones */
export const sublayerFiltersNonOverlapping = (a: SublayerFilters, b: SublayerFilters) =>
  Object.keys(a).some((id) => b[id] && filterNonOverlapping(a[id], b[id]))

/**
 * The sublayers whose values add up to an exact total, or null when that is unknown.
 */
const getCountedSublayers = <T>(
  sublayers: T[],
  { overlaps, contains }: { overlaps: (a: T, b: T) => boolean; contains: (a: T, b: T) => boolean }
): T[] | null => {
  let groups: T[][] = []
  sublayers.forEach((sublayer) => {
    const overlapping = groups.filter((group) => group.some((other) => overlaps(other, sublayer)))
    groups = [
      ...groups.filter((group) => !overlapping.includes(group)),
      [...overlapping.flat(), sublayer],
    ]
  })
  const counted = groups.flatMap((group) => {
    const container = group.find((outer) => group.every((inner) => contains(outer, inner)))
    return container ? [container] : []
  })
  return counted.length === groups.length ? counted : null
}

export const getFiltersByDataview = (dataviews: UrlDataviewInstance[]) =>
  Object.fromEntries(dataviews.map((dataview) => [dataview.id, getSublayerFilters(dataview)]))

const getVesselCountedRows = <R extends { dataviewId: string }>(
  vesselRows: R[],
  filtersByDataview: Record<string, SublayerFilters>
) => {
  const filtered = vesselRows.map((row) => ({
    row,
    filters: filtersByDataview[row.dataviewId] || {},
  }))
  const counted = getCountedSublayers(filtered, {
    overlaps: (a, b) => !sublayerFiltersNonOverlapping(a.filters, b.filters),
    contains: (a, b) => sublayerFiltersTotalOverlap(a.filters, b.filters),
  })
  return counted?.map(({ row }) => row) ?? null
}

/**
 * A vessel's value across its sublayers: the exact sum when known, otherwise its largest value,
 * the closest lower bound (the summary then shows the hours by layer).
 */
export const getVesselValue = <R extends { dataviewId: string; value?: number }>(
  vesselRows: R[],
  filtersByDataview: Record<string, SublayerFilters>
) => {
  const counted = getVesselCountedRows(vesselRows, filtersByDataview)
  return counted
    ? sum(counted.map((row) => row.value || 0))
    : Math.max(...vesselRows.map((row) => row.value || 0))
}

/**
 * How the report summary shows the hours:
 * - `total`: every vessel's hours are exact, so one total that counts each vessel once is exact.
 * - `byLayer`: some vessel's total is unknown, so show each sublayer's hours and their sum, which
 *   counts that vessel's shared activity more than once.
 */
export type ReportHoursMode = 'total' | 'byLayer'

type VesselSublayerRow = { vesselId: string; dataviewId: string }

type TilesSublayer = { id: string; datasetIds: string[]; filters: SublayerFilters }

const getTilesSublayer = (dataview: UrlDataviewInstance): TilesSublayer => ({
  id: dataview.id,
  // Same active datasets as the heatmap sublayer (getFourwingsDataviewSublayers)
  datasetIds: (dataview.datasets || [])
    .map((dataset) => dataset.id)
    .filter((id) => !dataview.config?.datasets || dataview.config.datasets.includes(id)),
  filters: getSublayerFilters(dataview, { withVesselLevel: true }),
})

const sharesDataset = (a: TilesSublayer, b: TilesSublayer) =>
  a.datasetIds.some((id) => b.datasetIds.includes(id))

/** Whether sublayer `a` keeps every cell value sublayer `b` keeps */
const tilesSublayerTotalOverlap = (a: TilesSublayer, b: TilesSublayer) =>
  b.datasetIds.every((id) => a.datasetIds.includes(id)) &&
  sublayerFiltersTotalOverlap(a.filters, b.filters)

export type TilesHoursMode = { mode: 'total'; sublayerIds: string[] } | { mode: 'byLayer' }

export const getTilesHoursMode = (dataviews: UrlDataviewInstance[]): TilesHoursMode => {
  const counted = getCountedSublayers(dataviews.map(getTilesSublayer), {
    overlaps: (a, b) => sharesDataset(a, b) && !sublayerFiltersNonOverlapping(a.filters, b.filters),
    contains: tilesSublayerTotalOverlap,
  })
  return counted
    ? { mode: 'total', sublayerIds: counted.map((sublayer) => sublayer.id) }
    : { mode: 'byLayer' }
}

const isUnmatchedDetectionsRow = (row: VesselSublayerRow) => !row.vesselId

/** Tiles rule over the sublayers that have an unmatched detections row */
const getUnmatchedDetectionsTilesMode = (
  rows: VesselSublayerRow[],
  dataviews: UrlDataviewInstance[]
) => {
  const ids = new Set(rows.filter(isUnmatchedDetectionsRow).map((row) => row.dataviewId))
  return ids.size ? getTilesHoursMode(dataviews.filter((dataview) => ids.has(dataview.id))) : null
}

export const getReportHoursMode = (
  rows: VesselSublayerRow[],
  dataviews: UrlDataviewInstance[]
): ReportHoursMode => {
  if (getUnmatchedDetectionsTilesMode(rows, dataviews)?.mode === 'byLayer') {
    return 'byLayer'
  }
  const filtersByDataview = getFiltersByDataview(dataviews)
  const matchedRows = rows.filter((row) => !isUnmatchedDetectionsRow(row))
  const isExact = Object.values(groupBy(matchedRows, (row) => row.vesselId)).every(
    (vesselRows) => getVesselCountedRows(vesselRows, filtersByDataview) !== null
  )
  return isExact ? 'total' : 'byLayer'
}

export const getUnmatchedDetections = (
  rows: (VesselSublayerRow & { value?: number })[],
  dataviews: UrlDataviewInstance[]
) => {
  const tilesMode = getUnmatchedDetectionsTilesMode(rows, dataviews)
  if (!tilesMode) {
    return 0
  }
  const unmatchedDetections = rows.filter(isUnmatchedDetectionsRow)
  const counted =
    tilesMode.mode === 'total'
      ? unmatchedDetections.filter((row) => tilesMode.sublayerIds.includes(row.dataviewId))
      : unmatchedDetections
  return sum(counted.map((row) => row.value || 0))
}

export const getHoursByLayer = (
  rows: (VesselSublayerRow & { value?: number })[],
  dataviews: UrlDataviewInstance[]
) => {
  const rowsByDataview = groupBy(rows, (row) => row.dataviewId)
  return dataviews.flatMap((dataview) => {
    const dataviewRows = rowsByDataview[dataview.id]
    if (!dataviewRows?.length) {
      return []
    }
    return [
      {
        color: dataview.config?.color,
        hours: sum(dataviewRows.map((row) => row.value || 0)),
      },
    ]
  })
}
