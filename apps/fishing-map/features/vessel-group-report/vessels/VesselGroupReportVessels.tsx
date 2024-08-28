import VesselGroupReportVesselsGraphSelector from './VesselGroupReportVesselsGraphSelector'
import VesselGroupReportVesselsGraph from './VesselGroupReportVesselsGraph'
import styles from './VesselGroupReportVessels.module.css'

type VesselGroupReportVesselsProps = {}

function VesselGroupReportVessels(props: VesselGroupReportVesselsProps) {
  return (
    <div className={styles.container}>
      <VesselGroupReportVesselsGraphSelector />
      <VesselGroupReportVesselsGraph />
    </div>
  )
}

export default VesselGroupReportVessels
