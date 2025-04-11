import type { DatasetSubCategory, EventType } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'

import type {
  REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
  REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
  REPORT_EVENTS_GRAPH_EVOLUTION,
  REPORT_EVENTS_GRAPH_GROUP_BY_EEZ,
  REPORT_EVENTS_GRAPH_GROUP_BY_FAO,
  REPORT_EVENTS_GRAPH_GROUP_BY_FLAG,
  REPORT_EVENTS_GRAPH_GROUP_BY_RFMO,
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_VESSELS_GRAPH_GEARTYPE,
  REPORT_VESSELS_GRAPH_VESSELTYPE,
} from 'features/reports/reports.config'
import type { Bbox, BufferOperation, BufferUnit } from 'types'

// REPORT CATEGORY
export enum ReportCategory {
  Activity = DataviewCategory.Activity,
  Detections = DataviewCategory.Detections,
  Environment = DataviewCategory.Environment,
  Events = DataviewCategory.Events,
  VesselGroup = 'vessel-groups',
  VesselGroupInsights = 'vessel-groups-insights',
}
export type ReportCategoryState = {
  reportCategory: ReportCategory | undefined
}

// REPORT SUBCATEGORIES
export type ReportActivitySubCategory =
  | `${DatasetSubCategory.Fishing}`
  | `${DatasetSubCategory.Presence}`
export type ReportDetectionsSubCategory =
  | `${DatasetSubCategory.Sar}`
  | `${DatasetSubCategory.Viirs}`
export type ReportEventsSubCategory = EventType
export type ReportVesselsSubCategory = ReportVesselGraph | 'source'

export type AnyReportSubCategory =
  | ReportActivitySubCategory
  | ReportDetectionsSubCategory
  | ReportEventsSubCategory
  | ReportVesselsSubCategory

export type ReportSubcategoryState = {
  reportActivitySubCategory: ReportActivitySubCategory | undefined
  reportDetectionsSubCategory: ReportDetectionsSubCategory | undefined
  reportEventsSubCategory: ReportEventsSubCategory | undefined
  reportVesselsSubCategory: ReportVesselsSubCategory | undefined
}

// AREA REPORT
export type AreaReportState = {
  reportAreaBounds: Bbox | undefined
  reportBufferValue: number | undefined
  reportBufferUnit: BufferUnit
  reportBufferOperation: BufferOperation
}

// PORT REPORT
export type PortsReportState = {
  portsReportName: string | undefined
  portsReportCountry: string | undefined
  portsReportDatasetId: string | undefined
}

// VESSEL GROUP REPORT
export type VesselGroupReportState = {
  viewOnlyVesselGroup: boolean
}

// REPORT VESSELS
export type ReportVesselOrderProperty = 'shipname' | 'flag' | 'shiptype'
export type ReportVesselOrderDirection = 'asc' | 'desc'
export type ReportVesselGraph =
  | typeof REPORT_VESSELS_GRAPH_GEARTYPE
  | typeof REPORT_VESSELS_GRAPH_VESSELTYPE
  | typeof REPORT_VESSELS_GRAPH_FLAG

export type ReportVesselsState = {
  reportVesselFilter: string | undefined
  reportVesselGraph: ReportVesselGraph
  reportVesselPage: number
  reportVesselResultsPerPage: number
  reportVesselOrderProperty: ReportVesselOrderProperty | undefined
  reportVesselOrderDirection: ReportVesselOrderDirection | undefined
  reportLoadVessels: boolean | undefined
}
// REPORT ACTIVITY
export type ReportActivityGraph =
  | typeof REPORT_ACTIVITY_GRAPH_EVOLUTION
  | typeof REPORT_ACTIVITY_GRAPH_BEFORE_AFTER
  | typeof REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON

// REPORT EVENTS
export type ReportEventsGraph =
  | typeof REPORT_EVENTS_GRAPH_EVOLUTION
  | typeof REPORT_EVENTS_GRAPH_GROUP_BY_FLAG
  | typeof REPORT_EVENTS_GRAPH_GROUP_BY_RFMO
  | typeof REPORT_EVENTS_GRAPH_GROUP_BY_FAO
  | typeof REPORT_EVENTS_GRAPH_GROUP_BY_EEZ

export type ReportActivityTimeComparison = {
  start: string
  compareStart: string
  duration: number
  durationType: 'days' | 'months'
}

export type ReportActivityState = {
  reportActivityGraph: ReportActivityGraph
  reportTimeComparison: ReportActivityTimeComparison | undefined
}

export type ReportEventsState = {
  reportEventsGraph: ReportEventsGraph
}

export type ReportState = ReportCategoryState &
  ReportSubcategoryState &
  ReportVesselsState &
  ReportActivityState &
  ReportEventsState &
  AreaReportState &
  PortsReportState &
  VesselGroupReportState

export type ReportStateProperty = keyof ReportState
