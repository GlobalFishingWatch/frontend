import { difference, dissolve, featureCollection, multiPolygon } from '@turf/turf'
import { uniq } from 'es-toolkit'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { DateTime } from 'luxon'
import { matchSorter } from 'match-sorter'
import { parse } from 'qs'

import { API_VERSION } from '@globalfishingwatch/api-client'
import {
  DatasetCategory,
  type Dataview,
  DataviewCategory,
  DataviewType,
} from '@globalfishingwatch/api-types'
import { getFeatureBuffer, wrapGeometryBbox } from '@globalfishingwatch/data-transforms'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type {
  ReportActivitySubCategory,
  ReportDetectionsSubCategory,
} from 'features/_reports/reports.types'
import { ReportCategory } from 'features/_reports/reports.types'
import type { FilterProperty } from 'features/_reports/shared/vessels/report-vessels.config'
import { FILTER_PROPERTIES } from 'features/_reports/shared/vessels/report-vessels.config'
import type { ReportTableVessel } from 'features/_reports/shared/vessels/report-vessels.types'
import type { VesselLastIdentity } from 'features/_vessels/search/search.slice'
import type { Area, AreaGeometry } from 'features/data/areas/areas.slice'
import type { FeatureFlag } from 'features/debug/debug.slice'
import { t } from 'features/i18n/i18n'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'
import type { Bbox, BufferOperation, BufferUnit } from 'types'
import { formatInfoField, MULTI_VALUE_SEPARATOR } from 'utils/info'

import {
  DEFAULT_BUFFER_OPERATION,
  DEFAULT_BUFFER_UNIT,
  OTHERS_CATEGORY_LABEL,
} from '../reports.config'

import {
  DEFAULT_POINT_BUFFER_VALUE,
  DIFFERENCE,
  REPORT_BUFFER_FEATURE_ID,
} from './area-reports.config'
import type { ReportVesselWithDatasets } from './area-reports.selectors'

/**
 * Re-exported so consumers that already import these from here keep working. Modules in the
 * always-loaded route graph (the dataview selectors) must import from report-dataview-category.utils
 * directly instead — this module pulls @turf/turf and match-sorter.
 */
export {
  getReportCategoryFromDataview,
  getReportSubCategoryFromDataview,
  isContextDataviewReportSupported,
  isPointsDataviewReportSupported,
  isPolygonsDataviewReportSupported,
  isSupportedComparisonDataview,
  isSupportedReportDataview,
} from 'features/_reports/report-dataview-category.utils'

export const tickFormatter = (tick: number) => {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(tick)
}

export const formatDate = (date: DateTime, timeChunkInterval: FourwingsInterval | string) => {
  let formattedLabel = ''
  switch (timeChunkInterval.toLowerCase()) {
    case 'year':
    case 'years':
      formattedLabel += date.toFormat('y')
      break
    case 'month':
    case 'months':
      formattedLabel += date.toFormat('LLLL y')
      break
    case 'day':
    case 'days':
      formattedLabel += date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      break
    default:
      formattedLabel += date.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
      break
  }
  return formattedLabel
}

export const formatTooltipValue = (value: number, unit: string, asDifference = false) => {
  if (value === undefined) {
    return null
  }
  const valueFormatted = formatI18nNumber(value, { maximumFractionDigits: 2 })
  const valueLabel = `${value > 0 && asDifference ? '+' : ''}${valueFormatted} ${unit ? unit : ''}`
  return valueLabel
}

type BufferedAreaParams = {
  area: Area<FeatureCollection<AreaGeometry>> | undefined
  value: number
  unit: BufferUnit
  operation?: BufferOperation
  properties?: Record<string, any>
}
// Area is needed to generate all report results
export const getBufferedArea = ({
  area,
  value,
  unit,
  operation,
}: BufferedAreaParams): Area | null => {
  if (!area) return null
  const bufferedFeature = getBufferedFeature({ area, value, unit, operation })
  return { ...area, id: REPORT_BUFFER_FEATURE_ID, geometry: bufferedFeature?.geometry } as Area
}

export const getBufferedAreaBbox = ({
  area,
  value = DEFAULT_POINT_BUFFER_VALUE,
  unit = DEFAULT_BUFFER_UNIT,
  operation = DEFAULT_BUFFER_OPERATION,
}: BufferedAreaParams): Bbox | undefined => {
  const bufferedFeature = getBufferedFeature({
    area,
    value,
    unit,
    operation,
  })
  return bufferedFeature?.geometry
    ? wrapGeometryBbox(bufferedFeature.geometry as MultiPolygon)
    : undefined
}

