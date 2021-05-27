import React, { Fragment, useEffect, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'
import { VesselWithHistory } from 'types'
import { selectCurrentOfflineVessel } from 'features/vessels/offline-vessels.selectors'
import { useOfflineVesselsAPI } from 'features/vessels/offline-vessels.hook'
import { OfflineVessel } from 'types/vessel'
import {
  selectDataset,
  selectTmtId,
  selectVesselId,
  selectVesselProfileId,
} from 'routes/routes.selectors'
import { fetchVesselActivityThunk } from 'features/vessels/vessels-activity.thunk'
import InfoField, { VesselFieldLabel } from './InfoField'
import styles from './Activity.module.css'

interface InfoProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
}

const Activity: React.FC<InfoProps> = (props): React.ReactElement => {
  const vessel = props.vessel
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const vesselId = useSelector(selectVesselId)
  const vesselTmtId = useSelector(selectTmtId)
  const vesselDataset = useSelector(selectDataset)
  const vesselProfileId = useSelector(selectVesselProfileId)
  const offlineVessel = useSelector(selectCurrentOfflineVessel)
  const { dispatchCreateOfflineVessel, dispatchDeleteOfflineVessel, dispatchFetchOfflineVessel } =
    useOfflineVesselsAPI()

  useEffect(() => {
    dispatchFetchOfflineVessel(vesselProfileId)
  }, [vesselProfileId, dispatchFetchOfflineVessel])

 
  const dispatch = useDispatch()
  useEffect(() => {
    if (vesselId) {
      console.log(vesselId)
      dispatch(fetchVesselActivityThunk({vesselId}))
    }
  }, [dispatch, vesselId])
  return (
    <Fragment>
      <div className={styles.activityContainer}>

        <div className={styles.event}>
          <div>
            <i className={styles.eventIcon}></i>
          </div>
          <div className={styles.eventData}>
            <div className={styles.date}>
              2018/06/20 12:30
            </div>
            <div className={styles.description}>
            Entered Port of Pennington, Nigeria
            Entered Port of Pennington, Nigeria
            Entered Port of Pennington, Nigeria
            Entered Port of Pennington, Nigeria
            </div>
            
          </div>
          <div className={styles.actions}>
            <IconButton icon="info" size="small"></IconButton>
            <IconButton icon="view-on-map" size="small"></IconButton>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.event}>
          <div>
            <i className={styles.eventIcon}></i>
          </div>
          <div className={styles.eventData}>
            <div className={styles.date}>
              2018/06/20 12:30
            </div>
            <div className={styles.description}>
            Entered Port of Pennington, Nigeria
            </div>
            
          </div>
          <div className={styles.actions}>
            <IconButton icon="info" size="small"></IconButton>
            <IconButton icon="view-on-map" size="small"></IconButton>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.event}>
          <div>
            <i className={styles.eventIcon}></i>
          </div>
          <div className={styles.eventData}>
            <div className={styles.date}>
              2018/06/20 12:30
            </div>
            <div className={styles.description}>
            Entered Port of Pennington, Nigeria
            </div>
            
          </div>
        </div>
        <div className={styles.divider}></div>
      </div>
    </Fragment>
  )
}

export default Activity
