import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import ImageGallery from 'react-image-gallery'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { DateTime, Interval } from 'luxon'
import type { VesselWithHistory } from 'types'

import type { VesselTypeV2 } from '@globalfishingwatch/api-types'
import { Button, IconButton } from '@globalfishingwatch/ui-components'

import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { TMT_CONTACT_US_URL } from 'data/constants'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import I18nDate, { formatI18nSpecialDate } from 'features/i18n/i18nDate'
import { useUser } from 'features/user/user.hooks'
import { selectUserData } from 'features/user/user.slice'
import { useOfflineVesselsAPI } from 'features/vessels/offline-vessels.hook'
import { selectCurrentOfflineVessel } from 'features/vessels/offline-vessels.selectors'
import {
  selectAdvancedSearchFields,
  selectDataset,
  selectTmtId,
  selectUrlAkaVesselQuery,
  selectUrlQuery,
  selectVesselId,
} from 'routes/routes.selectors'
import type { OfflineVessel } from 'types/vessel'
import { VesselFieldLabel } from 'types/vessel'
import { getUTCDateTime } from 'utils/dates'

import { selectCurrentUserProfileHasPortInspectorPermission } from '../profile.selectors'

import AuthorizationsField from './AuthorizationsField'
import ForcedLabor from './ForcedLabor'
// import Highlights from './Highlights'
import HistoryDate from './HistoryDate'
import InfoField from './InfoField'

import 'react-image-gallery/styles/css/image-gallery.css'
import styles from './Info.module.css'

interface InfoProps {
  vessel: VesselWithHistory | null
  lastPosition: any
  lastPortVisit: any
  onMoveToMap: () => void
}

