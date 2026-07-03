import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { ApiEvents } from '@globalfishingwatch/api-types'

import styles from './LonglineSetsGraph.module.css'

const LonglineSetsGraph = ({
  data,
  loading,
}: {
  data?: ApiEvents['entries']
  loading?: boolean
}) => {
  const { t } = useTranslation()

  const sets = useMemo(() => {
    const counts = (data || []).reduce(
      (acc, event) => {
        const category = event.fishing?.dayNightCategory
        if (category === 'night') acc.night++
        else if (category === 'over_dawn' || category === 'over_dusk') acc.mostlyNight++
        else if (category === 'day') acc.day++
        return acc
      },
      { night: 0, mostlyNight: 0, day: 0 }
    )
    return [
      { key: 'night', count: counts.night, label: t((t) => t.vessel.insights.longlineNightSets) },
      {
        key: 'mostlyNight',
        count: counts.mostlyNight,
        label: t((t) => t.vessel.insights.longlineMostlyNightSets),
      },
      { key: 'day', count: counts.day, label: t((t) => t.vessel.insights.longlineDaySets) },
    ]
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
        {sets.map(({ key, label }) => (
          <li key={key} className={styles.legend}>
            <span className={cx(styles.legendDot, styles[key])} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LonglineSetsGraph
