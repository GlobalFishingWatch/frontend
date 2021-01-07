import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectVessel } from 'routes/routes.selectors'
import MapWrapper from './components/MapWrapper'
import Info from './components/Info'
import RecentActivity from './components/RecentActivity'

const Profile: React.FC = (props): React.ReactElement => {
  const vesselID = useSelector(selectVessel)
  const [lastPortVisit, setLastPortVisit] = useState({ label: '', coordinates: null })
  const [lastPosition, setLastPosition] = useState(null)

  return (
    <Fragment>
      <MapWrapper vesselID={vesselID} setLastPosition={setLastPosition} />
      <Info vesselID={vesselID} lastPosition={lastPosition} lastPortVisit={lastPortVisit} />
      <RecentActivity vesselID={vesselID} setLastPortVisit={setLastPortVisit} />
    </Fragment>
  )
}

export default Profile
