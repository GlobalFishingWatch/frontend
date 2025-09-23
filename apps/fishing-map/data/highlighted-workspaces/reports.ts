import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { PATH_BASENAME } from 'data/config'
import {
  // CARRIER_PORTAL_DATAVIEW_INSTANCES,
  REPORT_DATAVIEW_INSTANCES,
} from 'data/highlighted-workspaces/report.dataviews'
import { ReportCategory } from 'features/reports/reports.types'

import type workspaceTranslations from '../../public/locales/source/workspaces.json'

export type ReportWorkspaceId = keyof (typeof workspaceTranslations)['reports']
export type WorkspaceReportLink = {
  id: string
  key?: string // Using analysis.see as default
}
export type ReportWorkspace = {
  id: ReportWorkspaceId
  img: string
  reportCategory: ReportCategory
  dataviewInstances?: UrlDataviewInstance[]
  visible?: boolean
}

export const REPORTS_INDEX: ReportWorkspace[] = [
  // {
  //   id: 'carrier-portal-report',
  //   reportCategory: ReportCategory.Events,
  //   img: `${PATH_BASENAME}/images/highlighted-workspaces/carrier-portal.jpg`,
  //   dataviewInstances: CARRIER_PORTAL_DATAVIEW_INSTANCES,
  // },
  {
    id: 'activity-report',
    reportCategory: ReportCategory.Activity,
    img: `${PATH_BASENAME}/images/highlighted-workspaces/report-activity.jpg`,
    dataviewInstances: REPORT_DATAVIEW_INSTANCES,
  },
  {
    id: 'detections-report',
    reportCategory: ReportCategory.Detections,
    img: `${PATH_BASENAME}/images/highlighted-workspaces/report-detections.jpg`,
    dataviewInstances: REPORT_DATAVIEW_INSTANCES,
  },
  {
    id: 'events-report',
    reportCategory: ReportCategory.Events,
    img: `${PATH_BASENAME}/images/highlighted-workspaces/report-events.jpg`,
    dataviewInstances: REPORT_DATAVIEW_INSTANCES,
  },
]

export const REPORT_IDS = REPORTS_INDEX.map(({ id }) => id)
