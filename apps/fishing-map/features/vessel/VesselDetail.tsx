export type VesselDetailProps = {
  datasetId: string
  vesselId: string
}

const VesselDetail = ({ vesselId, datasetId }: VesselDetailProps) => {
  return (
    <h2>
      The vessel {vesselId} is in the dataset: {datasetId}
    </h2>
  )
}

export default VesselDetail
