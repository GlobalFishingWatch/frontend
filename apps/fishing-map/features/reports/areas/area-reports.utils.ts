import { featureCollection, multiPolygon } from '@turf/helpers'
import { difference, dissolve } from '@turf/turf'
import { format } from 'd3-format'
import { uniq } from 'es-toolkit'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { DateTime } from 'luxon'
import { matchSorter } from 'match-sorter'
import { parse } from 'qs'
import type { Bbox, BufferOperation, BufferUnit, WorkspaceState } from 'types'

import { API_VERSION } from '@globalfishingwatch/api-client'
import type { Dataview, Workspace } from '@globalfishingwatch/api-types'
import { DataviewCategory, EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import { getFeatureBuffer, wrapGeometryBbox } from '@globalfishingwatch/data-transforms'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type { Area, AreaGeometry } from 'features/areas/areas.slice'
import type { SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import {
  getSchemaFieldsSelectedInDataview,
  getSchemaFilterOperationInDataview,
} from 'features/datasets/datasets.utils'
import { t } from 'features/i18n/i18n'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import type { VesselGroupReportVesselParsed } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.types'
import type { VesselLastIdentity } from 'features/search/search.slice'
import { formatInfoField } from 'utils/info'
import { sortStrings } from 'utils/shared'

import type { FilterProperty } from '../vessel-groups/vessel-group-report.config'
import {
  FILTER_PROPERTIES,
  OTHER_CATEGORY_LABEL,
} from '../vessel-groups/vessel-group-report.config'
import type { VesselGroupVesselTableParsed } from '../vessel-groups/vessels/vessel-group-report-vessels.selectors'

import {
  DEFAULT_BUFFER_OPERATION,
  DEFAULT_POINT_BUFFER_UNIT,
  DEFAULT_POINT_BUFFER_VALUE,
  DIFFERENCE,
  REPORT_BUFFER_FEATURE_ID,
} from './area-reports.config'
import type { ReportVesselWithDatasets } from './area-reports.selectors'
import type { ReportCategory } from './area-reports.types'

const ALWAYS_SHOWN_FILTERS = ['vessel-groups']

export function getWorkspaceReport(workspace: Workspace<WorkspaceState>, daysFromLatest?: number) {
  const { ownerId, createdAt, ownerType, viewAccess, editAccess, state, ...workspaceProperties } =
    workspace

  return { ...workspaceProperties, state: { ...state, daysFromLatest } }
}

export const tickFormatter = (tick: number) => {
  const formatter = tick < 1 && tick > -1 ? '~r' : '~s'
  return format(formatter)(tick)
}

export const formatDate = (date: DateTime, timeChunkInterval: FourwingsInterval | string) => {
  let formattedLabel = ''
  switch (timeChunkInterval) {
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

const getSerializedDatasets = (dataview: UrlDataviewInstance) => {
  return dataview.config?.datasets?.slice().sort(sortStrings).join(', ')
}

const getSerializedFilterFields = (dataview: UrlDataviewInstance, filterKey: string): string => {
  const values = dataview.config?.filters?.[filterKey]
  return Array.isArray(values) ? values?.slice().sort(sortStrings).join(', ') : values
}

export const FIELDS: [SupportedDatasetSchema, string, string][] = [
  ['geartype', 'layer.gearType_other', 'Gear types'],
  ['vessel-groups', 'vesselGroup.vesselGroup', 'Vessel Group'],
  ['origin', 'vessel.origin', 'Origin'],
  ['target_species', 'vessel.targetSpecies', 'Target species'],
  ['codMarinha', 'vessel.codMarinha', 'Cod Marinha'],
  ['fleet', 'vessel.fleet', 'Fleet'],
  ['license_category', 'vessel.license_category', 'License category'],
  ['casco', 'vessel.casco', 'Casco'],
  ['matched', 'vessel.matched', 'Match'],
  ['radiance', 'layer.radiance', 'Radiance'],
  ['neural_vessel_type', 'vessel.neural_vessel_type', 'SAR vessel type'],
  ['vessel_type', 'vessel.vesselType_other', 'Vessel types'],
  ['speed', 'layer.speed', 'Speed'],
]

export const getCommonProperties = (dataviews: UrlDataviewInstance[]) => {
  const commonProperties: string[] = []

  if (dataviews && dataviews?.length > 1) {
    if (
      dataviews?.every((dataview) => dataview.category === dataviews[0].category) &&
      dataviews?.every((dataview) => dataview.name === dataviews[0].name)
    ) {
      commonProperties.push('dataset')
    }

    const firstDataviewDatasets = getSerializedDatasets(dataviews[0])
    if (
      dataviews?.every((dataview) => {
        const datasets = getSerializedDatasets(dataview)
        return datasets === firstDataviewDatasets
      })
    ) {
      commonProperties.push('source')
    }

    const firstDataviewFlags = getSerializedFilterFields(dataviews[0], 'flag')
    const firstDataviewFlagOperator = getSchemaFilterOperationInDataview(dataviews[0], 'flag')
    if (
      dataviews?.every((dataview) => {
        const flags = getSerializedFilterFields(dataview, 'flag')
        const flagOperator = getSchemaFilterOperationInDataview(dataview, 'flag')
        return flags === firstDataviewFlags && flagOperator === firstDataviewFlagOperator
      })
    ) {
      commonProperties.push('flag')
    }

    // Collect common filters that are not 'flag' and 'vessel-groups'
    // as we will have the vessel-group in all of them when added from report
    const firstDataviewGenericFilterKeys =
      dataviews[0].config && dataviews[0].config?.filters
        ? (Object.keys(dataviews[0].config?.filters) as SupportedDatasetSchema[]).filter(
            (key) => key !== 'flag' && key !== 'vessel-groups'
          )
        : ([] as SupportedDatasetSchema[])

    const genericFilters: Record<string, string>[] = []
    const genericExcludedFilters: Record<string, string>[] = []
    firstDataviewGenericFilterKeys.forEach((filterKey) => {
      const firstDataviewGenericFilterFields = getSerializedFilterFields(dataviews[0], filterKey)
      if (
        dataviews?.every((dataview) => {
          const genericFilterFields = getSerializedFilterFields(dataview, filterKey)
          return genericFilterFields === firstDataviewGenericFilterFields
        }) &&
        !ALWAYS_SHOWN_FILTERS.includes(filterKey)
      ) {
        const keyLabelField = FIELDS.find((field) => field[0] === filterKey)
        const keyLabel = keyLabelField
          ? t(keyLabelField[1] as any, keyLabelField[2] as string).toLocaleLowerCase()
          : filterKey

        const valuesLabel = getSchemaFieldsSelectedInDataview(
          dataviews[0],
          filterKey as SupportedDatasetSchema
        )
          .map((f: any) => f.label?.toLocaleLowerCase())
          .join(', ')

        if (getSchemaFilterOperationInDataview(dataviews[0], filterKey) === EXCLUDE_FILTER_ID) {
          genericExcludedFilters.push({
            keyLabel,
            valuesLabel,
          })
        } else {
          genericFilters.push({
            keyLabel,
            valuesLabel,
          })
        }
        commonProperties.push(filterKey)
      }
    })
  }

  return commonProperties
}

export const getReportCategoryFromDataview = (
  dataview: Dataview | UrlDataviewInstance
): ReportCategory => {
  return dataview.category === DataviewCategory.Activity
    ? (dataview.datasets?.[0]?.subcategory as unknown as ReportCategory)
    : (dataview.category as unknown as ReportCategory)
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
  unit = DEFAULT_POINT_BUFFER_UNIT,
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
    label: t('analysis.bufferedArea', {
      value,
      unit,
      defaultValue: '{{value}} {{unit}} buffered area',
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
        .join(', ') || OTHER_CATEGORY_LABEL,
    shiptype:
      uniq(identity.shiptypes || [])
        .sort()
        .map((g) => formatInfoField(g, 'shiptypes'))
        .join(', ') || OTHER_CATEGORY_LABEL,
    flagTranslated: t(`flags:${identity.flag as string}` as any),
  }
}

export function getVesselsFiltered<
  Vessel = ReportVesselWithDatasets | VesselGroupReportVesselParsed | VesselGroupVesselTableParsed,
>(vessels: Vessel[], filter: string, filterProperties = FILTER_PROPERTIES) {
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
    const propertiesToMatch =
      block.includes(':') && filterProperties[block.split(':')[0] as FilterProperty]
    const words = (propertiesToMatch ? (block.split(':')[1] as FilterProperty) : block)
      .replace('-', '')
      .split('|')
      .map((word) => word.trim())
      .filter((word) => word.length)
    const matched = words.flatMap((w) =>
      matchSorter(vessels, w, {
        keys: propertiesToMatch || Object.values(filterProperties).flat(),
        threshold: matchSorter.rankings.CONTAINS,
      })
    )
    const uniqMatched = block.includes('|') ? Array.from(new Set([...matched])) : matched
    if (block.startsWith('-')) {
      const uniqMatchedIds = new Set<string>()
      uniqMatched.forEach((vessel) => {
        const id =
          (vessel as ReportVesselWithDatasets).vesselId ||
          (vessel as VesselGroupReportVesselParsed).id
        uniqMatchedIds.add(id)
      })
      return vessels.filter((vessel) => {
        const id =
          (vessel as ReportVesselWithDatasets).vesselId ||
          (vessel as VesselGroupReportVesselParsed).id
        return !uniqMatchedIds.has(id)
      })
    } else {
      return uniqMatched
    }
  }, vessels) as Vessel[]
}
