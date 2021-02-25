import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { IconButton, Tabs } from '@globalfishingwatch/ui-components'
import { Tab } from '@globalfishingwatch/ui-components/dist/tabs'
import { getVesselInfo } from 'features/vessels/vessels.selectors'
import Info from './components/Info'
import styles from './Profile.module.css'

const Profile: React.FC = (props): React.ReactElement => {
  const [lastPortVisit, setLastPortVisit] = useState({ label: '', coordinates: null })
  const [lastPosition, setLastPosition] = useState(null)

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
      content: <div>Comming Soon!</div>,
    },
    {
      id: 'map',
      title: 'MAP',
      content: <div>Comming Soon!</div>,
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
            {vessel.getName().value?.data}
            {vessel.getName().value?.historic?.length && (
              <p>+{vessel.gfwData?.otherShipnames.length} previous names</p>
            )}
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
