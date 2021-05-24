import React, { Fragment, useEffect, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
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
import styles from './Info.module.css'

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
      <div className={styles.infoContainer}>
        sadasds
        
      </div>
    </Fragment>
  )
}

export default Activity
