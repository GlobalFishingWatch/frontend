import { PATH_BASENAME } from 'data/config'

import type workspaceTranslations from '../../public/locales/source/workspaces.json'

export type ReportIndexId = keyof typeof workspaceTranslations
export type ReportIndex = {
  id: ReportIndexId
  img: string
  cta?: string
}

export const REPORTS_INDEX: ReportIndex[] = [
  {
    // id needs to be in format [ReportCategory]-report
    id: 'carrier-portal',
    img: `${PATH_BASENAME}/images/reports/carrier-portal.jpg`,
  },
  {
    // id needs to be in format [ReportCategory]-report
    id: 'activity-report',
    img: `${PATH_BASENAME}/images/reports/activity-report.jpg`,
  },
  {
    id: 'detections-report',
    img: `${PATH_BASENAME}/images/reports/detections-report.jpg`,
  },
  {
    id: 'events-report',
    img: `${PATH_BASENAME}/images/reports/events-report.jpg`,
  },
]

export const REPORT_IDS = REPORTS_INDEX.map(({ id }) => id)
