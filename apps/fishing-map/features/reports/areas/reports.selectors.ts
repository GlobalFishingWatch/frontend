import { createSelector } from '@reduxjs/toolkit'
import { groupBy, sum, uniq, uniqBy } from 'es-toolkit'
import sumBy from 'lodash/sumBy'
import { t } from 'i18next'
import { FeatureCollection, MultiPolygon } from 'geojson'
import { Dataset, DatasetTypes, ReportVessel } from '@globalfishingwatch/api-types'
import { getGeometryDissolved, wrapGeometryBbox } from '@globalfishingwatch/data-transforms'
import {
  selectReportAreaId,
  selectReportDatasetId,
  selectActiveReportDataviews,
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
  selectReportCategory,
  selectReportVesselGraph,
} from 'features/app/selectors/app.reports.selector'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  getDatasetsReportSupported,
  getRelatedDatasetByType,
} from 'features/datasets/datasets.utils'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { getUTCDateTime } from 'utils/dates'
import {
  getBufferedArea,
  getBufferedFeature,
  getReportCategoryFromDataview,
  getVesselsFiltered,
} from 'features/reports/areas/reports.utils'
import { createDeepEqualSelector } from 'utils/selectors'
import { EMPTY_FIELD_PLACEHOLDER, getVesselGearTypeLabel } from 'utils/info'
import { sortStrings } from 'utils/shared'
import { Area, AreaGeometry, selectAreas } from 'features/areas/areas.slice'
import {
  EMPTY_API_VALUES,
  MAX_CATEGORIES,
  OTHERS_CATEGORY_LABEL,
} from 'features/reports/areas/reports.config'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectReportVesselsData, selectReportPreviewBuffer } from './report.slice'
import {
  selectReportVesselFilter,
  selectReportVesselPage,
  selectReportResultsPerPage,
  selectReportActivityGraph,
  selectReportTimeComparison,
} from './reports.config.selectors'
import { ReportCategory } from './reports.types'

const EMPTY_ARRAY: [] = []

type ReportVesselWithMeta = ReportVessel & {
  // Merging detections or hours depending on the activity unit into the same property
  value: number
  sourceColor: string
  activityDatasetId: string
  category: ReportCategory
  dataviewId: string
  flagTranslated: string
  flagTranslatedClean: string
}

export type ReportVesselWithDatasets = Pick<ReportVessel, 'vesselId' | 'shipName'> &
  Partial<ReportVessel> &
  Pick<ReportVesselWithMeta, 'sourceColor' | 'value'> & {
    infoDataset?: Dataset
    trackDataset?: Dataset
    dataviewId?: string
    category?: ReportCategory
    flagTranslatedClean?: string
  }

export const selectReportDataviewsWithPermissions = createDeepEqualSelector(
  [selectActiveReportDataviews, selectUserData],
  (reportDataviews, userData) => {
    return reportDataviews
      .map((dataview) => {
        const supportedDatasets = getDatasetsReportSupported(
          [dataview],
          userData?.permissions || []
        )
        return {
          ...dataview,
          datasets: dataview.datasets?.filter((d) => supportedDatasets.includes(d.id)) as Dataset[],
          filter: dataview.config?.filter || '',
          ...(dataview.config?.['vessel-groups']?.length && {
            vesselGroups: dataview.config?.['vessel-groups'],
          }),
        }
      })
      .filter((dataview) => dataview.datasets!?.length > 0)
  }
)

export const selectReportAreaDataviews = createSelector(
  [selectDataviewInstancesResolved, selectReportDatasetId],
  (dataviewsInstances, datasetId) => {
    const datasetIds = datasetId?.split(',')
    const areaDataview = datasetIds?.flatMap((datasetId) => {
      return (
        dataviewsInstances?.find((dataview) => {
          return dataview.datasets?.some((dataset) => datasetId === dataset.id)
        }) || []
      )
    })
    return areaDataview
  }
)

export const selectReportAreaIds = createSelector(
  [selectReportAreaId, selectReportDatasetId],
  (areaId, datasetId) => {
    return { datasetId, areaId }
  }
)

