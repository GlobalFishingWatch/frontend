import React, { Fragment, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ImageGallery from 'react-image-gallery'
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
import { selectEventsForTracks } from 'features/vessels/activity/vessels-activity.slice'
import InfoField, { VesselFieldLabel } from './InfoField'
import styles from './Info.module.css'
import 'react-image-gallery/styles/css/image-gallery.css'

interface InfoProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
}

const Info: React.FC<InfoProps> = (props): React.ReactElement => {
  const vessel = props.vessel
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const vesselId = useSelector(selectVesselId)
  const eventsForTracks = useSelector(selectEventsForTracks) ?? []
  const activities = useMemo(() => eventsForTracks.map((e) => e.data).flat(), [eventsForTracks])
  const vesselTmtId = useSelector(selectTmtId)
  const vesselDataset = useSelector(selectDataset)
  const vesselProfileId = useSelector(selectVesselProfileId)
  const offlineVessel = useSelector(selectCurrentOfflineVessel)
  const { dispatchCreateOfflineVessel, dispatchDeleteOfflineVessel, dispatchFetchOfflineVessel } =
    useOfflineVesselsAPI()

  useEffect(() => {
    dispatchFetchOfflineVessel(vesselProfileId)
  }, [vesselProfileId, dispatchFetchOfflineVessel])

  const onDeleteClick = async (data: OfflineVessel) => {
    setLoading(true)
    await dispatchDeleteOfflineVessel(data.profileId)
    setLoading(false)
  }

  const onSaveClick = async (data: VesselWithHistory) => {
    setLoading(true)
    await dispatchCreateOfflineVessel({
      vessel: {
        ...data,
        profileId: data.id,
        id: vesselId,
        dataset: vesselDataset,
        vesselMatchId: vesselTmtId,
        source: '',
        activities: activities,
        savedOn: DateTime.utc().toISO(),
      },
    })
    setLoading(false)
  }

  const imageList = useMemo(
    () => (vessel?.imageList ?? []).map((url) => ({ original: url })),
    [vessel]
  )
  const [imageLoading, setImageLoading] = useState(true)
  return (
    <Fragment>
      <div className={styles.infoContainer}>
        {vessel && (
          <Fragment>
            <ImageGallery
              items={imageList}
              onImageLoad={() => setImageLoading(false)}
              showThumbnails={false}
              showBullets={true}
              slideDuration={5000}
              showPlayButton={imageList.length > 1}
              additionalClass={cx(styles.imageGallery, { [styles.loading]: imageLoading })}
            />
            <div className={styles.identifiers}>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.name}
                value={vessel.shipname}
                valuesHistory={vessel.history.shipname.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.type}
                value={vessel.type ?? ''}
                valuesHistory={vessel.history.vesselType.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.flag}
                value={vessel.flag}
                valuesHistory={vessel.history.flag.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.mmsi}
                value={vessel.mmsi ?? ''}
                valuesHistory={vessel.history.mmsi.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.imo}
                value={vessel.imo ?? ''}
                valuesHistory={vessel.history.imo.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.callsign}
                value={vessel.callsign ?? ''}
                valuesHistory={vessel.history.callsign.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.geartype}
                value={vessel.geartype ?? ''}
                valuesHistory={vessel.history.geartype.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.length}
                value={vessel.length ?? ''}
                valuesHistory={vessel.history.length.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.grossTonnage}
                value={vessel.grossTonnage ?? ''}
                valuesHistory={vessel.history.grossTonnage.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.depth}
                value={vessel.depth ?? ''}
                valuesHistory={vessel.history.depth.byDate}
              ></InfoField>
              <div className={styles.identifierField}>
                <label>{t('vessel.authorization_plural', 'authorizations')}</label>
                {vessel.authorizations?.map((auth) => (
                  <p key={auth}>{auth}</p>
                ))}
                {!vessel.authorizations?.length && (
                  <p>{t('vessel.noAuthorizations', 'No authorizations found')}</p>
                )}
              </div>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.builtYear}
                value={vessel.builtYear ?? ''}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.owner}
                value={vessel.owner ?? ''}
                valuesHistory={vessel.history.owner.byDate}
              ></InfoField>
              <InfoField
                vesselName={vessel.shipname ?? ''}
                label={VesselFieldLabel.operator}
                value={vessel.operator ?? ''}
                valuesHistory={vessel.history.operator.byDate}
              ></InfoField>
            </div>
          </Fragment>
        )}
        <div className={styles.actions}>
          {vessel && offlineVessel && (
            <Fragment>
              <div className={styles.readyForOffline}>
                {t('vessel.readyForOfflineView', 'READY FOR OFFLINE VIEW')}
              </div>
              <IconButton
                size="default"
                icon="delete"
                type="warning"
                className={cx(styles.defaultIcon, styles.remove)}
                loading={loading}
                tooltip={t('vessel.remove', 'Remove')}
                tooltipPlacement={'top'}
                onClick={() => onDeleteClick(offlineVessel)}
              />
            </Fragment>
          )}
          {vessel && !offlineVessel && (
            <Button
              className={styles.saveButton}
              type="secondary"
              disabled={loading}
              onClick={() => onSaveClick(vessel)}
            >
              {t('vessel.saveForOfflineView', 'SAVE VESSEL FOR OFFLINE VIEW')}
            </Button>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default Info
