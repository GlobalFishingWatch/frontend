import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { EventType } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'
import { EVENTS_COLORS } from '@globalfishingwatch/deck-loaders'
import type { IconType, SwitchEvent } from '@globalfishingwatch/ui-components'
import { Icon, Switch, Tooltip } from '@globalfishingwatch/ui-components'

import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import I18nNumber, { formatI18nNumber } from 'features/i18n/i18nNumber'
import { useRegionNamesByType } from 'features/regions/regions.hooks'
import { EVENTS_ORDER } from 'features/vessel/activity/activity-by-type/ActivityByType'
import VesselActivityDownload from 'features/vessel/activity/VesselActivityDownload'
import {
  selectActivitySummary,
  selectEventsGroupedByType,
  selectVoyagesNumber,
} from 'features/vessel/activity/vessels-activity.selectors'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectVesselEventsFilteredByTimerange } from 'features/vessel/selectors/vessel.resources.selectors'
import { REGIONS_PRIORITY } from 'features/vessel/vessel.config'
import { useVisibleVesselEvents } from 'features/workspace/vessels/vessel-events.hooks'
import { formatInfoField } from 'utils/info'

import styles from './VesselActivitySummary.module.css'

const MAX_PORTS = 3

export const VesselActivitySummary = () => {
  const { t } = useTranslation()
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const voyages = useSelector(selectVoyagesNumber)
  const timerange = useSelector(selectTimeRange)
  const visibleEvents = useSelector(selectVisibleEvents)
  const { setVesselEventVisibility } = useVisibleVesselEvents()
  const eventsByType = useSelector(selectEventsGroupedByType)
  const { getRegionNamesByType } = useRegionNamesByType()
  const { activityRegions, mostVisitedPortCountries, fishingHours } =
    useSelector(selectActivitySummary)
  const activityRegionsLength = Object.keys(activityRegions).length
  const threeMostVisitedPortCountries = mostVisitedPortCountries.slice(0, MAX_PORTS)
  const restMostVisitedPortCountries = mostVisitedPortCountries.slice(MAX_PORTS)
  const restTooltipContent = useMemo(
    () =>
      restMostVisitedPortCountries.length > 0 && (
        <ul>
          {restMostVisitedPortCountries.map(({ flag, count }) => {
            return (
              <li key={flag}>
                {formatInfoField(flag, 'flag')} ({<I18nNumber number={count} />}{' '}
                {t('event.port_visit', {
                  defaultValue: 'port visit',
                  count,
                })}
                )
              </li>
            )
          })}
        </ul>
      ),
    [restMostVisitedPortCountries, t]
  )

  const summary = t('vessel.summary', {
    defaultValue:
      '{{events}} {{voyages}} between <strong>{{timerangeStart}}</strong> and <strong>{{timerangeEnd}}</strong>',
    events: `<strong>${formatI18nNumber(events?.length as number)}</strong> ${t('common.event', {
      defaultValue: 'events',
      count: events?.length,
    })}`,
    voyages:
      voyages !== 0 && (visibleEvents.includes('port_visit') || visibleEvents === 'all')
        ? `${t('common.in', 'in')} <strong>${formatI18nNumber(voyages as number)}</strong> ${t(
            'vessel.voyage',
            { defaultValue: 'voyages', count: voyages }
          )}`
        : '',
    timerangeStart: formatI18nDate(timerange?.start),
    timerangeEnd: formatI18nDate(timerange?.end),
  })
  const hasActivityRegionsData = REGIONS_PRIORITY.some(
    (regionType) => activityRegions[regionType] && activityRegions[regionType].length !== 0
  )

  const onEventChange = useCallback(
    (event: SwitchEvent) => {
      const eventTypeChanged = event.currentTarget.id as EventType
      setVesselEventVisibility({ event: eventTypeChanged, visible: !event.active })
    },
    [setVesselEventVisibility]
  )

  return (
    <div className={styles.summaryContainer}>
      <h2 className="print-only">{t('vessel.sectionActivity', 'activity')}</h2>
      <div className={styles.container}>
        <h2 className={styles.summary}>
          <span dangerouslySetInnerHTML={{ __html: summary }}></span>
          {hasActivityRegionsData ? (
            <span>
              {' '}
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
                      <span className={styles.help}>
                        {activityRegions[regionType].length}{' '}
                        {t(`layer.areas.${regionType}` as any, {
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
          ) : (
            <span>.</span>
          )}
        </h2>
        <ul>
          {EVENTS_ORDER.map((eventType) => {
            const events = eventsByType[eventType]
            const active =
              visibleEvents === 'all'
                ? true
                : visibleEvents === 'none'
                  ? false
                  : visibleEvents.includes(eventType)
            return (
              <li key={eventType} className={styles.eventTypeRowContainer}>
                <Switch
                  active={active}
                  onClick={onEventChange}
                  id={eventType}
                  color={eventType === EventTypes.Fishing ? '#163f89bf' : EVENTS_COLORS[eventType]}
                  className={cx(styles.eventSwitch, 'print-hidden')}
                />
                <div className={cx(styles.eventTypeRow, { [styles.active]: active })}>
                  <span className={styles.iconContainer}>
                    {eventType !== EventTypes.Fishing ? (
                      <Icon icon={`event-legend-${eventType}` as IconType} type="original-colors" />
                    ) : (
                      <div
                        className={styles.fishingIcon}
                        style={{ backgroundColor: EVENTS_COLORS[eventType] }}
                      />
                    )}
                  </span>
                  <p data-test={`vv-summary-${eventType}`}>
                    {active && <strong>{formatI18nNumber(events?.length || 0)} </strong>}
                    {t(`event.${eventType}` as any, {
                      defaultValue: eventType,
                      count: events?.length || 0,
                    })}{' '}
                    {active && eventType === EventTypes.Fishing && fishingHours !== 0 && (
                      <span>
                        (
                        <I18nNumber number={fishingHours} /> {t('common.hour_other', 'hours')})
                      </span>
                    )}
                    {eventType === EventTypes.Port && threeMostVisitedPortCountries.length > 0 && (
                      <span>
                        (
                        {threeMostVisitedPortCountries.map(({ flag, count }, index) => {
                          return (
                            <Tooltip
                              key={flag}
                              content={`${count} ${t('event.port_visit', {
                                defaultValue: 'port visit',
                                count,
                              })}`}
                            >
                              <span className={styles.help}>
                                {formatInfoField(flag, 'flag')}
                                {index < threeMostVisitedPortCountries.length - 1 ? ', ' : ''}
                              </span>
                            </Tooltip>
                          )
                        })}
                        {restMostVisitedPortCountries.length > 0 && (
                          <Tooltip content={restTooltipContent}>
                            <span className={styles.help}>{` ${t('common.and', 'and')} ${
                              restMostVisitedPortCountries.length
                            } ${t('common.more', 'more')}`}</span>
                          </Tooltip>
                        )}
                        )
                      </span>
                    )}
                  </p>
                  <DataTerminology
                    size="tiny"
                    type="default"
                    title={t(`event.${eventType}`, eventType)}
                    terminologyKey={eventType as any}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <VesselActivityDownload />
    </div>
  )
}
