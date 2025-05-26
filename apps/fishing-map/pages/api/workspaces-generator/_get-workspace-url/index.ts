import { stringify } from 'qs'

import { searchArea } from './search/area-search'
import { searchPort } from './search/port-search'
import { searchVessel } from './search/vessel-search'
import type { ConfigurationParams } from './types'

const DEFAULT_WORKSPACE = 'fishing-activity/default-public'

function getSharedUrl({ start_date, end_date }: ConfigurationParams) {
  return `start=${start_date}&end=${end_date}`
}

function getQuery(params: Record<string, any>) {
  return stringify(params, { arrayFormat: 'comma' })
}

export async function getWorkspaceUrl(configuration: ConfigurationParams) {
  const { area, vessel, port } = configuration
  if (vessel) {
    const vesselMatched = await searchVessel(vessel)
    if (!vesselMatched) {
      return ''
    }
    const { id, dataset } = vesselMatched
    return `/map/vessel/${id}?${getSharedUrl(configuration)}&dataset=${dataset}`
  }
  if (port) {
    const portMatched = await searchPort(port)
    if (!portMatched) {
      return
    }
    const { id, flag, dataset } = portMatched
    const portParams = {
      timebarVisualisation: 'events',
      bivariateDataviews: null,
      reportCategory: 'events',
      portsReportCountry: flag,
      portsReportDatasetId: dataset,
    }
    return `/map/${DEFAULT_WORKSPACE}/ports-report/${id}?${getSharedUrl(configuration)}&${getQuery(portParams)}`
  }
  if (area) {
    const areaMatched = await searchArea(area)
    if (!areaMatched) {
      return ''
    }
    const { id, dataset, type } = areaMatched
    return `/map/${DEFAULT_WORKSPACE}/report/${dataset}/${id}?${getSharedUrl(configuration)}&dvIn[0][id]=vms&dvIn[0][cfg][vis]=false&dvIn[1][id]=context-layer-eez&dvIn[1][cfg][vis]=true&bDV&reportLoadVessels=true`
  }
  return ''
}
