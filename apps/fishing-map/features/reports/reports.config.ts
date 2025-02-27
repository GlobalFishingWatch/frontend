import {
  REPORT_ACTIVITY_GRAPH_EVOLUTION,
  REPORT_VESSELS_GRAPH_FLAG,
  REPORT_VESSELS_PER_PAGE,
} from 'data/config'
import type { BufferOperation, BufferUnit } from 'types'

import { ReportCategory, type ReportState, type ReportVesselOrderProperty } from './reports.types'

export const EMPTY_API_VALUES = ['NULL', undefined, '']
export const MAX_CATEGORIES = 5
export const DEFAULT_BUFFER_UNIT = 'nauticalmiles' as BufferUnit
export const DEFAULT_BUFFER_OPERATION = 'dissolve' as BufferOperation
export const OTHERS_CATEGORY_LABEL = 'OTHERS'

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
  // Ports
  portsReportName: undefined,
  portsReportCountry: undefined,
  portsReportDatasetId: undefined,
  // Vessel Group
  viewOnlyVesselGroup: false,
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
}