const selectReportActivityFlatten = createSelector(
  [selectReportVesselsData, selectAllDatasets, selectReportDataviewsWithPermissions],
  (reportDatasets, datasets, dataviews) => {
    if (!dataviews?.length || !reportDatasets?.length) return null

    return reportDatasets.flatMap((dataset, index) =>
      Object.entries(dataset).flatMap(([datasetId, vessels]) => {
        const activityDataset = datasets.find((d) => d.id === datasetId)
        const dataview = dataviews[index]
        if (!dataview) {
          console.warn('Missing dataview for report dataset:', dataset)
          return EMPTY_ARRAY
        }
        return (vessels || ([] as any)).flatMap((vessel) => {
          return {
            ...vessel,
            // Using hours as fallback to keep compatibility with old datasets
            value: (vessel as any)?.[activityDataset?.unit as any] || vessel?.hours,
            shipName: EMPTY_API_VALUES.includes(vessel.shipName)
              ? t('common.unknownVessel', 'Unknown Vessel')
              : vessel.shipName,
            activityDatasetId: datasetId,
            dataviewId: dataview?.id,
            category: getReportCategoryFromDataview(dataview),
            sourceColor: dataview?.config?.color,
          } as ReportVesselWithMeta
        })
      })
    ) as ReportVesselWithMeta[]
  }
)

export const selectReportVesselsNumber = createSelector(
  [selectReportActivityFlatten],
  (vessels) => {
    if (!vessels?.length) return null

    return uniqBy(vessels, (v) => v.vesselId).length
  }
)

export const selectReportVesselsHours = createSelector([selectReportActivityFlatten], (vessels) => {
  if (!vessels?.length) return null
  return vessels.map((vessel) => vessel?.value || 0).reduce((acc, value) => acc + value, 0)
})

export const selectReportVesselsList = createSelector(
  [selectReportActivityFlatten, selectAllDatasets, selectReportCategory],
  (vessels, datasets, reportCategory) => {
    if (!vessels?.length) return null
    return Object.values(groupBy(vessels, (v) => v.vesselId))
      .flatMap((vesselActivity) => {
        if (vesselActivity[0]?.category !== reportCategory) return EMPTY_ARRAY
        const activityDataset = datasets.find((d) => vesselActivity[0].activityDatasetId === d.id)
        const infoDatasetId = getRelatedDatasetByType(activityDataset, DatasetTypes.Vessels)?.id
        const infoDataset = datasets.find((d) => d.id === infoDatasetId)
        const trackDatasetId = getRelatedDatasetByType(
          infoDataset || activityDataset,
          DatasetTypes.Tracks
        )?.id
        const trackDataset = datasets.find((d) => d.id === trackDatasetId)
        return {
          dataviewId: vesselActivity[0]?.dataviewId,
          vesselId: vesselActivity[0]?.vesselId,
          shipName: vesselActivity[0]?.shipName,
          mmsi: vesselActivity[0]?.mmsi,
          flag: vesselActivity[0]?.flag,
          flagTranslated: t(
            `flags:${vesselActivity[0]?.flag as string}` as any,
            vesselActivity[0]?.flag
          ),
          flagTranslatedClean: cleanFlagState(
            t(`flags:${vesselActivity[0]?.flag as string}` as any, vesselActivity[0]?.flag)
          ),
          geartype: cleanVesselOrGearType({
            value: vesselActivity[0]?.geartype,
            property: 'geartype',
          }),
          vesselType: cleanVesselOrGearType({
            value: vesselActivity[0]?.vesselType,
            property: 'vesselType',
          }),
          value: vesselActivity[0]?.value,
          infoDataset,
          trackDataset,
          sourceColor: vesselActivity[0]?.sourceColor,
        } as ReportVesselWithDatasets
      })
      .sort((a, b) => (b.value as number) - (a.value as number))
  }
)

export const selectHasReportVessels = createSelector([selectReportVesselsList], (vessels) => {
  return vessels!?.length > 0
})

export const selectReportVesselsListWithAllInfo = createSelector(
  [selectReportActivityFlatten],
  (vessels) => {
    if (!vessels?.length) return null

    return Object.values(groupBy(vessels, (v) => v.vesselId))
      .map((vesselActivity) => {
        return {
          ...vesselActivity[0],
          value: sumBy(vesselActivity, 'value'),
          flagTranslated: t(
            `flags:${vesselActivity[0]?.flag as string}` as any,
            vesselActivity[0]?.flag
          ),
          flagTranslatedClean: cleanFlagState(
            t(`flags:${vesselActivity[0]?.flag as string}` as any, vesselActivity[0]?.flag)
          ),
          geartype: getVesselGearTypeLabel({ geartypes: vesselActivity[0]?.geartype }),
          vesselType: t(
            `vessel.veeselTypes.${vesselActivity[0]?.vesselType}` as any,
            vesselActivity[0]?.vesselType
          ),
        }
      })
      .sort((a, b) => b.value - a.value)
  }
)

type CleanVesselOrGearTypeParams = { value: string; property: 'geartype' | 'vesselType' }
function cleanVesselOrGearType({ value, property }: CleanVesselOrGearTypeParams) {
  const valuesClean = value ? value?.split(',').filter(Boolean) : [EMPTY_FIELD_PLACEHOLDER]
  const valuesCleanTranslated = valuesClean
    .map((value) => {
      if (property === 'geartype') {
        return getVesselGearTypeLabel({ geartypes: value })
      }
      return t(`vessel.vesselTypes.${value?.toLowerCase()}` as any, value)
    })
    .sort(sortStrings)
  return valuesCleanTranslated.length > 1
    ? valuesCleanTranslated.join('|')
    : valuesCleanTranslated[0]
}

