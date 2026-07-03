import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useGetVesselEventsQuery } from 'queries/vessel-events-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { getVesselIdentities } from 'features/vessel/vessel.utils'

import InsightError from './InsightErrorMessage'

import styles from './InsightLongline.module.css'
import insightStyles from './Insights.module.css'

export const LONGLINE_FISHING_EVENTS_DATASET = 'public-global-longline-fishing-events:v4.0'

const InsightLongline = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const identities = getVesselIdentities(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })

  const { data, isFetching, error } = useGetVesselEventsQuery(
    {
      vessels: identities?.map((i) => i.id),
      datasets: [LONGLINE_FISHING_EVENTS_DATASET],
      'start-date': start,
      'end-date': end,
    },
    { skip: !identities?.length }
  )

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

  const totalSets = sets.reduce((acc, { count }) => acc + count, 0)

  return (
    <div id="longline" className={insightStyles.insightContainer}>
      <div className={insightStyles.insightTitle}>
        <label>{t((t) => t.vessel.insights.longline)}</label>
      </div>
      {isFetching ? (
        <div className={cx(styles.bar, styles.loading)} />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : totalSets === 0 ? (
        <p className={insightStyles.secondary}>{t((t) => t.vessel.insights.longlineEventsEmpty)}</p>
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
      {totalSets !== 0 && (
        <ul>
          {sets.map(({ key, label }) => (
            <li key={key} className={styles.legend}>
              <span className={cx(styles.legendDot, styles[key])} />
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default InsightLongline
