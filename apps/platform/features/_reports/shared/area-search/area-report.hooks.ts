import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from '@tanstack/react-router'

import type { Dataview } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { OceanArea } from '@globalfishingwatch/ocean-areas'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'

import { OCEAN_AREAS_DATAVIEWS } from 'data/map/dataviews'
import { selectAllDataviews } from 'features/_map/dataviews/dataviews.slice'
import { getDataviewInstanceFromDataview } from 'features/_map/dataviews/dataviews.utils'
import { selectContextAreasDataviews } from 'features/_map/dataviews/selectors/dataviews.categories.selectors'
import { selectWorkspace } from 'features/_map/workspace/workspace.selectors'
import { ReportCategory } from 'features/_reports/reports.types'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

const mergeDataviewInstances = (
  dataviewInstances: QueryParams['dataviewInstances'],
  newDataviewInstance: UrlDataviewInstance
): UrlDataviewInstance[] => {
  const prevInstances = dataviewInstances || []
  const dataviewInstance = prevInstances.find(
    (d: UrlDataviewInstance) => d.id === newDataviewInstance.id
  )
  if (dataviewInstance) {
    return prevInstances.map((d: UrlDataviewInstance) =>
      d.id === dataviewInstance.id ? { ...d, config: { ...d.config, visible: true } } : d
    )
  }
  return [...prevInstances, { ...newDataviewInstance, config: { visible: true } }]
}

export function useNavigateToAreaReport() {
  const router = useRouter()
  const workspace = useSelector(selectWorkspace)
  const contextAreasDataviews = useSelector(selectContextAreasDataviews)
  const allDataviews = useSelector(selectAllDataviews)

  return useCallback(
    (area: OceanArea) => {
      const dataview: Dataview | UrlDataviewInstance | undefined =
        contextAreasDataviews?.find((dataview) => dataview.slug?.includes(area.properties?.type)) ||
        allDataviews.find(
          (dataview) =>
            OCEAN_AREAS_DATAVIEWS.includes(dataview.slug as any) &&
            dataview.slug?.includes(area.properties?.type)
        )
      if (!dataview) {
        console.warn('No dataview found for area', area)
        return
      }
      const datasetId = dataview.datasetsConfig?.[0]?.datasetId
      if (!datasetId) {
        console.warn('No datasetId found for area', area)
        return
      }
      const category = workspace?.category || DEFAULT_WORKSPACE_CATEGORY
      const workspaceId = workspace?.id || DEFAULT_WORKSPACE_ID
      const newDataviewInstance = getDataviewInstanceFromDataview(dataview as Dataview)

      if (area.properties?.type === 'port') {
        const portId = area.properties.area != null ? String(area.properties.area) : undefined
        router.navigate({
          to: ROUTE_PATHS.PORT_REPORT,
          params: { category, workspaceId, portId: portId! },
          search: (prev: QueryParams) => ({
            ...prev,
            reportCategory: ReportCategory.Events,
            portsReportName: area.properties.name,
            portsReportCountry: area.properties.area?.toString().split('-')[0]?.toUpperCase(),
            portsReportDatasetId: datasetId,
            dataviewInstances: mergeDataviewInstances(prev.dataviewInstances, newDataviewInstance),
          }),
        })
      } else {
        const areaId = area.properties.area != null ? String(area.properties.area) : undefined
        router.navigate({
          to: ROUTE_PATHS.WORKSPACE_REPORT,
          params: { category, workspaceId, datasetId, areaId: areaId! },
          search: (prev: QueryParams) => ({
            ...prev,
            dataviewInstances: mergeDataviewInstances(prev.dataviewInstances, newDataviewInstance),
          }),
        })
      }
    },
    [allDataviews, contextAreasDataviews, router, workspace?.category, workspace?.id]
  )
}
