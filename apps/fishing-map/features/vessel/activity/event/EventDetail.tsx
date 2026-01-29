import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import type { EventNextPort, EventType } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'
import { IconButton, Spinner } from '@globalfishingwatch/ui-components'

import { EVENTS_COLORS } from 'data/config'
import { getHasVesselProfileInstance } from 'features/dataviews/dataviews.utils'
import { selectWorkspaceDataviewInstancesMerged } from 'features/dataviews/selectors/dataviews.merged.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import PortsReportLink from 'features/reports/report-port/PortsReportLink'
import { useActivityEventTranslations } from 'features/vessel/activity/event/event.hook'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import { useVesselProfileEncounterLayer } from 'features/vessel/vessel.hooks'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'

import type { VesselEvent } from './Event'

import styles from './Event.module.css'

interface ActivityContentProps {
  event: VesselEvent
}

const AUTH_AREAS = ['CCSBT', 'IATTC', 'ICCAT', 'IOTC', 'NPFC', 'SPRFMO', 'WCPFC']

const EventDetail = ({ event }: ActivityContentProps) => {
  const { t } = useTranslation()
  const { getEventDurationDescription } = useActivityEventTranslations()
  const vesselProfileEncounterLayer = useVesselProfileEncounterLayer()
  const workspaceDataviewInstancesMerged = useSelector(selectWorkspaceDataviewInstancesMerged)

  const TimeFields = ({ type }: { type?: EventType }) => (
    <Fragment>
      <li>
        <label className={styles.fieldLabel}>
          {type === EventTypes.Port
            ? t((t) => t.eventInfo.port_entry)
            : t((t) => t.eventInfo.start)}
        </label>
        <span>{formatI18nDate(event.start, { format: DateTime.DATETIME_FULL })}</span>
      </li>
      <li>
        <label className={styles.fieldLabel}>
          {type === EventTypes.Port ? t((t) => t.eventInfo.port_exit) : t((t) => t.eventInfo.end)}
        </label>
        <span>{formatI18nDate(event.end, { format: DateTime.DATETIME_FULL })}</span>
      </li>
      <li>
        <label className={styles.fieldLabel}>{t((t) => t.eventInfo.duration)}</label>
        <span>{getEventDurationDescription(event)}</span>
      </li>
    </Fragment>
  )
  // const DistanceFields = () => (
  //   <Fragment>
  //     <li>
  //       <label className={styles.fieldLabel}>
  //         {t((t) => t.eventInfo.distanceFromShoreKm)}
  //       </label>
  //       <span>{event.distances?.startDistanceFromShoreKm || EMPTY_FIELD_PLACEHOLDER}</span>
  //     </li>
  //     <li>
  //       <label className={styles.fieldLabel}>
  //         {t((t) => t.eventInfo.distanceFromPortKm)}
  //       </label>
  //       <span>{event.distances?.startDistanceFromPortKm || EMPTY_FIELD_PLACEHOLDER}</span>
  //     </li>
  //   </Fragment>
  // )

  const PortVisitedAfterField = ({ nextPort }: { nextPort: EventNextPort | undefined }) => {
    return (
      <li>
        <label className={styles.fieldLabel}>{t((t) => t.eventInfo.portVisitedAfter)}</label>
        <span>
          {nextPort?.id ? (
            <PortsReportLink port={nextPort}>
              {formatInfoField(nextPort.name || nextPort.id, 'port')} (
              {formatInfoField(nextPort.flag, 'flag')})
            </PortsReportLink>
          ) : (
            EMPTY_FIELD_PLACEHOLDER
          )}
        </span>
      </li>
    )
  }

  const authAreas = event.regions?.rfmo.filter((rfmo) => AUTH_AREAS.includes(rfmo)).sort()

  if (event.type === EventTypes.Encounter) {
    const { name, id, dataset, flag, ssvid, type } = event.encounter?.vessel || {}
    const isEncounterInstanceInWorkspace = getHasVesselProfileInstance({
      dataviews: workspaceDataviewInstancesMerged!,
      vesselId: id!,
      origin: 'vesselProfile',
    })
    const isLoading =
      !id || !vesselProfileEncounterLayer?.id.includes(id) || !vesselProfileEncounterLayer?.loaded
    return (
      <ul className={styles.detailContainer}>
        <label className={styles.blockLabel}>{t((t) => t.eventInfo.eventInfo)}</label>
        <TimeFields />
        <li>
          <label className={styles.fieldLabel}>{t((t) => t.eventInfo.medianSpeedKnots)}</label>
          <span>{event.encounter?.medianSpeedKnots?.toFixed(2) || EMPTY_FIELD_PLACEHOLDER}</span>
        </li>
        <PortVisitedAfterField nextPort={event.vessel.nextPort} />
        <div className={styles.divider} />
        <label className={styles.blockLabel}>{t((t) => t.eventInfo.encounteredVesselName)}</label>
        <li>
          <label className={styles.fieldLabel}>{t((t) => t.eventInfo.name)}</label>
          <span className={styles.vesselNameWithPin}>
            {isLoading && isEncounterInstanceInWorkspace ? (
              <Spinner size="tiny" className={styles.spinner} />
            ) : (
              <VesselPin
                vesselToResolve={{
                  id: id as string,
                  datasetId: (dataset as string) || DEFAULT_VESSEL_IDENTITY_ID,
                }}
                size="tiny"
                origin="vesselProfile"
              />
            )}
            <VesselLink vesselId={id} datasetId={dataset}>
              {formatInfoField(name, 'shipname')}
            </VesselLink>
          </span>
        </li>
        <li>
          <label className={styles.fieldLabel}>{t((t) => t.eventInfo.flag)}</label>
          <span>{formatInfoField(flag, 'flag')}</span>
        </li>
        <li>
          <label className={styles.fieldLabel}>{t((t) => t.eventInfo.mmsi)}</label>
          <span>{ssvid || EMPTY_FIELD_PLACEHOLDER}</span>
        </li>
        <li>
          <label className={styles.fieldLabel}>{t((t) => t.vessel.shiptype)}</label>
          <span>{formatInfoField(type, 'vesselType')}</span>
        </li>
        {!isEncounterInstanceInWorkspace && (
          <div className={styles.trackDisclaimer}>
            <IconButton
              icon="track"
              size="small"
              style={{ backgroundColor: EVENTS_COLORS.encounter }}
              loading={isLoading}
            />
            {t((t) => t.eventInfo.trackDisclaimer)}
          </div>
        )}
        <Fragment>
          <div className={styles.divider} />
          <table className={styles.authTable}>
            <thead>
              <tr>
                <th>
                  <label>
                    {t((t) => t.eventInfo.authorization)}
                    <DataTerminology
                      title={t((t) => t.eventInfo.authorization)}
                      terminologyKey="authorization"
                    />
                  </label>
                </th>
                {authAreas?.map((rfmo) => {
                  return <th key={rfmo}>{rfmo}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {authAreas?.length && authAreas.length > 0 ? (
                <Fragment>
                  <tr>
                    <td>{formatInfoField(event.vessel.name, 'shipname')}</td>
                    {authAreas?.map((rfmo) => {
                      const mainVesselAuth = event.vessel.publicAuthorizations?.find(
                        (auth) => auth.rfmo === rfmo
                      )
                      return (
                        <td key={rfmo}>
                          {mainVesselAuth?.hasPubliclyListedAuthorization === 'true' ? (
                            <span className={styles.tick}>
                              <IconButton
                                icon="tick"
                                size="tiny"
                                type="solid"
                                className={styles.disabled}
                              />
                            </span>
                          ) : (
                            <span className={styles.secondary}>{EMPTY_FIELD_PLACEHOLDER}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <td>{formatInfoField(name, 'shipname')}</td>
                    {authAreas?.map((rfmo) => {
                      const secondaryVesselAuth =
                        event.encounter?.vessel?.publicAuthorizations?.find(
                          (auth) => auth.rfmo === rfmo
                        )
                      return (
                        <td key={rfmo}>
                          {secondaryVesselAuth?.hasPubliclyListedAuthorization === 'true' ? (
                            <span className={styles.tick}>
                              <IconButton
                                icon="tick"
                                size="tiny"
                                type="solid"
                                className={styles.disabled}
                              />
                            </span>
                          ) : (
                            <span className={styles.secondary}>{EMPTY_FIELD_PLACEHOLDER}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                </Fragment>
              ) : (
                <tr>
                  <td>
                    <p className={styles.secondary}>{t((t) => t.eventInfo.authorizationEmpty)}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Fragment>
      </ul>
    )
  } else if (event.type === EventTypes.Fishing) {
    return (
      <ul className={styles.detailContainer}>
        <TimeFields />
        {/* <DistanceFields /> */}
        <li>
          <label className={styles.fieldLabel}>{t((t) => t.eventInfo.averageSpeedKnots)}</label>
          <span>{event.fishing?.averageSpeedKnots.toFixed(2) || EMPTY_FIELD_PLACEHOLDER}</span>
        </li>
      </ul>
    )
  } else if (event.type === EventTypes.Loitering) {
    return (
      <ul className={styles.detailContainer}>
        <TimeFields />
        {/* <DistanceFields /> */}
        <li>
          <label className={styles.fieldLabel}>{t((t) => t.eventInfo.totalDistanceKm)}</label>
          <span>{event.loitering?.totalDistanceKm.toFixed(2) || EMPTY_FIELD_PLACEHOLDER}</span>
        </li>
        <li>
          <label className={styles.fieldLabel}>{t((t) => t.eventInfo.averageSpeedKnots)}</label>
          <span>{event.loitering?.averageSpeedKnots.toFixed(2) || EMPTY_FIELD_PLACEHOLDER}</span>
        </li>
        <PortVisitedAfterField nextPort={event.vessel.nextPort} />
      </ul>
    )
  } else if (event.type === EventTypes.Port) {
    return (
      <ul className={styles.detailContainer}>
        <TimeFields type={event.type} />
      </ul>
    )
  }
}

export default EventDetail
