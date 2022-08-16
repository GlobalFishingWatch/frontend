import React, { Component, Fragment, useState, useEffect, useMemo, useCallback } from 'react';
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux';
import { redirect } from 'redux-first-router';
import { Button } from '@globalfishingwatch/ui-components';
import { EventTypes } from '@globalfishingwatch/api-types';
import useVoyagesConnect from 'features/vessels/voyages/voyages.hook';
import { selectReportRange, selectUrlAkaVesselQuery, selectVesselProfileId } from 'routes/routes.selectors';
import { VesselWithHistory } from 'types';
import { EventTypeVoyage } from 'types/voyage';
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors';
import RiskSummary from 'features/risk-summary/risk-summary';
import { selectCurrentUserProfileHasInsurerPermission, selectCurrentUserProfileHasPortInspectorPermission } from 'features/profile/profile.selectors';
import ActivityByType from 'features/activity-by-type/activity-by-type';
import { useActivityByType } from 'features/activity-by-type/activity-by-type.hook';
import { PROFILE } from 'routes/routes';
import ActivityItem from '../components/activity/ActivityItem';
import Info from '../components/Info';
import Activity from '../components/activity/Activity';
import ActivityGroup from '../components/activity/ActivityGroup';
import styles from './Report.module.css'

interface ReportProps {
  vessel: VesselWithHistory
}

const Report: React.FC<ReportProps> = (props): React.ReactElement => {
  const vessel = props.vessel
  const dateRange = useSelector(selectReportRange)
  const currentProfileIsInsurer = useSelector(selectCurrentUserProfileHasInsurerPermission)
  const currentProfileIsPortInspector = useSelector(selectCurrentUserProfileHasPortInspectorPermission)
  const { eventsLoading, eventsExpanded } = useVoyagesConnect()
  const { eventsByType } = useActivityByType()
  const vesselProfileId = useSelector(selectVesselProfileId)
  const akaVesselProfileIds = useSelector(selectUrlAkaVesselQuery)
  const print = useCallback(() => {
    window.print()
  }, [])
  const dispatch = useDispatch()

  const goBack = useCallback(
    () => {
      let [dataset, gfwId, tmtId] = (
        Array.from(new URLSearchParams(vesselProfileId).keys()).shift() ?? ''
      ).split('_')

      dispatch(
        redirect({
          type: PROFILE,
          payload: {
            dataset: dataset,
            vesselID: gfwId,
            tmtID: tmtId
          },
          query: {
            aka: akaVesselProfileIds,
          }
        })
      )
    },
    [dispatch, vesselProfileId, akaVesselProfileIds]
  )
  const events = useMemo(() => {
    return eventsExpanded.filter(event => {
      const start = new Date(event.start)
      if (start && start > dateRange.start && start < dateRange.end) {
        return true
      }
      const end = new Date(event.end)
      if (end && end > dateRange.end && end < dateRange.end) {
        return true
      }
      if (start && start < dateRange.start && !end) {
        return true
      }
      if (start && end && start < dateRange.start && end > dateRange.end) {
        return true
      }

      return false
    })
  }, [eventsExpanded])
  const eventsSummary = useMemo(() => {
    return events.reduce(
      (summary, event: RenderedEvent) => {
        return {
          ...summary,
          fishingHours: event.type === EventTypes.Fishing ? (summary.fishingHours + (event.duration ?? 0)) : summary.fishingHours,
          [event.type]: (summary[event.type] ?? 0) + 1
        }
      }, { fishingHours: 0 }
    );
  }, [events])
  console.log(eventsByType)
  return (
    <Fragment>
      <Button onClick={goBack} className={cx(styles.backButton, 'no-print')}>Back</Button>
      <Button onClick={print} className={cx(styles.printButton, 'no-print')}>Print</Button>
      {!eventsLoading && (
        <Fragment>
          <h1 className={styles.title}>{vessel?.shipname}</h1>
          <Info
            vessel={vessel}
            expanded={true}
            printView={true}
            filterRange={dateRange}
            onMoveToMap={() => null}
          />
          {currentProfileIsInsurer && (
            <Fragment>
              <h1 className={styles.title}>Risk Summary</h1>
              <RiskSummary />
            </Fragment>
          )}

          <h1 className={styles.title}>Activity</h1>
          <h2 className={styles.title}>Activity Summary</h2>
          <div className={styles.container}>
            {eventsSummary[EventTypeVoyage.Voyage] && <p>{eventsSummary[EventTypeVoyage.Voyage]} of voyages</p>}
            {eventsSummary[EventTypes.Port] && <p>{eventsSummary[EventTypes.Port]} of port visits</p>}
            {eventsSummary[EventTypes.Fishing] && <p>{eventsSummary[EventTypes.Fishing]} of fishing events</p>}
            {eventsSummary[EventTypes.Encounter] && <p>{eventsSummary[EventTypes.Encounter]} of encounter events</p>}
            {eventsSummary[EventTypes.Loitering] && <p>{eventsSummary[EventTypes.Loitering]} of loitering events</p>}
            <p>{eventsSummary.fishingHours} fishing hours</p>
          </div>

          <h2 className={styles.title}>Activity Events</h2>
          {currentProfileIsPortInspector && events && events.length > 0 && events.map((event, index) =>
            <ActivityItem
              key={index}
              event={event}
              highlighted={false}
              printView={true}
            />
          )}
          {currentProfileIsInsurer && eventsByType.map((eventGroup, index) =>
            <Fragment>
              {eventGroup.group &&
                <ActivityGroup
                  key={index}
                  eventType={eventGroup.type}
                  loading={eventGroup.loading}
                  onToggleClick={() => null}
                  quantity={eventGroup.quantity}
                  status={eventGroup.status}
                ></ActivityGroup>}
              {eventGroup.events && eventGroup.events.map((event, index2) =>
                <ActivityItem
                  key={index2}
                  event={event}
                  printView={true}
                />
              )}
            </Fragment>
          )
          }
        </Fragment>
      )}

    </Fragment>
  )
}


export default Report;