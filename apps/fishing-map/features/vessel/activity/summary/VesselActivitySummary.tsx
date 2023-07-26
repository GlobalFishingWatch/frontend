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
} from 'features/vessel/activity/vessels-activity.selectors'
import { REGIONS_PRIORITY } from 'features/vessel/vessel.config'
import styles from './VesselActivitySummary.module.css'

const MAX_PORTS = 3

export const VesselActivitySummary = () => {
  const { t } = useTranslation()
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

  return (
    <div>
      <label>{t('common.summary', 'Summary')}</label>
      <ul>
        <li>
          {t('vessel.activeIn', 'Active in')}{' '}
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
        </li>
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
