import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client'

import { ReportCategory } from 'features/reports/reports.types'
import type { AnyWorkspaceState } from 'types'
import { TimebarVisualisations } from 'types'

import type { ConfigurationParams } from '../types'
import { DEFAULT_WORKSPACE, getDateRangeLabel, getSharedWorkspaceParams } from '../utils'

import { searchPorts } from './port-search'

export async function getPortWorkspaceConfig(configuration: ConfigurationParams) {
  const { port } = configuration
  if (port?.name || port?.country) {
    const portsMatched = searchPorts(port)
    if (!portsMatched) {
      return
    }
    const { flag, dataset, label } = portsMatched[0]
    const portParams: AnyWorkspaceState = {
      ...getSharedWorkspaceParams(configuration),
      timebarVisualisation: TimebarVisualisations.Events,
      reportCategory: ReportCategory.Events,
      portsReportCountry: flag,
      portsReportName: label,
      portsReportDatasetId: dataset,
    }

    const links = portsMatched.slice(0, 10).map((portMatched) => ({
      url: `/map/${DEFAULT_WORKSPACE}/ports-report/${portMatched.id}?${stringifyWorkspace(portParams)}`,
      message: `See here the visits to ${portMatched.label} port ${getDateRangeLabel(configuration)}`,
    }))

    return {
      label: 'Port reports',
      links,
    }
  }
}
