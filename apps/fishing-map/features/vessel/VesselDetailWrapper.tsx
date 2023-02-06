import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import VesselDetail, { VesselDetailProps } from './VesselDetail'

const VesselDetailWrapper = (props: VesselDetailProps) => {
  useFetchDataviewResources()
  return <VesselDetail {...props} />
}

export default VesselDetailWrapper
