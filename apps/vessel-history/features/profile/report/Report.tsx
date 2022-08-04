import React, { Component , Fragment, useState, useEffect, useMemo, useCallback } from 'react';
import cx from 'classnames'
import { useSelector } from 'react-redux';
import { Button } from '@globalfishingwatch/ui-components';
import { EventTypes } from '@globalfishingwatch/api-types';
import useVoyagesConnect from 'features/vessels/voyages/voyages.hook';
import { selectReportRange } from 'routes/routes.selectors';
import { VesselWithHistory } from 'types';
import { EventTypeVoyage } from 'types/voyage';
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors';
import RiskSummary from 'features/risk-summary/risk-summary';
import { selectRiskSummaryTabVisible } from 'features/profile/profile.selectors';
import ActivityItem from '../components/activity/ActivityItem';
import Info from '../components/Info';
import styles from './Report.module.css'

interface ReportProps {
  vessel: VesselWithHistory
}

const Report: React.FC<ReportProps> = (props): React.ReactElement => {
  const vessel = props.vessel
  const dateRange = useSelector(selectReportRange)
  const riskSummaryTabVisible = useSelector(selectRiskSummaryTabVisible)
  const { eventsLoading, eventsExpanded } = useVoyagesConnect()
  const print = useCallback(() => {
    window.print()
  }, [])
  console.log(eventsExpanded)
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

  return (
    <Fragment>
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
          {riskSummaryTabVisible && (
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

          {events && events.length > 0 && events.map((event, index) =>
            <ActivityItem
              key={index}
              event={event}
              highlighted={false}
              printView={true}
            />
          )}
        </Fragment>
      )}

    </Fragment>
  )
}


export default Report;