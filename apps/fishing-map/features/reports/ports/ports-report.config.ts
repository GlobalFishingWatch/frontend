import { REPORT_VESSELS_PER_PAGE } from 'data/config'
import { PortsReportState } from './ports-report.types'

export const DEFAULT_PORT_REPORT_DATASET_ID = 'public-global-port-visits-events:v3.1'

export const DEFAULT_PORT_REPORT_STATE: PortsReportState = {
  portsReportDatasetId: DEFAULT_PORT_REPORT_DATASET_ID,
  portsReportVesselsProperty: 'flag',
  portsReportVesselsPage: 0,
  portsReportVesselsResultsPerPage: REPORT_VESSELS_PER_PAGE,
  portsReportVesselsFilter: '',
}
