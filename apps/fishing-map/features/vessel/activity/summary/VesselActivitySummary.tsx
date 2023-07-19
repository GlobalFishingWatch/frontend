import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { Icon, IconType } from '@globalfishingwatch/ui-components'
import { Regions } from '@globalfishingwatch/api-types'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { selectEventsByType } from 'features/vessel/activity/activity-by-type/activity-by-type.selectors'
import useActivityEventConnect from 'features/vessel/activity/event/event.hook'
import styles from './VesselActivitySummary.module.css'

type RegionsList = Record<string, { id: string; region: keyof Regions; count: number }>
const RegionsLabel = ({ regions }: { regions: RegionsList }) => {
  const { getRegionNamesByType } = useActivityEventConnect()
  if (!Object.keys(regions).length) {
    return null
  }
  const [mainRegion, ...otherRegions] = Object.values(regions).sort((a, b) => b.count - a.count)
  const mainRegionName = getRegionNamesByType(mainRegion.region, [mainRegion.id])[0]
  if (!otherRegions.length) {
    return <span>{mainRegionName}</span>
  }
  return (
    <span>
      ({mainRegionName} and other {otherRegions.length} regions)
    </span>
  )
}

export const VesselActivitySummary = () => {
  const { t } = useTranslation()
  const eventsByType = useSelector(selectEventsByType)
  const regionsByType = useMemo(() => {
    if (!eventsByType) return {}
    return Object.keys(eventsByType).reduce((acc, eventType) => {
      const events = eventsByType[eventType]
      const plainRegions = events.flatMap((e) =>
        Object.entries(e.regions || {}).flatMap(([region, values]) =>
          values.map((id) => ({ region, id }))
        )
      )
      const regions = plainRegions.reduce((acc, region) => {
        if (region.region === 'fao') {
          return acc
        }
        if (!acc[region.id]) {
          acc[region.id] = { count: 1, region: region.region, id: region.id }
        } else {
          acc[region.id].count++
        }
        return acc
      }, {})
      acc[eventType] = regions
      return acc
    }, {})
  }, [eventsByType])

  return (
    <ul>
      {Object.entries(eventsByType).map(([eventType, events]) => {
        const regions = regionsByType[eventType]
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
            {regions && <RegionsLabel regions={regions} />}
          </li>
        )
      })}
    </ul>
  )
}
