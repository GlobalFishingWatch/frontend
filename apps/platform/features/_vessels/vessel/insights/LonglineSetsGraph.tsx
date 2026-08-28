import type { CSSProperties, ReactNode } from 'react'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { kebabCase } from 'es-toolkit'

import type { ApiEvents } from '@globalfishingwatch/api-types'
import type { LonglineCategory } from '@globalfishingwatch/deck-loaders'
import { getLonglineCategory, LONGLINE_CATEGORY_COLORS } from '@globalfishingwatch/deck-loaders'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'

import { useHighlightedEventsConnect } from 'features/_map/timebar/timebar.hooks'
import { useVesselEventBounds } from 'features/_vessels/vessel/activity/event/event.bounds'
import { selectLonglineSetsOnMap } from 'features/_vessels/vessel/vessel.config.selectors'
import { useVesselProfileLayer } from 'features/_vessels/vessel/vessel.hooks'
import type { VesselEvent } from 'features/_vessels/vessel/vessel.types'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'

import Event from '../activity/event/Event'

import insightStyles from './Insights.module.css'
import styles from './LonglineSetsGraph.module.css'

const CATEGORY_ORDER: LonglineCategory[] = [
  'entirelyDay',
  'mostlyDay',
  'mostlyNight',
  'entirelyNight',
]

const CATEGORY_COLOR_VARS = Object.fromEntries(
  CATEGORY_ORDER.map((key) => [`--longline-${kebabCase(key)}`, LONGLINE_CATEGORY_COLORS[key]])
) as CSSProperties

const LonglineSetsGraph = ({
  data,
  loading,
  showEvents = true,
  renderCategoryContent,
  onCategoryToggle,
}: {
  data?: ApiEvents['entries']
  loading?: boolean
  showEvents?: boolean
  /** Replaces the default flat event list shown when a category is expanded.
   * Only one category is open at a time, so the content can key its own state on the vessel alone */
  renderCategoryContent?: (events: ApiEvents['entries']) => ReactNode
  onCategoryToggle?: (category: LonglineCategory | null) => void
}) => {
  const { t } = useTranslation()
  const [openCategory, setOpenCategory] = useState<LonglineCategory | null>(null)
  const { dispatchHighlightedEvents } = useHighlightedEventsConnect()
  const longlineSetsOnMap = useSelector(selectLonglineSetsOnMap)
  const vesselLayer = useVesselProfileLayer()
  const fitEventBounds = useVesselEventBounds(vesselLayer)

  const onEventHover = useCallback(
    (event?: VesselEvent) => {
      dispatchHighlightedEvents(event?.id ? [event.id] : [])
    },
    [dispatchHighlightedEvents]
  )

  const onEventMapClick = useCallback(
    (event: VesselEvent) => {
      const { lon, lat } = event.position || {}
      fitEventBounds({
        ...event,
        ...(lon !== undefined && lat !== undefined && { coordinates: [lon, lat] }),
      } as VesselEvent)
    },
    [fitEventBounds]
  )

  const sets = useMemo(() => {
    const groups: Record<LonglineCategory, ApiEvents['entries']> = {
      entirelyDay: [],
      mostlyDay: [],
      mostlyNight: [],
      entirelyNight: [],
    }
    ;(data || []).forEach((event) => {
      groups[getLonglineCategory(event)].push(event)
    })
    const labels: Record<LonglineCategory, (count: number) => string> = {
      entirelyDay: (count) => t((t) => t.vessel.insights.longlineEntirelyDaySets, { count }),
      mostlyDay: (count) => t((t) => t.vessel.insights.longlineMostlyDaySets, { count }),
      mostlyNight: (count) => t((t) => t.vessel.insights.longlineMostlyNightSets, { count }),
      entirelyNight: (count) => t((t) => t.vessel.insights.longlineEntirelyNightSets, { count }),
    }
    // Same sentences without the count, for while the events are still loading
    const labelsWithoutCount: Record<LonglineCategory, string> = {
      entirelyDay: t((t) => t.vessel.insights.longlineEntirelyDaySetsLabel),
      mostlyDay: t((t) => t.vessel.insights.longlineMostlyDaySetsLabel),
      mostlyNight: t((t) => t.vessel.insights.longlineMostlyNightSetsLabel),
      entirelyNight: t((t) => t.vessel.insights.longlineEntirelyNightSetsLabel),
    }
    const total = data?.length || 0
    return CATEGORY_ORDER.map((key) => ({
      key,
      events: groups[key],
      count: groups[key].length,
      label: labels[key](groups[key].length),
      labelWithoutCount: labelsWithoutCount[key],
      percentage: total ? (groups[key].length / total) * 100 : 0,
    }))
  }, [data, t])

  return (
    <div style={CATEGORY_COLOR_VARS}>
      {loading ? (
        <div className={cx(styles.bar, styles.loading)} />
      ) : (
        <div className={styles.bar}>
          {sets.map(
            ({ key, count, percentage }) =>
              count > 0 && (
                <Tooltip
                  key={key}
                  content={`${formatI18nNumber(percentage, { maximumFractionDigits: 1 })}%`}
                >
                  <div className={cx(styles.barSegment, styles[key])} style={{ flexGrow: count }}>
                    {count}
                  </div>
                </Tooltip>
              )
          )}
        </div>
      )}
      <ul>
        {sets.map(({ key, label, labelWithoutCount, count, events }) => (
          <Fragment key={key}>
            <li className={styles.legend}>
              <span className={cx(styles.legendDot, styles[key])} />
              {/* every count is still 0 while loading, and rendering them reads as real data */}
              {loading ? labelWithoutCount : label}
              {showEvents && count > 0 && (
                <IconButton
                  size="small"
                  onClick={() => {
                    // computed outside the updater so StrictMode's double invoke can't double fire
                    const next = openCategory === key ? null : key
                    setOpenCategory(next)
                    onCategoryToggle?.(next)
                  }}
                  icon={openCategory === key ? 'arrow-top' : 'arrow-down'}
                  tooltip={
                    openCategory === key
                      ? t((t) => t.vessel.insights.gapsSeeLess)
                      : t((t) => t.vessel.insights.gapsSeeMore)
                  }
                />
              )}
            </li>
            {showEvents &&
              openCategory === key &&
              (renderCategoryContent ? (
                renderCategoryContent(events)
              ) : (
                <ul className={insightStyles.eventDetailsList}>
                  {events.map((event) => (
                    <Event
                      key={event.id}
                      event={event as VesselEvent}
                      className={insightStyles.event}
                      onMapHover={longlineSetsOnMap ? onEventHover : undefined}
                      onMapClick={longlineSetsOnMap ? onEventMapClick : undefined}
                    />
                  ))}
                </ul>
              ))}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}

export default LonglineSetsGraph
