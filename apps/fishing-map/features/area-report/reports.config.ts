import { BufferUnit, BufferOperation } from 'types'

export const REPORT_BUFFER_FEATURE_ID: string = 'buffer'
export const DEFAULT_BUFFER_VALUE: number = 50
export const NAUTICAL_MILES: BufferUnit = 'nauticalmiles'
export const KILOMETERS: BufferUnit = 'kilometers'

export const DISSOLVE: BufferOperation = 'dissolve'
export const DIFFERENCE: BufferOperation = 'difference'
export const DEFAULT_BUFFER_OPERATION: BufferOperation = DISSOLVE

export const DEFAULT_POINT_BUFFER_UNIT: BufferUnit = NAUTICAL_MILES
export const DEFAULT_POINT_BUFFER_VALUE: number = 5
export type LastReportStorage = { reportUrl: string; workspaceUrl: string }
export const LAST_REPORTS_STORAGE_KEY = 'lastReports'

export const EMPTY_API_VALUES = ['NULL', undefined, '']
export const MAX_CATEGORIES = 5
export const OTHERS_CATEGORY_LABEL = 'OTHERS'

export const MAX_DAYS_TO_COMPARE = 100
export const MAX_MONTHS_TO_COMPARE = 12
