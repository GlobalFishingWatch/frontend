import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import { Vessel } from '@globalfishingwatch/api-types'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import { selectVesselId, selectVesselDatasetId } from 'routes/routes.selectors'
import VesselHeader from 'features/vessel/VesselHeader'
import VesselEvents from 'features/vessel/VesselEvents'
import { selectVesselEventsData, selectVesselInfoData } from 'features/vessel/vessel.slice'
import VesselIdentity from './Vesseldentity'

const VesselDetail = () => {
  // useFetchDataviewResources()
  const vesselId = useSelector(selectVesselId)
  const vesselDatasetId = useSelector(selectVesselDatasetId)
  const vessel = useSelector(selectVesselInfoData)
  const events = useSelector(selectVesselEventsData)
  return (
    <Fragment>
      <VesselHeader vessel={vessel} />
      <VesselIdentity vessel={vessel} />
      <VesselEvents events={events} />
    </Fragment>
  )
}

export default VesselDetail
