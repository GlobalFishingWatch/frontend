import { REPORT_VESSELS_PER_PAGE } from 'data/config'
import { PortsReportState } from './ports-report.types'

export const DEFAULT_PORT_REPORT_STATE: PortsReportState = {
  portsReportVesselsSubsection: 'flag',
  portsReportVesselPage: 0,
  portsReportVesselsResultsPerPage: REPORT_VESSELS_PER_PAGE,
  portsReportVesselFilter: '',
}
