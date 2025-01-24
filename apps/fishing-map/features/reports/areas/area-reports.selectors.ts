import { createSelector } from '@reduxjs/toolkit'
import type { FeatureCollection, MultiPolygon } from 'geojson'
import { t } from 'i18next'

import type { Dataset, ReportVessel } from '@globalfishingwatch/api-types'
import { getGeometryDissolved, wrapGeometryBbox } from '@globalfishingwatch/data-transforms'

import {
  selectCurrentReport,
  selectReportAreaId,
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
  selectReportDatasetId,
} from 'features/app/selectors/app.reports.selector'
import type { Area, AreaGeometry } from 'features/areas/areas.slice'
import { selectAreas } from 'features/areas/areas.slice'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getDatasetsReportSupported } from 'features/datasets/datasets.utils'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import {
  EMPTY_API_VALUES,
  ENTIRE_WORLD_REPORT_AREA,
} from 'features/reports/areas/area-reports.config'
import {
  getBufferedArea,
  getBufferedFeature,
  getReportCategoryFromDataview,
} from 'features/reports/areas/area-reports.utils'
import {
  selectReportPreviewBuffer,
  selectReportVesselsData,
} from 'features/reports/shared/activity/reports-activity.slice'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { selectIsVesselGroupReportLocation } from 'routes/routes.selectors'
import { getUTCDateTime } from 'utils/dates'
import { createDeepEqualSelector } from 'utils/selectors'

import {
  selectReportActivityGraph,
  selectReportTimeComparison,
} from './area-reports.config.selectors'
import type { ReportCategory, ReportTimeComparisonValues } from './area-reports.types'

const EMPTY_ARRAY: [] = []

type ReportVesselWithMeta = ReportVessel & {
  // Merging detections or hours depending on the activity unit into the same property
  value: number
  color: string
  activityDatasetId: string
  category: ReportCategory
  dataviewId: string
  flagTranslated: string
  flagTranslatedClean: string
}

export type ReportVesselWithDatasets = Pick<ReportVessel, 'vesselId' | 'shipName'> &
  Partial<ReportVessel> &
  Pick<ReportVesselWithMeta, 'color' | 'value'> & {
    infoDataset?: Dataset
    trackDataset?: Dataset
    dataviewId?: string
    category?: ReportCategory
    flagTranslatedClean?: string
  }

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

export const selectIsReportOwner = createSelector(
  [selectCurrentReport, selectUserData],
  (report, userData) => {
    return report?.ownerId === userData?.id
  }
)

export const selectReportAreaIds = createSelector(
  [selectReportAreaId, selectReportDatasetId],
  (areaId, datasetId) => {
    return { datasetId, areaId }
  }
)

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
      .filter((dataview) => dataview.datasets?.length > 0)
  }
)

export const selectReportActivityFlatten = createSelector(
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
            color: dataview?.config?.color,
            category: getReportCategoryFromDataview(dataview),
          } as ReportVesselWithMeta
        })
      })
    ) as ReportVesselWithMeta[]
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
  (timeComparison): ReportTimeComparisonValues | undefined => {
    if (!timeComparison?.start || !timeComparison.compareStart) return

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
  (unit, value): boolean => {
    return unit !== undefined && value !== undefined
  }
)

export const selectReportArea = createSelector(
  [
    selectReportAreaData,
    selectHasReportBuffer,
    selectReportBufferArea,
    selectIsVesselGroupReportLocation,
  ],
  (area, hasReportBuffer, bufferedArea, isVesselGroupReportLocation) => {
    if (isVesselGroupReportLocation) {
      return ENTIRE_WORLD_REPORT_AREA
    }
    if (hasReportBuffer) {
      return bufferedArea
    }
    return area
  }
)