const Info: React.FC<InfoProps> = (props): React.ReactElement<any> => {
  const vessel = props.vessel
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const vesselId = useSelector(selectVesselId)
  const vesselTmtId = useSelector(selectTmtId)
  const vesselDataset = useSelector(selectDataset)
  const akaVesselProfileIds = useSelector(selectUrlAkaVesselQuery)
  const { authorizedFLRM } = useUser()
  const offlineVessel = useSelector(selectCurrentOfflineVessel)
  const { dispatchCreateOfflineVessel, dispatchDeleteOfflineVessel, dispatchFetchOfflineVessels } =
    useOfflineVesselsAPI()
  const isMergedVesselsView = useMemo(
    () => akaVesselProfileIds && akaVesselProfileIds.length > 0,
    [akaVesselProfileIds]
  )
  const currentProfileIsPortInspector = useSelector(
    selectCurrentUserProfileHasPortInspectorPermission
  )

  useEffect(() => {
    dispatchFetchOfflineVessels()
  }, [dispatchFetchOfflineVessels])

  const onDeleteClick = useCallback(
    (data: OfflineVessel) => {
      const now = DateTime.utc()
      const savedOn = getUTCDateTime(data.savedOn)
      const i = Interval.fromDateTimes(savedOn, now)
      trackEvent({
        category: TrackCategory.OfflineAccess,
        action: 'Remove saved vessel for offline view',
        label: JSON.stringify({ page: 'vessel detail' }),
        value: Math.floor(i.length('days')),
      })
      setLoading(true)
      dispatchDeleteOfflineVessel(data)
      dispatchFetchOfflineVessels()
      setLoading(false)
    },
    [dispatchDeleteOfflineVessel, dispatchFetchOfflineVessels]
  )

  const onSaveClick = async (data: VesselWithHistory) => {
    setLoading(true)
    trackEvent({
      category: TrackCategory.OfflineAccess,
      action: 'Save vessel for offline view',
      label: JSON.stringify({
        gfw: vesselId,
        tmt: vesselTmtId,
      }),
    })
    await dispatchCreateOfflineVessel({
      vessel: {
        ...data,
        vesselType: data.vesselType as VesselTypeV2,
        profileId: data.id,
        id: vesselId,
        dataset: vesselDataset,
        vesselMatchId: vesselTmtId,
        source: '',
        aka: akaVesselProfileIds,
        savedOn: DateTime.utc().toISO(),
        relatedVessels: [],
      },
    })
    setLoading(false)
  }

  const datesTemplate = (firstSeen, originalFirstSeen) => (
    <HistoryDate date={firstSeen} originalDate={originalFirstSeen} />
  )
  const imageList = useMemo(
    () => (vessel?.imageList ?? []).map((url) => ({ original: url })),
    [vessel]
  )

  const [imageLoading, setImageLoading] = useState(true)

  const { email = '' } = useSelector(selectUserData) || { email: '' }
  const query = useSelector(selectUrlQuery)
  const advancedSearch = useSelector(selectAdvancedSearchFields)
  const searchContext = useMemo(
    () => `Vessel Viewer > Detail: ${vessel?.shipname}`,
    [vessel?.shipname]
  )
  const contactUsLink = useMemo(
    () =>
      `${TMT_CONTACT_US_URL}&email=${encodeURIComponent(
        email
      )}&usercontext=${searchContext}&data=${JSON.stringify({
        name: query,
        ...advancedSearch,
        tmtMatchId: vesselTmtId,
        gfwId: vesselId,
        vesselName: vessel?.shipname,
        vesselType: vessel?.type,
        vesselFlag: vessel?.flag,
        vesselMmsi: vessel?.mmsi,
        vesselImo: vessel?.imo,
        vesselCallsign: vessel?.callsign,
        vesselGeartype: vessel?.geartype,
      })}`,
    [advancedSearch, email, query, searchContext, vessel, vesselId, vesselTmtId]
  )

  const onContactUsClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.VesselDetailInfoTab,
      action: 'Click Contact Us ',
      label: JSON.stringify({
        tmtMatchId: vesselTmtId,
        gfwId: vesselId,
      }),
    })
  }, [vesselId, vesselTmtId])

  const builtYear = useMemo(
    () =>
      vessel.builtYear && /\d{4}/.test(vessel.builtYear)
        ? `${vessel.builtYear}`.slice(0, 4)
        : vessel.builtYear,
    [vessel.builtYear]
  )

  return (
    <Fragment>
      <div className={styles.infoContainer}>
        {vessel && (
          <Fragment>
            <div className={styles.imageAndFields}>
              {imageList.length > 0 && (
                <ImageGallery
                  items={imageList}
                  onImageLoad={() => setImageLoading(false)}
                  showThumbnails={false}
                  showBullets={true}
                  slideDuration={5000}
                  showPlayButton={imageList.length > 1}
                  additionalClass={cx(styles.imageGallery, { [styles.loading]: imageLoading })}
                />
              )}
              <div className={styles.identifiers}>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.name}
                  value={vessel.shipname}
                  valuesHistory={vessel.history.shipname.byDate}
                ></InfoField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.type}
                  value={vessel.vesselType as string}
                  valuesHistory={vessel.history.vesselType.byDate}
                  includeFaq={true}
                  helpText={
                    <Trans i18nKey="vessel.vesselTypeDescription">
                      For vessel type sourced from Global Fishing Watch additional research and
                      analysis is conducted in addition to using the original AIS data to identify
                      the most likely value. Vessel types from GFW include fishing vessels, carrier
                      vessels, and support vessels. The vessel classification for fishing vessel is
                      estimated using known registry information in combination with a convolutional
                      neural network used to estimate vessel class. The vessel classifcation for
                      carrier vessels is estimated using a cumulation of known registry information,
                      manual review, and vessel class. All support vessels in the Vessel Viewer are
                      considered Purse Seine Support Vessels based on internal review.
                    </Trans>
                  }
                ></InfoField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.flag}
                  value={vessel.flag}
                  valuesHistory={vessel.history.flag.byDate}
                ></InfoField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.mmsi}
                  value={vessel.mmsi}
                  valuesHistory={vessel.history.mmsi.byDate}
                ></InfoField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.imo}
                  value={vessel.imo}
                  hideTMTDate={true}
                  valuesHistory={vessel.history.imo.byDate}
                ></InfoField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.callsign}
                  value={vessel.callsign}
                  valuesHistory={vessel.history.callsign.byDate}
                ></InfoField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.geartype}
                  value={vessel.geartype}
                  includeFaq={true}
                  valuesHistory={vessel.history.geartype.byDate}
                  helpText={
                    <Trans i18nKey="vessel.geartypeDescription">
                      Likely gear type of vessel as defined by Global Fishing Watch. The vessel
                      classification for fishing vessel is estimated using known registry
                      information in combination with a convolutional neural network used to
                      estimate vessel class, see more information here:
                      <a
                        href="https://globalfishingwatch.org/datasets-and-code-vessel-identity/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        https://globalfishingwatch.org/datasets-and-code-vessel-identity/
                      </a>{' '}
                      . The vessel classifcation for carrier vessels is estimated using a cumulation
                      of known registry information. All support vessels in the Vessel Viewer are
                      considered Purse Seine Support Vessels based on internal review.
                    </Trans>
                  }
                ></InfoField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.length}
                  value={vessel.length}
                  hideTMTDate={true}
                  valuesHistory={vessel.history.length.byDate}
                ></InfoField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.grossTonnage}
                  value={vessel.grossTonnage}
                  hideTMTDate={true}
                  valuesHistory={vessel.history.grossTonnage.byDate}
                ></InfoField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.depth}
                  value={vessel.depth}
                  hideTMTDate={true}
                  valuesHistory={vessel.history.depth.byDate}
                ></InfoField>
                <AuthorizationsField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.authorizations}
                  authorizations={vessel?.authorizations}
                ></AuthorizationsField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.builtYear}
                  hideTMTDate={true}
                  value={builtYear}
                ></InfoField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.owner}
                  value={vessel.owner}
                  valuesHistory={vessel.history.owner.byDate}
                ></InfoField>
                <InfoField
                  vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                  label={VesselFieldLabel.operator}
                  value={vessel.operator}
                  valuesHistory={vessel.history.operator.byDate}
                ></InfoField>

                <div className={styles.identifierField}>
                  <label>{t(`vessel.aisTransmission_plural`, 'AIS Positions')}</label>
                  <div>
                    {vessel.firstTransmissionDate || vessel.lastTransmissionDate ? (
                      <Fragment>
                        {t('common.from', 'from')}{' '}
                        {vessel.firstTransmissionDate ? (
                          <I18nDate date={vessel.firstTransmissionDate} />
                        ) : (
                          DEFAULT_EMPTY_VALUE
                        )}{' '}
                        {t('common.to', 'to')}{' '}
                        {vessel.lastTransmissionDate ? (
                          <I18nDate date={vessel.lastTransmissionDate} />
                        ) : (
                          DEFAULT_EMPTY_VALUE
                        )}
                      </Fragment>
                    ) : (
                      DEFAULT_EMPTY_VALUE
                    )}
                  </div>
                </div>
                {currentProfileIsPortInspector && (
                  <InfoField
                    vesselName={vessel.shipname ?? DEFAULT_EMPTY_VALUE}
                    label={VesselFieldLabel.iuuStatus}
                    modalTitle={t(
                      'vessel.iuuStatusModalTitle',
                      'RFMO blancklist presence for {{vesselName}}',
                      {
                        vesselName: vessel.shipname ?? DEFAULT_EMPTY_VALUE,
                      }
                    )}
                    columnHeaders={{
                      field: t('common.rmfo', 'RMFO'),
                      dates: t('common.listedOn', 'Listed on'),
                    }}
                    datesTemplate={datesTemplate}
                    value={
                      vessel.iuuStatus !== undefined
                        ? t(
                            `vessel.iuuStatusOptions.${vessel.iuuStatus}` as any,
                            vessel.iuuStatus.toString()
                          ) +
                          (vessel.iuuListing
                            ? ' - ' +
                              vessel.iuuListing.value +
                              ' ' +
                              formatI18nSpecialDate({
                                date: vessel.iuuListing.originalFirstSeen,
                                format: { year: 'numeric' },
                              })
                            : '')
                        : DEFAULT_EMPTY_VALUE
                    }
                    valuesHistory={vessel.history.iuuListing?.byDate}
                    helpText={
                      <Trans i18nKey="vessel.iuuStatusDescription">
                        [TDB] IUU status description to be defined
                      </Trans>
                    }
                  ></InfoField>
                )}
              </div>
            </div>
            {authorizedFLRM && <ForcedLabor vessel={vessel} />}
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
        <div className={styles.contactUs}>
          <Trans i18nKey="vessel.contactUs">
            <a
              href={contactUsLink}
              rel="noopener noreferrer"
              target="_blank"
              onClick={onContactUsClick}
            >
              contact us
            </a>{' '}
            if you have questions or would like more information about this vessel.
          </Trans>
        </div>
        {/* <Highlights onMoveToMap={props.onMoveToMap}></Highlights> */}
      </div>
    </Fragment>
  )
}

export default Info
