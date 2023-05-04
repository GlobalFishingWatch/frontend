import { useSelector } from 'react-redux'
import { Fragment, useEffect } from 'react'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import { selectVesselId, selectVesselDatasetId } from 'routes/routes.selectors'
import VesselHeader from 'features/vessel/VesselHeader'
import VesselEvents from 'features/vessel/VesselEvents'
import {
  fetchVesselEventsThunk,
  fetchVesselInfoThunk,
  selectVesselEventsData,
  selectVesselEventsStatus,
  selectVesselInfoData,
  selectVesselInfoStatus,
} from 'features/vessel/vessel.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import VesselIdentity from './Vesseldentity'

const VesselDetail = () => {
  // useFetchDataviewResources()
  const dispatch = useAppDispatch()
  const vesselId = useSelector(selectVesselId)
  const datasetId = useSelector(selectVesselDatasetId)
  const vessel = useSelector(selectVesselInfoData)
  const infoStatus = useSelector(selectVesselInfoStatus)
  const eventsStatus = useSelector(selectVesselEventsStatus)
  const events = useSelector(selectVesselEventsData)

  useEffect(() => {
    if (infoStatus === 'idle') {
      dispatch(fetchVesselInfoThunk({ vesselId, datasetId }))
    }
  }, [])

  useEffect(() => {
    if (eventsStatus === 'idle') {
      dispatch(fetchVesselEventsThunk({ vesselId, datasetId }))
    }
  }, [])

  return (
    <Fragment>
      <VesselHeader vessel={vessel} />
      <VesselIdentity vessel={vessel} />
      <VesselEvents events={events} />
    </Fragment>
  )
}

export default VesselDetail
