import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { ApiEvents } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import type { VesselEvent } from 'features/vessels/vessel/vessel.types'

import Event from '../activity/event/Event'

import insightStyles from './Insights.module.css'
import styles from './LonglineSetsGraph.module.css'

type LonglineCategory = 'entirelyDay' | 'mostlyDay' | 'mostlyNight' | 'entirelyNight'

const getLonglineCategory = (event: ApiEvents['entries'][number]): LonglineCategory => {
  const category = event.fishing?.dayNightCategory
  const fractionAtNight = event.fishing?.fractionAtNight ?? 0
  if (category === 'day') return 'entirelyDay'
  if (category === 'night') return 'entirelyNight'
  return fractionAtNight < 0.5 ? 'mostlyDay' : 'mostlyNight'
}

const CATEGORY_ORDER: LonglineCategory[] = [
  'entirelyDay',
  'mostlyDay',
  'mostlyNight',
  'entirelyNight',
]

const LonglineSetsGraph = ({
  data,
  loading,
  showEvents = true,
}: {
  data?: ApiEvents['entries']
  loading?: boolean
  showEvents?: boolean
}) => {
  const { t } = useTranslation()
  const [openCategory, setOpenCategory] = useState<LonglineCategory | null>(null)

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
    return CATEGORY_ORDER.map((key) => ({
      key,
      events: groups[key],
      count: groups[key].length,
      label: labels[key](groups[key].length),
    }))
  }, [data, t])

  return (
    <div>
      {loading ? (
        <div className={cx(styles.bar, styles.loading)} />
      ) : (
        <div className={styles.bar}>
          {sets.map(
            ({ key, count }) =>
              count > 0 && (
                <div
                  key={key}
                  className={cx(styles.barSegment, styles[key])}
                  style={{ flexGrow: count }}
                >
                  {count}
                </div>
              )
          )}
        </div>
      )}
      <ul>
        {sets.map(({ key, label, count, events }) => (
          <Fragment key={key}>
            <li className={styles.legend}>
              <span className={cx(styles.legendDot, styles[key])} />
              {label}
              {showEvents && count > 0 && (
                <IconButton
                  size="small"
                  onClick={() => setOpenCategory((open) => (open === key ? null : key))}
                  icon={openCategory === key ? 'arrow-top' : 'arrow-down'}
                  tooltip={
                    openCategory === key
                      ? t((t) => t.vessel.insights.gapsSeeLess)
                      : t((t) => t.vessel.insights.gapsSeeMore)
                  }
                />
              )}
            </li>
            {showEvents && openCategory === key && (
              <ul className={insightStyles.eventDetailsList}>
                {events.map((event) => (
                  <Event
                    key={event.id}
                    event={event as VesselEvent}
                    className={insightStyles.event}
                  />
                ))}
              </ul>
            )}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}

export default LonglineSetsGraph
