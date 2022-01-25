import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { uniqBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { EventType } from '@globalfishingwatch/api-types'
import { Switch, SwitchEvent } from '@globalfishingwatch/ui-components'
import { EVENTS_COLORS } from 'data/config'
import { selectVisibleEvents } from 'features/app/app.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { getEventsDatasetsInDataview } from 'features/datasets/datasets.utils'
import { useLocationConnect } from 'routes/routes.hook'
import { upperFirst } from 'utils/info'
import { selectActiveVesselsDataviews } from 'features/dataviews/dataviews.slice'
import layerStyles from './VesselEventsLegend.module.css'

type VesselEventsLegendProps = {
  dataviews: UrlDataviewInstance[]
}

function VesselEventsLegend({ dataviews }: VesselEventsLegendProps): React.ReactElement | null {
  const { t } = useTranslation()
  const currentVisibleEvents = useSelector(selectVisibleEvents)
  const { dispatchQueryParams } = useLocationConnect()
  const tracks = useSelector(selectActiveVesselsDataviews)
  const eventDatasets = uniqBy(
    dataviews.flatMap((dataview) => getEventsDatasetsInDataview(dataview)),
    'id'
  )
  const allEventTypes = eventDatasets.flatMap((dataset) => dataset.configuration?.type || [])
  const showLegend =
    eventDatasets && eventDatasets?.length > 0 && dataviews.some((d) => d.config?.visible)

  const onEventChange = useCallback(
    (event: SwitchEvent) => {
      const eventTypeChanged = event.currentTarget.id as EventType
      if (!event.active) {
        const visibleEvents =
          currentVisibleEvents === 'all'
            ? allEventTypes.filter((eventType) => eventType !== eventTypeChanged)
            : [...(currentVisibleEvents === 'none' ? [] : currentVisibleEvents), eventTypeChanged]
        dispatchQueryParams({ visibleEvents })
      } else {
        const currentVisibleEventsTypes =
          currentVisibleEvents === 'all'
            ? allEventTypes
            : currentVisibleEvents === 'none'
            ? []
            : currentVisibleEvents
        const visibleEvents = currentVisibleEventsTypes.filter(
          (eventType) => eventTypeChanged !== eventType
        )
        dispatchQueryParams({ visibleEvents: visibleEvents?.length ? visibleEvents : 'none' })
      }
    },
    [dispatchQueryParams, allEventTypes, currentVisibleEvents]
  )

  const eventTypes = useMemo(() => {
    return eventDatasets.flatMap((dataset) => {
      const eventType = dataset.configuration?.type
      if (!eventType) return []
      const active =
        currentVisibleEvents === 'all'
          ? true
          : currentVisibleEvents === 'none'
          ? false
          : currentVisibleEvents.includes(eventType)
      return {
        datasetId: dataset.id,
        active,
        eventType,
      }
    })
  }, [eventDatasets, currentVisibleEvents])

  if (!showLegend) {
    return null
  }

  return (
    <div className={styles.content}>
      <ul className={layerStyles.eventsLegendContainer}>
        {eventTypes.map(({ datasetId, eventType, active }) => {
          return (
            <li
              key={datasetId}
              className={cx(layerStyles.eventsLegend, { [layerStyles.disabled]: !active })}
            >
              <div
                className={cx(layerStyles.icon, layerStyles[eventType], {
                  [styles.active]: active,
                })}
                style={{
                  backgroundColor:
                    eventType === 'fishing' && tracks.length === 1
                      ? tracks[0].config.color
                      : EVENTS_COLORS[eventType],
                }}
              />
              <Switch
                active={active}
                onClick={onEventChange}
                id={eventType}
                // color={EVENTS_COLORS[eventType]}
                className={layerStyles.eventsLegendSwitch}
              />
              <label className={layerStyles.eventLegendLabel} htmlFor={eventType}>
                {upperFirst(t(`event.${eventType}` as any, eventType))}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default VesselEventsLegend
