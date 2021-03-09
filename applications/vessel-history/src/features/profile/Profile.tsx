import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { IconButton, Tabs } from '@globalfishingwatch/ui-components'
import { Tab } from '@globalfishingwatch/ui-components/dist/tabs'
import { selectQueryParam, selectVesselProfileId } from 'routes/routes.selectors'
// import { getVesselInfo } from 'features/vessels/vessels.selectors'
import { HOME } from 'routes/routes'
import { selectVesselById } from 'features/vessels/vessels.slice'
import { useTranslation } from 'utils/i18n'
import { VesselWithHistory } from 'types'
import Info from './components/Info'
import styles from './Profile.module.css'

const Profile: React.FC = (props): React.ReactElement => {
  const { t } = useTranslation()
  const [lastPortVisit] = useState({ label: '', coordinates: null })
  const [lastPosition] = useState(null)
  const q = useSelector(selectQueryParam('q'))
  const vesselProfileId = useSelector(selectVesselProfileId)

  const vessel: VesselWithHistory = useSelector(selectVesselById(vesselProfileId))

  const tabs: Tab[] = [
    {
      id: 'info',
      title: 'INFO',
      content: <Info vessel={vessel} lastPosition={lastPosition} lastPortVisit={lastPortVisit} />,
    },
    {
      id: 'activity',
      title: 'ACTIVITY',
      content: <div>{t('common.commingSoon', 'Comming Soon!')}</div>,
    },
    {
      id: 'map',
      title: 'MAP',
      content: <div>{t('common.commingSoon', 'Comming Soon!')}</div>,
    },
  ]
  const [activeTab, setActiveTab] = useState<Tab | undefined>(tabs?.[0])

  return (
    <Fragment>
      <header className={styles.header}>
        <Link to={{ type: HOME, replaceQuery: true, query: { q } }}>
          <IconButton
            type="border"
            size="default"
            icon="arrow-left"
            className={styles.backButton}
          />
        </Link>
        {vessel && (
          <h1>
            {vessel.shipname}
            {vessel.history.shipname.byDate.length && (
              <p>
                +{vessel.history.shipname.byDate.length}{' '}
                {t('vessel.previousNames', 'previous names')}
              </p>
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
