import { useSelector } from 'react-redux'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import { selectVesselId, selectVesselDatasetId } from 'routes/routes.selectors'
import VesselDetail from './VesselDetail'

const VesselDetailWrapper = () => {
  useFetchDataviewResources()
  const vesselId = useSelector(selectVesselId)
  const vesselDatasetId = useSelector(selectVesselDatasetId)
  return <VesselDetail vesselId={vesselId} datasetId={vesselDatasetId} />
}

export default VesselDetailWrapper
