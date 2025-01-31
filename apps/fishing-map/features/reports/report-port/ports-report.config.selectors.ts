import { createSelector } from '@reduxjs/toolkit'

import { selectLocationQuery } from 'routes/routes.selectors'

import { DEFAULT_PORT_REPORT_STATE } from './ports-report.config'
import type { PortsReportState, PortsReportStateProperty } from './ports-report.types'

type PortsReportProperty<P extends PortsReportStateProperty> = Required<PortsReportState>[P]
function selectVGRStateProperty<P extends PortsReportStateProperty>(property: P) {
  return createSelector([selectLocationQuery], (locationQuery): PortsReportProperty<P> => {
    const urlProperty = locationQuery?.[property]
    if (urlProperty !== undefined) return urlProperty
    return DEFAULT_PORT_REPORT_STATE[property] as PortsReportProperty<P>
  })
}

// TODO:PORTS navigate to portsReportDatasetId query param from sidebar
export const selectPortReportName = selectVGRStateProperty('portsReportName')
export const selectPortReportCountry = selectVGRStateProperty('portsReportCountry')
export const selectPortsReportDatasetId = selectVGRStateProperty('portsReportDatasetId')
export const selectPortReportVesselsProperty = selectVGRStateProperty('portsReportVesselsProperty')
export const selectPortReportVesselsFilter = selectVGRStateProperty('portsReportVesselsFilter')
export const selectPortReportVesselsPage = selectVGRStateProperty('portsReportVesselsPage')
export const selectPortReportVesselsResultsPerPage = selectVGRStateProperty(
  'portsReportVesselsResultsPerPage'
)
