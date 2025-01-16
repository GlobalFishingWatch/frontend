import type { Bbox, BufferOperation, BufferUnit } from 'types'

import { DatasetSubCategory, DataviewCategory } from '@globalfishingwatch/api-types'

import type {
  REPORT_ACTIVITY_GRAPH_BEFORE_AFTER,
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
  REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON,
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_VESSELS_GRAPH_GEARTYPE,
  REPORT_VESSELS_GRAPH_VESSELTYPE,
} from 'data/config'

export type ReportActivityGraph =
  | typeof REPORT_ACTIVITY_GRAPH_EVOLUTION
  | typeof REPORT_ACTIVITY_GRAPH_BEFORE_AFTER
  | typeof REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON

export enum ReportCategory {
  Fishing = DatasetSubCategory.Fishing,
  Presence = DatasetSubCategory.Presence,
  Detections = DataviewCategory.Detections,
  Environment = DataviewCategory.Environment,
}

export type ReportVesselGraph =
  | typeof REPORT_VESSELS_GRAPH_GEARTYPE
  | typeof REPORT_VESSELS_GRAPH_VESSELTYPE
  | typeof REPORT_VESSELS_GRAPH_FLAG

export type ReportActivityTimeComparison = {
  start: string
  compareStart: string
  duration: number
  durationType: 'days' | 'months'
}

export type AreaReportState = {
  reportActivityGraph?: ReportActivityGraph
  reportAreaBounds?: Bbox
  reportCategory?: ReportCategory
  reportTimeComparison?: ReportActivityTimeComparison
  reportVesselFilter?: string
  reportVesselGraph?: ReportVesselGraph
  reportVesselPage?: number
  reportBufferValue?: number
  reportBufferUnit?: BufferUnit
  reportBufferOperation?: BufferOperation
  reportResultsPerPage?: number
}

export type AreaReportStateProperty = keyof AreaReportState

export type ReportTimeComparisonValues = {
  start: string
  end: string
  compareStart: string
  compareEnd: string
}
