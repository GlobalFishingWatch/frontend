import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import {
  EEZ_DATAVIEW_INSTANCE_ID,
  MPA_DATAVIEW_INSTANCE_ID,
  RFMO_DATAVIEW_INSTANCE_ID,
} from 'data/workspaces'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

import type { NavigationConfig } from './navigation-config'

const OPEN_REPORT_SEARCH = {
  longitude: -28.09249823,
  latitude: 38.48103761,
  zoom: 3.88091657,
  dataviewInstances: [{ id: 'context-layer-eez', config: { visible: true } }],
  bivariateDataviews: null,
} as QueryParams

type DatasetId = 'public-eez-areas' | 'public-mpa-all' | 'public-rfmo'
const dataviewInstancesByDatasetId: Record<DatasetId, UrlDataviewInstance[]> = {
  'public-eez-areas': [{ id: EEZ_DATAVIEW_INSTANCE_ID, config: { visible: true } }],
  'public-mpa-all': [{ id: MPA_DATAVIEW_INSTANCE_ID, config: { visible: true } }],
  'public-rfmo': [{ id: RFMO_DATAVIEW_INSTANCE_ID, config: { visible: true } }],
}

type EEZNames = 'Azores'
const eezAreaIdsByName: Record<EEZNames, string> = { Azores: '8361' }
type MPANames = 'Coco'
const mpaAreaIdsByName: Record<MPANames, string> = { Coco: '170' }
type RFMONames = 'ICCAT'
const rfmoAreaIdsByName: Record<RFMONames, string> = { ICCAT: 'ICCAT' }

function navigateToReport(
  datasetId: DatasetId,
  areaId: string,
  search: QueryParams = OPEN_REPORT_SEARCH
): NavigationConfig {
  return {
    to: ROUTE_PATHS.WORKSPACE_REPORT_FULL,
    params: {
      category: 'fishing-activity',
      workspaceId: 'default-public',
      datasetId,
      areaId,
    },
    search: {
      ...search,
      dataviewInstances: dataviewInstancesByDatasetId[datasetId] || [],
    },
  }
}

type ReportArea = 'eez' | 'mpa' | 'rfmo'
export function navigateToReportByArea(reportArea: ReportArea): NavigationConfig {
  switch (reportArea) {
    case 'eez':
      return navigateToReport('public-eez-areas', eezAreaIdsByName.Azores)
    case 'mpa':
      return navigateToReport('public-mpa-all', mpaAreaIdsByName.Coco)
    case 'rfmo':
      return navigateToReport('public-rfmo', rfmoAreaIdsByName.ICCAT)
  }
}
