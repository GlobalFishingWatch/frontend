import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import { ReportCategory } from 'features/reports/reports.types'
import type { AnyWorkspaceState } from 'types'
import { TimebarVisualisations } from 'types'

import type { ConfigurationParams } from '../types'
import { DEFAULT_WORKSPACE, getSharedWorkspaceParams } from '../utils'

import { searchPort } from './port-search'

export async function getPortWorkspaceConfig(configuration: ConfigurationParams) {
  const { port } = configuration
  if (port?.name || port?.country) {
    const portMatched = searchPort(port)
    if (!portMatched) {
      return
    }
    const { id, flag, dataset, label } = portMatched
    const portParams: AnyWorkspaceState = {
      ...getSharedWorkspaceParams(configuration),
      timebarVisualisation: TimebarVisualisations.Events,
      reportCategory: ReportCategory.Events,
      portsReportCountry: flag,
      portsReportDatasetId: dataset,
    }
    return {
      label: `Here you have the port ${label} profile`,
      url: `/map/${DEFAULT_WORKSPACE}/ports-report/${id}?${stringifyWorkspace(portParams)}`,
    }
  }
}
