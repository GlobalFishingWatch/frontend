import { useSelector } from 'react-redux'
import ReportVesselsFilter from 'features/area-report/vessels/ReportVesselsFilter'
import { selectVesselGroupReportVesselFilter } from '../vessel-group.config.selectors'
import VesselGroupReportVesselsGraphSelector from './VesselGroupReportVesselsGraphSelector'
import VesselGroupReportVesselsGraph from './VesselGroupReportVesselsGraph'
import VesselGroupReportVesselsTable from './VesselGroupReportVesselsTable'
import styles from './VesselGroupReportVessels.module.css'

function VesselGroupReportVessels() {
  const vesselGroupReportVesselFilter = useSelector(selectVesselGroupReportVesselFilter)
  return (
    <div className={styles.container}>
      <VesselGroupReportVesselsGraphSelector />
      <VesselGroupReportVesselsGraph />
      <ReportVesselsFilter
        filter={vesselGroupReportVesselFilter}
        filterQueryParam="vesselGroupReportVesselFilter"
        pageQueryParam="vesselGroupReportVesselPage"
      />
      <VesselGroupReportVesselsTable />
    </div>
  )
}

export default VesselGroupReportVessels
