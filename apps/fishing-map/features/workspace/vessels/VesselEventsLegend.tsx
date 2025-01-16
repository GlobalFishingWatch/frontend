import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniqBy } from 'es-toolkit'

import type { EventType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { SwitchEvent } from '@globalfishingwatch/ui-components'
import { Switch } from '@globalfishingwatch/ui-components'

import { EVENTS_COLORS, PATH_BASENAME } from 'data/config'
import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { getEventsDatasetsInDataview } from 'features/datasets/datasets.utils'
import { selectActiveVesselsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import { useVisibleVesselEvents } from 'features/workspace/vessels/vessel-events.hooks'
import { upperFirst } from 'utils/info'

import layerStyles from './VesselEventsLegend.module.css'

type VesselEventsLegendProps = {
  dataviews: UrlDataviewInstance[]
}

function VesselEventsLegend({ dataviews }: VesselEventsLegendProps): React.ReactElement<any> | null {
  const { t } = useTranslation()
  const currentVisibleEvents = useSelector(selectVisibleEvents)
  const { setVesselEventVisibility } = useVisibleVesselEvents()
  const tracks = useSelector(selectActiveVesselsDataviews)
  const eventDatasets = uniqBy(
    dataviews.flatMap((dataview) => getEventsDatasetsInDataview(dataview)),
    (d) => d.id
  )

  const showLegend =
    eventDatasets && eventDatasets?.length > 0 && dataviews.some((d) => d.config?.visible)

  const onEventChange = useCallback(
    (event: SwitchEvent) => {
      const eventTypeChanged = event.currentTarget.id as EventType
      setVesselEventVisibility({ event: eventTypeChanged, visible: !event.active })
    },
    [setVesselEventVisibility]
  )

  const eventTypes = useMemo(() => {
    return eventDatasets.flatMap((dataset) => {
      const eventType = dataset.subcategory as EventType
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
          const color =
            eventType === 'fishing' && tracks.length === 1 ? '#ffffff' : EVENTS_COLORS[eventType]
          return (
            <li
              key={datasetId}
              className={cx(
                layerStyles.eventsLegend,
                { [layerStyles.disabled]: !active },
                { 'print-hidden': !active }
              )}
            >
              <Switch
                active={active}
                onClick={onEventChange}
                id={eventType}
                className={layerStyles.eventsLegendSwitch}
                color={EVENTS_COLORS[eventType]}
              />
              <label className={layerStyles.eventLegendLabel} htmlFor={eventType}>
                {upperFirst(t(`event.${eventType}` as any, eventType) as any)}
              </label>
              <div className={cx(layerStyles.iconWrapper, layerStyles[eventType])}>
                <div
                  className={cx(layerStyles.icon, {
                    [styles.active]: active,
                  })}
                  style={
                    {
                      '--color': color,
                      '--encounterIcon': `url(${PATH_BASENAME}/images/event-encounter.svg)`,
                      '--loiteringIcon': `url(${PATH_BASENAME}/images/event-loitering.svg)`,
                      '--portIcon': `url(${PATH_BASENAME}/images/event-port.svg)`,
                    } as React.CSSProperties
                  }
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default VesselEventsLegend
