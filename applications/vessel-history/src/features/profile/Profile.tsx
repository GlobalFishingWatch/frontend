import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import GFWAPI from '@globalfishingwatch/api-client'
import { IconButton, Tabs } from '@globalfishingwatch/ui-components'
import { Tab } from '@globalfishingwatch/ui-components/dist/tabs'
import { selectDataset, selectTmtId, selectVesselId } from 'routes/routes.selectors'
import { Vessel } from 'types'
import { getVesselInfo } from 'features/vessels/vessels.selectors'
import MapWrapper from './components/MapWrapper'
import Info from './components/Info'
import styles from './Profile.module.css'

const Profile: React.FC = (props): React.ReactElement => {
  const vesselID = useSelector(selectVesselId)
  const tmtID = useSelector(selectTmtId)
  const dataset = useSelector(selectDataset)
  const [lastPortVisit, setLastPortVisit] = useState({ label: '', coordinates: null })
  const [lastPosition, setLastPosition] = useState(null)
  const [selectedTab, setSelectedTab] = useState(1)
  const [searching, setSearching] = useState(false)

  const vessel = useSelector(getVesselInfo)
  const tabs: Tab[] = [
    {
      id: 'info',
      title: 'INFO',
      content: <Info vessel={vessel} lastPosition={lastPosition} lastPortVisit={lastPortVisit} />,
    },
    {
      id: 'activity',
      title: 'ACTIVITY',
      content: <div />,
    },
    {
      id: 'map',
      title: 'MAP',
      content: <MapWrapper vesselID={vesselID} setLastPosition={setLastPosition} />,
    },
  ]
  const [activeTab, setActiveTab] = useState<Tab | undefined>(tabs?.[0])

  return (
    <Fragment>
      <header className={styles.header}>
        <IconButton
          type="border"
          size="default"
          icon="arrow-left"
          className={styles.backButton}
          onClick={async () => {
            return
          }}
        ></IconButton>
        {vessel && (
          <h1>
            Vessel Name
            <p>+4 previous names</p>
          </h1>
        )}
      </header>
      <div className={styles.profileContainer}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab?.id}
          onTabClick={(tab: Tab) => setActiveTab(tab)}
        ></Tabs>
      </div>
    </Fragment>
  )
}

export default Profile
