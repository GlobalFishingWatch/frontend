import React, { useCallback } from 'react'
import { uniqBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { EventType } from '@globalfishingwatch/api-types'
import { EVENTS_COLORS } from 'data/config'
import { selectVisibleEvents } from 'features/app/app.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { getEventsDatasetsInDataview } from 'features/datasets/datasets.utils'
import { useLocationConnect } from 'routes/routes.hook'
import { upperFirst } from 'utils/info'
import layerStyles from './VesselSection.module.css'

type VesselEventsLegendProps = {
  dataviews: UrlDataviewInstance[]
}

function VesselEventsLegend({ dataviews }: VesselEventsLegendProps): React.ReactElement | null {
  const { t } = useTranslation()
  const currentVisibleEvents = useSelector(selectVisibleEvents)
  const { dispatchQueryParams } = useLocationConnect()
  const eventDatasets = uniqBy(
    dataviews.flatMap((dataview) => getEventsDatasetsInDataview(dataview)),
    'id'
  )
  const allEventTypes = eventDatasets.flatMap((dataset) => dataset.configuration?.type || [])
  const showLegend =
    eventDatasets && eventDatasets?.length > 0 && dataviews.some((d) => d.config?.visible)

  const onEventChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked
      const eventTypeChanged = event.target.id as EventType
      if (checked) {
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

  if (!showLegend) {
    return null
  }

  return (
    <div className={styles.content}>
      <ul className={layerStyles.eventsLegendContainer}>
        {eventDatasets.map((dataset) => {
          const eventType = dataset.configuration?.type
          if (!eventType) return null
          return (
            <li
              key={dataset.id}
              className={layerStyles.eventsLegend}
              style={{ color: EVENTS_COLORS[eventType] }}
            >
              <input
                id={eventType}
                type="checkbox"
                onChange={onEventChange}
                className={layerStyles.eventLegendCheckbox}
                checked={
                  currentVisibleEvents === 'all'
                    ? true
                    : currentVisibleEvents === 'none'
                    ? false
                    : currentVisibleEvents.includes(eventType)
                }
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
