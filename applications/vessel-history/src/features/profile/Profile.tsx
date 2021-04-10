import React, { Fragment, useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { IconButton, Tabs } from '@globalfishingwatch/ui-components'
import { Tab } from '@globalfishingwatch/ui-components/dist/tabs'
import { selectQueryParam, selectVesselProfileId } from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import { fetchVesselByIdThunk, selectVesselById } from 'features/vessels/vessels.slice'
import Info from './components/Info'
import styles from './Profile.module.css'

const Profile: React.FC = (props): React.ReactElement => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [lastPortVisit] = useState({ label: '', coordinates: null })
  const [lastPosition] = useState(null)
  const q = useSelector(selectQueryParam('q'))
  const vesselProfileId = useSelector(selectVesselProfileId)

  const vessel = useSelector(selectVesselById(vesselProfileId))

  useEffect(() => {
    dispatch(fetchVesselByIdThunk(vesselProfileId))
  }, [dispatch, vesselProfileId])

  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 'info',
        title: t('common.info', 'INFO').toLocaleUpperCase(),
        content: vessel ? (
          <Info vessel={vessel} lastPosition={lastPosition} lastPortVisit={lastPortVisit} />
        ) : (
          <Fragment />
        ),
      },
      {
        id: 'activity',
        title: t('common.activity', 'ACTIVITY').toLocaleUpperCase(),
        content: <div>{t('common.commingSoon', 'Comming Soon!')}</div>,
      },
      {
        id: 'map',
        title: t('common.map', 'MAP').toLocaleUpperCase(),
        content: <div>{t('common.commingSoon', 'Comming Soon!')}</div>,
      },
    ],
    [t, vessel, lastPosition, lastPortVisit]
  )

  const [activeTab, setActiveTab] = useState<Tab | undefined>(tabs?.[0])

  const defaultPreviousNames = useMemo(() => {
    return `+${vessel?.history.shipname.byDate.length} previous ${t(
      `vessel.name_plural` as any,
      'names'
    ).toLocaleUpperCase()}`
  }, [vessel, t])

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
                {t('vessel.plusPreviousValuesByField', defaultPreviousNames, {
                  quantity: vessel.history.shipname.byDate.length,
                  fieldLabel: t(`vessel.name_plural` as any, 'names').toLocaleUpperCase(),
                })}
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
