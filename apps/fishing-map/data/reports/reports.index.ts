import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { PATH_BASENAME } from 'data/config'
import { REPORT_EVENTS_DATAVIEW_INSTANCES } from 'data/reports/report.dataviews'
import { ReportCategory } from 'features/reports/reports.types'

import type workspaceTranslations from '../../public/locales/source/workspaces.json'

export type ReportIndexId = keyof typeof workspaceTranslations
export type ReportIndex = {
  id: ReportIndexId
  img: string
  reportCategory: ReportCategory
  workspaceId?: string
  dataviewInstances?: UrlDataviewInstance[]
}

export const REPORTS_INDEX: ReportIndex[] = [
  {
    id: 'activity-report',
    reportCategory: ReportCategory.Activity,
    img: `${PATH_BASENAME}/images/reports/activity-report.jpg`,
    dataviewInstances: REPORT_EVENTS_DATAVIEW_INSTANCES,
  },
  {
    id: 'detections-report',
    reportCategory: ReportCategory.Detections,
    img: `${PATH_BASENAME}/images/reports/detections-report.jpg`,
    dataviewInstances: REPORT_EVENTS_DATAVIEW_INSTANCES,
  },
  {
    id: 'events-report',
    reportCategory: ReportCategory.Events,
    img: `${PATH_BASENAME}/images/reports/events-report.jpg`,
    dataviewInstances: REPORT_EVENTS_DATAVIEW_INSTANCES,
  },
]

export const REPORT_IDS = REPORTS_INDEX.map(({ id }) => id)
