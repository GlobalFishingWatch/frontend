import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { PATH_BASENAME } from 'data/config'
import { REPORT_EVENTS_DATAVIEW_INSTANCES } from 'data/reports/report.dataviews'

import type workspaceTranslations from '../../public/locales/source/workspaces.json'

export type ReportIndexId = keyof typeof workspaceTranslations
export type ReportIndex = {
  id: ReportIndexId
  img: string
  dataviewInstances?: UrlDataviewInstance[]
}

export const REPORTS_INDEX: ReportIndex[] = [
  {
    id: 'activity-report',
    img: `${PATH_BASENAME}/images/reports/activity-report.jpg`,
    dataviewInstances: [],
  },
  {
    id: 'detections-report',
    img: `${PATH_BASENAME}/images/reports/detections-report.jpg`,
    dataviewInstances: [],
  },
  {
    id: 'events-report',
    img: `${PATH_BASENAME}/images/reports/events-report.jpg`,
    dataviewInstances: REPORT_EVENTS_DATAVIEW_INSTANCES,
  },
]

export const REPORT_IDS = REPORTS_INDEX.map(({ id }) => id)
