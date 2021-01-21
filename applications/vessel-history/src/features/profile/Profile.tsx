import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectVesselId } from 'routes/routes.selectors'
import { selectVessels } from 'features/vessels/vessels.slice'
import MapWrapper from './components/MapWrapper'
import Info from './components/Info'
import styles from './Profile.module.css'
import RecentActivity from './components/RecentActivity'

const Profile: React.FC = (props): React.ReactElement => {
  const vesselID = useSelector(selectVesselId)
  console.log(vesselID)
  const [lastPortVisit, setLastPortVisit] = useState({ label: '', coordinates: null })
  const [lastPosition, setLastPosition] = useState(null)
  const [selectedTab, setSelectedTab] = useState(1)

  return (
    <Fragment>
      <div className={styles.tabsHeader}>
        <button onClick={() => setSelectedTab(1)}>INFO</button>
        <button onClick={() => setSelectedTab(2)}>ACTIVITY</button>
        <button onClick={() => setSelectedTab(3)}>MAP</button>
      </div>
      <div className={styles.tabsContent}>
        {selectedTab === 1 && (
          <Info vesselID={vesselID} lastPosition={lastPosition} lastPortVisit={lastPortVisit} />
        )}
        {selectedTab === 2 && (
          <RecentActivity vesselID={vesselID} setLastPortVisit={setLastPortVisit} />
        )}
        {selectedTab === 3 && <MapWrapper vesselID={vesselID} setLastPosition={setLastPosition} />}
      </div>
    </Fragment>
  )
}

export default Profile
