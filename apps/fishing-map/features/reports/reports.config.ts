import type { StatsGroupBy } from '@globalfishingwatch/api-types'

import { EEZ_DATAVIEW_SLUG, FAO_AREAS_DATAVIEW_SLUG, RFMO_DATAVIEW_SLUG } from 'data/workspaces'
import type { BufferOperation, BufferUnit } from 'types'

import { ReportCategory, type ReportState, type ReportVesselOrderProperty } from './reports.types'

// REPORT CONFIG
export const REPORT_VESSELS_PER_PAGE = 10
export const REPORT_SHOW_MORE_VESSELS_PER_PAGE = REPORT_VESSELS_PER_PAGE * 5
export const EMPTY_API_VALUES = ['NULL', undefined, '']
export const MAX_CATEGORIES = 5
export const DEFAULT_BUFFER_UNIT = 'nauticalmiles' as BufferUnit
export const DEFAULT_BUFFER_OPERATION = 'dissolve' as BufferOperation
export const OTHERS_CATEGORY_LABEL = 'OTHERS'

// VESSELS GRAPH
export const REPORT_VESSELS_GRAPH_GEARTYPE = 'geartype' as const
export const REPORT_VESSELS_GRAPH_VESSELTYPE = 'vesselType' as const
export const REPORT_VESSELS_GRAPH_FLAG = 'flag' as const

// ACTIVITY GRAPH
export const REPORT_ACTIVITY_GRAPH_EVOLUTION = 'evolution' as const
export const REPORT_ACTIVITY_GRAPH_BEFORE_AFTER = 'beforeAfter' as const
export const REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON = 'periodComparison' as const

// EVENTS GRAPH
export const REPORT_EVENTS_GRAPH_EVOLUTION = 'evolution' as const
export const REPORT_EVENTS_GRAPH_GROUP_BY_FLAG = 'byFlag' as const
export const REPORT_EVENTS_GRAPH_GROUP_BY_RFMO = 'byRFMO' as const
export const REPORT_EVENTS_GRAPH_GROUP_BY_FAO = 'byFAO' as const
export const REPORT_EVENTS_GRAPH_GROUP_BY_EEZ = 'byEEZ' as const

export const REPORT_EVENTS_GRAPH_GROUP_BY_PARAMS: Record<string, StatsGroupBy> = {
  [REPORT_EVENTS_GRAPH_GROUP_BY_FLAG]: 'FLAG' as const,
  [REPORT_EVENTS_GRAPH_GROUP_BY_RFMO]: 'REGION_RFMO' as const,
  [REPORT_EVENTS_GRAPH_GROUP_BY_FAO]: 'REGION_MAJOR_FAO' as const,
  [REPORT_EVENTS_GRAPH_GROUP_BY_EEZ]: 'REGION_EEZ' as const,
}

export const REPORT_EVENTS_GRAPH_DATAVIEW_AREA_SLUGS = {
  [REPORT_EVENTS_GRAPH_GROUP_BY_RFMO]: RFMO_DATAVIEW_SLUG,
  [REPORT_EVENTS_GRAPH_GROUP_BY_FAO]: FAO_AREAS_DATAVIEW_SLUG,
  [REPORT_EVENTS_GRAPH_GROUP_BY_EEZ]: EEZ_DATAVIEW_SLUG,
}

export const REPORT_EVENTS_RFMO_AREAS = [
  'CCSBT',
  'IATTC',
  'ICCAT',
  'IOTC',
  'NPFC',
  'SPRFMO',
  'WCPFC',
]

export const DEFAULT_REPORT_STATE: Required<ReportState> = {
  // Category
  reportCategory: ReportCategory.Activity,
  // Subcategory
  reportActivitySubCategory: undefined,
  reportDetectionsSubCategory: undefined,
  reportEventsSubCategory: 'encounter',
  reportVesselsSubCategory: 'flag',
  // Area
  reportAreaBounds: undefined,
  reportBufferValue: undefined,
  reportBufferUnit: DEFAULT_BUFFER_UNIT,
  reportBufferOperation: DEFAULT_BUFFER_OPERATION,
  reportLoadVessels: undefined,
  // Ports
  portsReportName: undefined,
  portsReportCountry: undefined,
  portsReportDatasetId: undefined,
  // Vessels
  reportVesselFilter: undefined,
  reportVesselGraph: REPORT_VESSELS_GRAPH_FLAG,
  reportVesselPage: 0,
  reportVesselResultsPerPage: REPORT_VESSELS_PER_PAGE,
  reportVesselOrderDirection: 'asc',
  reportVesselOrderProperty: 'shipname' as ReportVesselOrderProperty,
  // Activity
  reportActivityGraph: REPORT_ACTIVITY_GRAPH_EVOLUTION,
  reportTimeComparison: undefined,
  // Events
  reportEventsGraph: REPORT_EVENTS_GRAPH_EVOLUTION,
  reportEventsPortsFilter: undefined,
  reportEventsPortsPage: 0,
  reportEventsPortsResultsPerPage: 10,
}
