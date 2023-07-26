import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { Icon, IconType, Tooltip } from '@globalfishingwatch/ui-components'
import { EventTypes } from '@globalfishingwatch/api-types'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import useActivityEventConnect from 'features/vessel/activity/event/event.hook'
import {
  selectActivitySummary,
  selectEventsGroupedByType,
  selectVoyagesNumber,
} from 'features/vessel/activity/vessels-activity.selectors'
import { REGIONS_PRIORITY } from 'features/vessel/vessel.config'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { formatInfoField } from 'utils/info'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { selectTimeRange } from 'features/app/app.selectors'
import { selectVesselEventsFilteredByTimerange } from 'features/vessel/vessel.selectors'
import styles from './VesselActivitySummary.module.css'

const MAX_PORTS = 3

export const VesselActivitySummary = () => {
  const { t } = useTranslation()
  const vessel = useSelector(selectVesselInfoData)
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const voyages = useSelector(selectVoyagesNumber)
  const timerange = useSelector(selectTimeRange)
  const eventsByType = useSelector(selectEventsGroupedByType)
  const { getRegionNamesByType } = useActivityEventConnect()
  const { activityRegions, mostVisitedPorts } = useSelector(selectActivitySummary)
  const activityRegionsLength = Object.keys(activityRegions).length
  const threeMostVisitedPorts = mostVisitedPorts.slice(0, MAX_PORTS)
  const restMostVisitedPorts = mostVisitedPorts.slice(MAX_PORTS)
  const restTooltipContent = useMemo(
    () =>
      restMostVisitedPorts.length > 0 && (
        <ul>
          {restMostVisitedPorts.map(({ port, count }) => {
            return (
              <li key={port}>
                {port} ({<I18nNumber number={count} />}{' '}
                {t('common.event', { defaultValue: 'events', count })})
              </li>
            )
          })}
        </ul>
      ),
    [restMostVisitedPorts, t]
  )

  const summary = t('vessel.summary', {
    defaultValue:
      'The <strong>{{vesselType}}</strong> vessel flagged by <strong>{{vesselFlag}}</strong> {{events}} {{voyages}} between <strong>{{timerangeStart}}</strong> and <strong>{{timerangeEnd}}</strong>',
    vesselType: formatInfoField(
      getVesselProperty(vessel, { property: 'shiptype' }) as string,
      'vesselType'
    ).toLowerCase(),
    vesselFlag: formatInfoField(getVesselProperty(vessel, { property: 'flag' }) as string, 'flag'),
    events: `${t('common.had', 'had')} <strong>${formatI18nNumber(
      events?.length as number
    )}</strong> ${t('common.event', { defaultValue: 'events', count: events?.length })}`,
    voyages:
      voyages !== 0
        ? `${t('common.in', 'in')} <strong>${formatI18nNumber(voyages as number)}</strong> ${t(
            'vessel.voyage',
            { defaultValue: 'voyages', count: voyages }
          )}`
        : '',
    timerangeStart: formatI18nDate(timerange?.start),
    timerangeEnd: formatI18nDate(timerange?.end),
  })

  return (
    <div>
      <h2 className={styles.summary}>
        <span dangerouslySetInnerHTML={{ __html: summary }}></span>
        <span>
          {t('common.in', 'in')}{' '}
          {REGIONS_PRIORITY.map((regionType, index) => {
            if (activityRegions[regionType] && activityRegions[regionType].length !== 0) {
              const tooltipContent = (
                <ul>
                  {activityRegions[regionType]
                    .sort((a, b) => b.count - a.count)
                    .map(({ id, count }) => {
                      return (
                        <li key={id}>
                          {getRegionNamesByType(regionType, [id])[0] || id} (
                          {<I18nNumber number={count} />}{' '}
                          {t('common.event', { defaultValue: 'events', count })})
                        </li>
                      )
                    })}
                </ul>
              )
              return (
                <Tooltip key={regionType} content={tooltipContent}>
                  <span className={styles.area}>
                    {activityRegions[regionType].length}{' '}
                    {t(`layer.areas.${regionType}`, {
                      defaultvalue: regionType,
                      count: activityRegions[regionType].length,
                    })}
                    {(regionType === 'fao' || regionType === 'rfmo') && (
                      <span>
                        {' '}
                        {t(`common.area`, {
                          defaultValue: 'areas',
                          count: activityRegions[regionType].length,
                        })}
                      </span>
                    )}
                    {index < activityRegionsLength - 1 && ', '}
                  </span>
                </Tooltip>
              )
            }
            return null
          })}
          .
        </span>
      </h2>
      <ul className={styles.summary}>
        {Object.entries(eventsByType).map(([eventType, events]) => {
          return (
            <li key={eventType} className={styles.eventsCount}>
              <div className={styles.iconContainer}>
                <Icon icon={`event-legend-${eventType}` as IconType} type="original-colors" />
              </div>
              <strong>{formatI18nNumber(events.length)}</strong>
              {t(`event.${eventType}` as any, {
                defaultValue: eventType,
                count: events.length,
              })}
              {eventType === EventTypes.Port && threeMostVisitedPorts.length > 0 && (
                <span>
                  (
                  {threeMostVisitedPorts.map(({ port, count }) => {
                    return (
                      <Tooltip
                        key={port}
                        content={`${count} ${t('common.event', { defaultValue: 'events', count })}`}
                      >
                        <span>{port}</span>
                      </Tooltip>
                    )
                  })}
                  {restMostVisitedPorts.length > 0 && (
                    <Tooltip content={restTooltipContent}>
                      <span>{` ${t('common.and', 'and')} ${restMostVisitedPorts.length} ${t(
                        'common.more',
                        'more'
                      )}`}</span>
                    </Tooltip>
                  )}
                  )
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
