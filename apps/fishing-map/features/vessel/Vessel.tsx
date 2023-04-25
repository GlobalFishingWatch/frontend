import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import { Vessel } from '@globalfishingwatch/api-types'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import { selectVesselId, selectVesselDatasetId } from 'routes/routes.selectors'
import VesselHeader from 'features/vessel/VesselHeader'
import { selectVesselData } from 'features/vessel/vessel.slice'
import VesselIdentity from './Vesseldentity'

const VesselDetail = () => {
  // useFetchDataviewResources()
  const vesselId = useSelector(selectVesselId)
  const vesselDatasetId = useSelector(selectVesselDatasetId)
  const vessel = useSelector(selectVesselData)
  return (
    <Fragment>
      <VesselHeader vessel={vessel} />
      <VesselIdentity vessel={vessel} />
    </Fragment>
  )
}

export default VesselDetail
