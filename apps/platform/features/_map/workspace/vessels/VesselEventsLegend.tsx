import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniqBy } from 'es-toolkit'

import type { EventType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { EVENTS_COLORS, FISHING_EVENT_SINGLE_TRACK_COLOR, PATH_BASENAME } from 'data/map/config'
import { getEventsDatasetsInDataview } from 'features/_map/datasets/datasets.utils'
import { selectActiveVesselsDataviews } from 'features/_map/dataviews/selectors/dataviews.categories.selectors'
import { selectVisibleEvents } from 'features/_map/workspace/selectors/app.selectors'
import { isVesselEventVisible } from 'features/_map/workspace/vessels/vessel-events.hooks'
import VesselEventToggle from 'features/_map/workspace/vessels/VesselEventToggle'
import { getDatasetSourceTranslated } from 'features/i18n/utils.datasets'

import layerStyles from './VesselEventsLegend.module.css'
import styles from 'features/_map/workspace/shared/Section.module.css'

type VesselEventsLegendProps = {
  dataviews: UrlDataviewInstance[]
}

function VesselEventsLegend({
  dataviews,
}: VesselEventsLegendProps): React.ReactElement<any> | null {
  const { t } = useTranslation()
  const currentVisibleEvents = useSelector(selectVisibleEvents)
  const tracks = useSelector(selectActiveVesselsDataviews)
  const eventDatasets = uniqBy(
    dataviews.flatMap((dataview) => getEventsDatasetsInDataview(dataview)),
    (d) => d.id
  )

  const showLegend =
    eventDatasets && eventDatasets?.length > 0 && dataviews.some((d) => d.config?.visible)

  const eventTypes = useMemo(() => {
    return eventDatasets.flatMap((dataset) => {
      const eventType = dataset.subcategory as EventType
      if (!eventType) return []
      return {
        datasetId: dataset.id,
        active: isVesselEventVisible(currentVisibleEvents, eventType),
        eventType,
      }
    })
  }, [eventDatasets, currentVisibleEvents])

  const uniqEventTypes = useMemo(() => uniqBy(eventTypes, (e) => e.eventType), [eventTypes])

  if (!showLegend) {
    return null
  }

  return (
    <ul className={layerStyles.eventsLegendContainer}>
      {uniqEventTypes.map(({ datasetId, eventType, active }) => {
        const color =
          eventType === 'fishing' && tracks.length === 1
            ? FISHING_EVENT_SINGLE_TRACK_COLOR
            : EVENTS_COLORS[eventType]
        return (
          <li
            key={datasetId}
            className={cx(
              layerStyles.eventsLegend,
              { [layerStyles.disabled]: !active },
              { 'print-hidden': !active }
            )}
          >
            <VesselEventToggle eventType={eventType} className={layerStyles.eventsLegendSwitch} />
            <label className={layerStyles.eventLegendLabel} htmlFor={eventType}>
              {t((t) => t.event[eventType], {
                defaultValue: eventType,
                source: getDatasetSourceTranslated(
                  eventDatasets.filter((d) => d.subcategory === eventType)
                ),
              })}
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
                    '--gapIcon': `url(${PATH_BASENAME}/images/event-gap.svg)`,
                  } as React.CSSProperties
                }
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default VesselEventsLegend
