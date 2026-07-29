import { useMigrateWorkspaceToast } from 'features/map/workspace/workspace-migration.hooks'
import { usePortsReportAreaFootprintFitBounds } from 'features/reports/report-area/area-reports.hooks'

import EventsReport from '../tabs/events/EventsReport'

function PortsReport() {
  useMigrateWorkspaceToast()
  usePortsReportAreaFootprintFitBounds()

  return <EventsReport />
}

export default PortsReport
