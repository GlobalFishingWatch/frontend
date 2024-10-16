import { useSelector } from 'react-redux'
import ReportVesselsFilter from 'features/reports/activity/vessels/ReportVesselsFilter'
import { selectVGRVesselsGraphDataGrouped } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import {} from 'features/reports/vessel-groups/vessel-group-report.selectors'
import {
  selectVGRVesselFilter,
  selectVGRVesselsSubsection,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { selectVGRDataview } from '../vessel-group-report.selectors'
import VesselGroupReportVesselsGraphSelector from './VesselGroupReportVesselsGraphSelector'
import VesselGroupReportVesselsGraph, {
  VesselGroupReportVesselsGraphProperty,
} from './VesselGroupReportVesselsGraph'
import VesselGroupReportVesselsTable from './VesselGroupReportVesselsTable'
import styles from './VesselGroupReportVessels.module.css'

function VesselGroupReportVessels() {
  const subsection = useSelector(selectVGRVesselsSubsection)
  const reportDataview = useSelector(selectVGRDataview)
  const filter = useSelector(selectVGRVesselFilter)
  const data = useSelector(selectVGRVesselsGraphDataGrouped)
  return (
    <div className={styles.container}>
      <VesselGroupReportVesselsGraphSelector />
      <VesselGroupReportVesselsGraph
        data={data}
        color={reportDataview?.config?.color}
        property={subsection as VesselGroupReportVesselsGraphProperty}
        filterQueryParam="vGRVesselFilter"
        pageQueryParam="vGRVesselPage"
      />
      <ReportVesselsFilter
        filter={filter}
        filterQueryParam="vGRVesselFilter"
        pageQueryParam="vGRVesselPage"
      />
      <VesselGroupReportVesselsTable />
    </div>
  )
}

export default VesselGroupReportVessels
