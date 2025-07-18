import { usePortsReportAreaFootprintFitBounds } from 'features/reports/report-area/area-reports.hooks'
import { useMigrateWorkspaceToast } from 'features/workspace/workspace-migration.hooks'

import EventsReport from '../tabs/events/EventsReport'

function PortsReport() {
  useMigrateWorkspaceToast()
  usePortsReportAreaFootprintFitBounds()

  return <EventsReport />
}

export default PortsReport