// Feature is handled to Polygon generator to be displayed on the map
export const getBufferedFeature = ({
  area,
  value,
  unit,
  operation,
  properties = {},
}: BufferedAreaParams): Feature | null => {
  if (!area?.geometry) return null
  const bufferedFeatures = getFeatureBuffer(area.geometry.features, { unit, value })

  if (!bufferedFeatures.length) return null

  const featureProperties = {
    ...properties,
    id: REPORT_BUFFER_FEATURE_ID,
    value: 'buffer',
    label: t((t) => t.analysis.bufferedArea, {
      value: String(value),
      unit,
    }),
  }
  const dissolvedBufferedPolygonsFeatures = multiPolygon(
    dissolve(featureCollection(bufferedFeatures)).features.map((f) => f.geometry.coordinates),
    featureProperties
  )

  if (operation === DIFFERENCE) {
    const multi = multiPolygon(
      area.geometry.features.map((f) => (f as Feature<Polygon>).geometry.coordinates)
    )
    const diff = difference(featureCollection([dissolvedBufferedPolygonsFeatures, multi]))
    if (diff) {
      diff.properties = {
        ...diff.properties,
        ...featureProperties,
      }
    }
    return diff
  }

  return dissolvedBufferedPolygonsFeatures
}

export const parseReportUrl = (url: string) => {
  const reportConfig = parse(url.replace(`/${API_VERSION}/4wings/report?`, ''))
  return {
    id: reportConfig['region-id'],
    dataset: reportConfig['region-dataset'],
    start: (reportConfig['date-range'] as string)?.split(',')[0],
    end: (reportConfig['date-range'] as string)?.split(',')[1],
    datasets: reportConfig.datasets,
  }
}

export function normalizeVesselProperties(identity: VesselLastIdentity) {
  return {
    shipName: formatInfoField(identity.shipname, 'shipname') as string,
    geartype:
      uniq(identity.geartypes || [])
        .sort()
        .map((g) => formatInfoField(g, 'geartypes'))
        .join(MULTI_VALUE_SEPARATOR) || OTHERS_CATEGORY_LABEL,
    shiptype:
      uniq(identity.shiptypes || [])
        .sort()
        .map((g) => formatInfoField(g, 'shiptypes'))
        .join(MULTI_VALUE_SEPARATOR) || OTHERS_CATEGORY_LABEL,
    flagTranslated: t((t) => t[identity.flag as string], { ns: 'flags' }),
  }
}

const EXACT_MATCH_FILTER_PROPERTIES: FilterProperty[] = ['gear', 'type']

export function getVesselsFiltered<Vessel = ReportVesselWithDatasets | ReportTableVessel>(
  vessels: Vessel[],
  filter: string,
  filterProperties = FILTER_PROPERTIES
) {
  if (!filter || !filter.length) {
    return vessels
  }

  const filterBlocks = filter
    .replace(/ ,/g, ',')
    .replace(/ , /g, ',')
    .replace(/, /g, ',')
    .split(',')
    .filter((block) => block.length)

  if (!filterBlocks.length) {
    return vessels
  }

  return filterBlocks.reduce((vessels, block) => {
    const property = block.includes(':') ? block.split(':')[0].replace('-', '') : undefined
    const propertiesToMatch = property && filterProperties[property as FilterProperty]
    const words = (propertiesToMatch ? (block.split(':')[1] as FilterProperty) : block)
      .replace('-', '')
      .split('|')
      .map((word) => word.trim())
      .filter((word) => word.length)
    const matched =
      propertiesToMatch && EXACT_MATCH_FILTER_PROPERTIES.includes(property as FilterProperty)
        ? words.flatMap((word) =>
            vessels.filter((vessel) =>
              propertiesToMatch.some((key) =>
                String((vessel as any)[key] ?? '')
                  .split(MULTI_VALUE_SEPARATOR)
                  .some((label) => label.toLowerCase() === word.toLowerCase())
              )
            )
          )
        : words.flatMap((w) =>
            matchSorter(vessels, w, {
              keys: propertiesToMatch || Object.values(filterProperties).flat(),
              threshold: matchSorter.rankings.CONTAINS,
            })
          )
    const uniqMatched = block.includes('|') ? Array.from(new Set([...matched])) : matched
    if (block.startsWith('-')) {
      const uniqMatchedIds = new Set<string>()
      uniqMatched.forEach((vessel) => {
        const id = (vessel as ReportVesselWithDatasets).vesselId || (vessel as ReportTableVessel).id
        uniqMatchedIds.add(id)
      })
      return vessels.filter((vessel) => {
        const id = (vessel as ReportVesselWithDatasets).vesselId || (vessel as ReportTableVessel).id
        return !uniqMatchedIds.has(id)
      })
    } else {
      return uniqMatched
    }
  }, vessels) as Vessel[]
}

// cleanAggregateByPropertyDataviewFromReport moved to features/_reports/report-dataview-cleaners.ts —
// workspace.utils.ts is its only consumer, and importing it from here dragged @turf/turf and
// match-sorter into the reducer map.
