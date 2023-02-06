export type VesselDetailProps = {
  datasetId: string
  vesselId: string
}

const VesselDetail = ({ vesselId, datasetId }: VesselDetailProps) => {
  return (
    <h2>
      {vesselId} in {datasetId}
    </h2>
  )
}

export default VesselDetail
