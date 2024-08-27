import { useSelector } from 'react-redux'
import { selectVesselGroupReportVesselsSubsection } from '../vessel.config.selectors'

type VesselGroupReportVesselsProps = {}

function VesselGroupReportVessels(props: VesselGroupReportVesselsProps) {
  const vesselSubSection = useSelector(selectVesselGroupReportVesselsSubsection)
  console.log('🚀 ~ VesselGroupReportVessels ~ vesselSubSection:', vesselSubSection)
  return (
    <div>
      <p>Graph here</p>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <p>Vessels table here</p>
    </div>
  )
}

export default VesselGroupReportVessels