export function cleanFlagState(flagState: string) {
  return flagState.replace(/,/g, '')
}

export const selectReportVesselsFiltered = createSelector(
  [selectReportVesselsList, selectReportVesselFilter],
  (vessels, filter) => {
    if (!vessels?.length) return null
    return getVesselsFiltered<ReportVesselWithDatasets>(vessels, filter).sort(
      (a, b) => b.value - a.value
    )
  }
)

const defaultVesselsList: ReportVesselWithDatasets[] = []
export const selectReportVesselsPaginated = createSelector(
  [selectReportVesselsFiltered, selectReportVesselPage, selectReportResultsPerPage],
  (vessels, page = 0, resultsPerPage) => {
    if (!vessels?.length) return defaultVesselsList
    return vessels.slice(resultsPerPage * page, resultsPerPage * (page + 1))
  }
)

export const selectReportVesselsPagination = createSelector(
  [
    selectReportVesselsPaginated,
    selectReportVesselsFiltered,
    selectReportVesselsList,
    selectReportVesselPage,
    selectReportResultsPerPage,
  ],
  (vessels, allVesselsFiltered, allVessels, page = 0, resultsPerPage) => {
    return {
      page,
      offset: resultsPerPage * page,
      resultsPerPage,
      resultsNumber: vessels!?.length,
      totalFiltered: allVesselsFiltered!?.length,
      total: allVessels!?.length,
    }
  }
)

export const selectShowTimeComparison = createSelector(
  [selectReportActivityGraph],
  (reportActivityGraph) => {
    return reportActivityGraph === 'beforeAfter' || reportActivityGraph === 'periodComparison'
  }
)

export const selectTimeComparisonValues = createSelector(
  [selectReportTimeComparison],
  (timeComparison) => {
    if (!timeComparison) return null

    const end = getUTCDateTime(timeComparison.start)
      .plus({ [timeComparison.durationType]: timeComparison.duration })
      .toISO() as string
    const compareEnd = getUTCDateTime(timeComparison.compareStart)
      .plus({ [timeComparison.durationType]: timeComparison.duration })
      .toISO() as string

    return {
      start: timeComparison.start,
      end,
      compareStart: timeComparison.compareStart,
      compareEnd,
    }
  }
)

const selectReportVesselsGraphData = createSelector(
  [selectReportVesselGraph, selectReportVesselsFiltered, selectReportDataviewsWithPermissions],
  (reportGraph, vesselsFiltered, dataviews) => {
    if (!vesselsFiltered?.length) return null

    const reportData = groupBy(vesselsFiltered, (v) => v.dataviewId || '')

    const dataByDataview = dataviews.map((dataview) => {
      const dataviewData = reportData[dataview.id]
        ? Object.values(reportData[dataview.id]).flatMap((v) => v || [])
        : []
      const dataByKey = groupBy(dataviewData, (d) => d[reportGraph] || '')
      return { id: dataview.id, data: dataByKey }
    })

    const allDistributionKeys = uniq(dataByDataview.flatMap(({ data }) => Object.keys(data)))

    const dataviewIds = dataviews.map((d) => d.id)
    const data = allDistributionKeys
      .flatMap((key) => {
        const distributionData: Record<any, any> = { name: key }
        dataByDataview.forEach(({ id, data }) => {
          distributionData[id] = (data?.[key] || []).length
        })
        if (sum(dataviewIds.map((d) => distributionData[d])) === 0) return EMPTY_ARRAY
        return distributionData
      })
      .sort((a, b) => {
        if (EMPTY_API_VALUES.includes(a.name)) return 1
        if (EMPTY_API_VALUES.includes(b.name)) return -1
        return sum(dataviewIds.map((d: any) => b[d])) - sum(dataviewIds.map((d: any) => a[d]))
      })

    return { distributionKeys: data.map((d) => d.name), data }
  }
)

