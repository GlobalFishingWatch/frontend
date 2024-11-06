import { createSelector } from '@reduxjs/toolkit'
import { selectLocationQuery } from 'routes/routes.selectors'
import { DEFAULT_PORT_REPORT_STATE } from './ports-report.config'
import { PortsReportState, PortsReportStateProperty } from './ports-report.types'

type PortsReportProperty<P extends PortsReportStateProperty> = Required<PortsReportState>[P]
function selectVGRStateProperty<P extends PortsReportStateProperty>(property: P) {
  return createSelector([selectLocationQuery], (locationQuery): PortsReportProperty<P> => {
    const urlProperty = locationQuery?.[property]
    if (urlProperty !== undefined) return urlProperty
    return DEFAULT_PORT_REPORT_STATE[property] as PortsReportProperty<P>
  })
}

export const selectPortReportVesselsSubsection = selectVGRStateProperty(
  'portsReportVesselsSubsection'
)
export const selectPortReportVesselFilter = selectVGRStateProperty('portsReportVesselFilter')
export const selectPortReportVesselPage = selectVGRStateProperty('portsReportVesselPage')
export const selectPortReportVesselsResultsPerPage = selectVGRStateProperty(
  'portsReportVesselsResultsPerPage'
)
export const selectPortReportVesselsOrderProperty = selectVGRStateProperty(
  'portsReportVesselsOrderProperty'
)
export const selectPortReportVesselsOrderDirection = selectVGRStateProperty(
  'portsReportVesselsOrderDirection'
)
