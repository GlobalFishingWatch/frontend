import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import {
  EEZ_DATAVIEW_INSTANCE_ID,
  MPA_DATAVIEW_INSTANCE_ID,
  RFMO_DATAVIEW_INSTANCE_ID,
} from 'data/workspaces'

export const OPEN_REPORT_ACTION = {
  type: 'WORKSPACE_REPORT',
  payload: {
    category: 'fishing-activity',
    workspaceId: 'default-public',
    datasetId: 'public-eez-areas',
    areaId: '8361',
  },
  query: {
    longitude: -28.09249823,
    latitude: 38.48103761,
    zoom: 3.88091657,
    dataviewInstances: [
      {
        id: 'context-layer-eez',
        config: {
          visible: true,
        },
      },
    ],
    bivariateDataviews: null,
  },
}

type DatasetId = 'public-eez-areas' | 'public-mpa-all' | 'public-rfmo'
const dataviewInstancesByDatasetId: Record<DatasetId, UrlDataviewInstance[]> = {
  'public-eez-areas': [
    {
      id: EEZ_DATAVIEW_INSTANCE_ID,
      config: { visible: true },
    },
  ],
  'public-mpa-all': [
    {
      id: MPA_DATAVIEW_INSTANCE_ID,
      config: { visible: true },
    },
  ],
  'public-rfmo': [
    {
      id: RFMO_DATAVIEW_INSTANCE_ID,
      config: { visible: true },
    },
  ],
}

type EEZNames = 'Azores'
const eezAreaIdsByName: Record<EEZNames, string> = {
  Azores: '8361',
}
type MPANames = 'Coco'
const mpaAreaIdsByName: Record<MPANames, string> = {
  Coco: '170',
}
type RFMONames = 'ICCAT'
const rfmoAreaIdsByName: Record<RFMONames, string> = {
  ICCAT: 'ICCAT',
}

const getOpenReportActionByDatasetAndAreaName = (
  datasetId: DatasetId,
  areaName: EEZNames | MPANames | RFMONames
) => {
  const areaId =
    datasetId === 'public-eez-areas'
      ? eezAreaIdsByName[areaName as EEZNames]
      : datasetId === 'public-mpa-all'
        ? mpaAreaIdsByName[areaName as MPANames]
        : rfmoAreaIdsByName[areaName as RFMONames]
  if (!areaId) {
    throw new Error(`Area ID not found for ${areaName}`)
  }
  return {
    ...OPEN_REPORT_ACTION,
    payload: {
      ...OPEN_REPORT_ACTION.payload,
      datasetId,
      areaId,
    },
    query: {
      ...OPEN_REPORT_ACTION.query,
      dataviewInstances: dataviewInstancesByDatasetId[datasetId] || [],
    },
  }
}

type ReportArea = 'eez' | 'mpa' | 'rfmo'
export const getOpenReportActionByArea = (reportArea: ReportArea) => {
  switch (reportArea) {
    case 'eez':
      return getOpenReportActionByDatasetAndAreaName('public-eez-areas', 'Azores')
    case 'mpa':
      return getOpenReportActionByDatasetAndAreaName('public-mpa-all', 'Coco')
    case 'rfmo':
      return getOpenReportActionByDatasetAndAreaName('public-rfmo', 'ICCAT')
  }
}