export const selectReportVesselsGraphDataGrouped = createSelector(
  [selectReportVesselsGraphData, selectReportDataviewsWithPermissions],
  (reportGraph, dataviews) => {
    if (!reportGraph?.data?.length) return null
    if (reportGraph?.distributionKeys.length <= MAX_CATEGORIES) return reportGraph.data
    const dataviewIds = dataviews.map((d) => d.id)
    const top = reportGraph.data.slice(0, MAX_CATEGORIES)
    const rest = reportGraph.data.slice(MAX_CATEGORIES)
    const others = {
      name: OTHERS_CATEGORY_LABEL,
      ...Object.fromEntries(
        dataviewIds.map((dataview) => [dataview, sum(rest.map((key: any) => key[dataview]))])
      ),
    }
    return [...top, others]
  }
)
const defaultOthersLabel: any[] = []
export const selectReportVesselsGraphDataOthers = createSelector(
  [selectReportVesselsGraphData],
  (reportGraph) => {
    if (!reportGraph?.data?.length) return null
    if (reportGraph?.distributionKeys.length <= MAX_CATEGORIES) return defaultOthersLabel
    const others = reportGraph.data.slice(MAX_CATEGORIES)
    return reportGraph.distributionKeys
      .flatMap((key) => {
        const other = others.find((o) => o.name === key)
        if (!other) return EMPTY_ARRAY
        const { name, ...rest } = other
        return { name, value: sum(Object.values(rest)) }
      })
      .sort((a, b) => {
        if (EMPTY_API_VALUES.includes(a.name)) return 1
        if (EMPTY_API_VALUES.includes(b.name)) return -1
        return b.value - a.value
      })
  }
)

const selectCurrentReportArea = createSelector(
  [selectReportAreaIds, selectAreas],
  (areaIds, areas) => {
    if (!areaIds || !areas) return null
    const { datasetId, areaId } = areaIds
    return areas?.[datasetId]?.detail?.[areaId]
  }
)

const selectReportAreaData = createSelector([selectCurrentReportArea], (reportArea) => {
  return reportArea?.data
})

export const selectReportAreaStatus = createSelector([selectCurrentReportArea], (reportArea) => {
  return reportArea?.status
})

export const selectReportAreaName = createSelector(
  [
    selectReportAreaData,
    selectReportBufferUnit,
    selectReportBufferValue,
    selectReportBufferOperation,
  ],
  (area, unit, value, operation) => {
    if (!area) return undefined
    if (!unit || !value || !operation) return area.name
    if (operation === 'difference') return `${value} ${unit} around ${area.name}`
    if (operation === 'dissolve' && value > 0) return `${area.name} and ${value} ${unit} around`
    return `${area.name} minus ${Math.abs(value)} ${unit}`
  }
)

const selectReportAreaDissolved = createSelector([selectReportAreaData], (area) => {
  if (!area) {
    return null
  }
  return {
    ...area,
    properties: {
      ...(area.properties && { ...area.properties }),
      ...(area.geometry?.type && { originalGeometryType: area.geometry.type }),
    },
    geometry: getGeometryDissolved(area.geometry),
  } as Area<FeatureCollection<AreaGeometry>>
})

export const selectReportPreviewBufferFeature = createSelector(
  [selectReportAreaDissolved, selectReportPreviewBuffer],
  (area, buffer) => {
    const { value, unit, operation } = buffer
    if (!area || !unit || !value || !operation) return null
    return getBufferedFeature({ area, value, unit, operation })
  }
)

const selectReportBufferArea = createSelector(
  [
    selectReportAreaDissolved,
    selectReportBufferUnit,
    selectReportBufferValue,
    selectReportBufferOperation,
  ],
  (area, unit, value, operation) => {
    if (!area || !unit || !value) return null
    const bufferedArea = getBufferedArea({ area, value, unit, operation }) as Area
    if (bufferedArea?.geometry) {
      const bounds = wrapGeometryBbox(bufferedArea.geometry as MultiPolygon)
      // bbox is needed inside Area geometry to computeTimeseries
      // fishing-map/features/reports/areas/reports-timeseries.hooks.ts
      bufferedArea.geometry.bbox = bounds
    }
    return bufferedArea
  }
)

export const selectReportBufferHash = createSelector(
  [selectReportBufferOperation, selectReportBufferUnit, selectReportBufferValue],
  (operation, unit, value) => {
    return [unit, value, operation].filter(Boolean).join(',')
  }
)

export const selectReportBufferFeature = createSelector(
  [
    selectReportAreaDissolved,
    selectReportBufferUnit,
    selectReportBufferValue,
    selectReportBufferOperation,
  ],
  (area, unit, value, operation) => {
    if (!area || !unit || !value || !operation) return null
    return getBufferedFeature({ area, value, unit, operation, properties: { highlighted: true } })
  }
)

export const selectHasReportBuffer = createSelector(
  [selectReportBufferUnit, selectReportBufferValue],
  (unit, value): Boolean => {
    return unit !== undefined && value !== undefined
  }
)

export const selectReportArea = createSelector(
  [selectReportAreaData, selectHasReportBuffer, selectReportBufferArea],
  (area, hasReportBuffer, bufferedArea) => {
    if (!area) return null
    if (!hasReportBuffer) return area
    return bufferedArea
  }
)
