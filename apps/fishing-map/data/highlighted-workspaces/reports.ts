import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { PATH_BASENAME } from 'data/config'
import { SENTINEL2_DATAVIEW_INSTANCE_ID } from 'data/dataviews'
import {
  // CARRIER_PORTAL_DATAVIEW_INSTANCES,
  REPORT_DATAVIEW_INSTANCES,
} from 'data/highlighted-workspaces/report.dataviews'
import { WorkspaceCategory } from 'data/workspaces'
import { ReportCategory } from 'features/reports/reports.types'

import type workspaceTranslations from '../../public/locales/source/workspaces.json'

export type ReportWorkspaceId = keyof (typeof workspaceTranslations)['reports']
export type WorkspaceReportLink = {
  id: string
  key?: string // Using analysis.see as default
}
export type ReportWorkspace =
  | {
      id: ReportWorkspaceId
      img: string
      category: WorkspaceCategory.FishingActivity
      reports?: WorkspaceReportLink[]
      visible?: boolean
    }
  | {
      id: ReportWorkspaceId
      img: string
      category: WorkspaceCategory.Reports
      reportCategory: ReportCategory
      dataviewInstances?: UrlDataviewInstance[]
      visible?: boolean
    }

export const REPORTS_INDEX: ReportWorkspace[] = [
  {
    id: 'deep-sea-mining-public',
    category: WorkspaceCategory.FishingActivity,
    reports: [
      {
        id: 'deep_sea_mining-public',
      },
    ],
    img: `${PATH_BASENAME}/images/highlighted-workspaces/deep-sea-mining.jpg`,
  },
  {
    id: 'activity-report',
    category: WorkspaceCategory.Reports,
    reportCategory: ReportCategory.Activity,
    img: `${PATH_BASENAME}/images/highlighted-workspaces/report-activity.jpg`,
    dataviewInstances: REPORT_DATAVIEW_INSTANCES,
  },
  {
    id: 'detections-report',
    category: WorkspaceCategory.Reports,
    reportCategory: ReportCategory.Detections,
    img: `${PATH_BASENAME}/images/highlighted-workspaces/report-detections.jpg`,
    dataviewInstances: REPORT_DATAVIEW_INSTANCES.map((dataview) => ({
      ...dataview,
      config: {
        ...dataview.config,
        ...(dataview.id === SENTINEL2_DATAVIEW_INSTANCE_ID && {
          filters: {
            matched: [false],
          },
        }),
      },
    })),
  },
  {
    id: 'events-report',
    category: WorkspaceCategory.Reports,
    reportCategory: ReportCategory.Events,
    img: `${PATH_BASENAME}/images/highlighted-workspaces/report-events.jpg`,
    dataviewInstances: REPORT_DATAVIEW_INSTANCES,
  },
]
