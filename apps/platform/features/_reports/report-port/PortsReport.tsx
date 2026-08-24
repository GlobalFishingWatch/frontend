import { useMigrateWorkspaceToast } from 'features/_map/workspace/workspace-migration.hooks'
import { usePortsReportAreaFootprintFitBounds } from 'features/_reports/report-area/area-reports.hooks'

import EventsReport from '../tabs/events/EventsReport'

function PortsReport() {
  useMigrateWorkspaceToast()
  usePortsReportAreaFootprintFitBounds()

  return <EventsReport />
}

export default PortsReport
