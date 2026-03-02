import { usePortsReportAreaFootprintFitBounds } from 'features/reports/report-area/area-reports.hooks'

import EventsReport from '../tabs/events/EventsReport'

function PortsReport() {
  usePortsReportAreaFootprintFitBounds()

  return <EventsReport />
}

export default PortsReport
