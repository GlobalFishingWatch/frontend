import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { EventTypes, GapPosition, Regions } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'
import { getUTCDateTime } from 'utils/dates'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { REGIONS_PRIORITY } from 'features/vessel/vessel.config'
import VesselLink from 'features/vessel/VesselLink'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { useRegionNamesByType } from 'features/regions/regions.hooks'
import styles from './Event.module.css'

export function useActivityEventTranslations() {
  const { t } = useTranslation()
  const { getRegionNamesByType } = useRegionNamesByType()

  const getEventRegionDescription = useCallback(
    (event: ActivityEvent | GapPosition) => {
      const mainRegionDescription = REGIONS_PRIORITY.reduce((acc, regionType) => {
        // We already have the most prioritized region, so we don't need to look for more
        if (!acc && event?.regions?.[regionType]?.length) {
          const values =
            event?.regions?.[regionType]?.flatMap((regionId) =>
              regionId.length ? `${regionId}` : []
            ) ?? []
          return `${getRegionNamesByType(regionType, values).join(', ')}`
        }
        return acc
      }, '')
      let allRegionsDescriptionBlocks: string[] = []
      if (event.regions) {
        Object.entries(event.regions).forEach(
          ([regionType, regions]: [keyof Regions, string[]]) => {
            if (!regions.length) return
            allRegionsDescriptionBlocks.push(
              `${t(`layer.areas.${regionType}`)}: ${getRegionNamesByType(regionType, regions).join(
                ', '
              )}`
            )
          }
        )
      }
      return {
        mainRegionDescription,
        allRegionsDescription: allRegionsDescriptionBlocks.map((block, index) => (
          <div key={index}>{block}</div>
        )),
      }
    },
    [getRegionNamesByType, t]
  )

  const getEventDescription = useCallback(
    (event?: ActivityEvent) => {
      if (!event) return EMPTY_FIELD_PLACEHOLDER
      const { mainRegionDescription, allRegionsDescription } = getEventRegionDescription(event)
      switch (event.type) {
        case EventTypes.Encounter:
          if (event.encounter?.vessel) {
            const { flag, id, name } = event.encounter.vessel
            return (
              // TODO check if we can get the dataset of the vessel encountered, using Identity for now
              <span>
                {t('event.encounterAction', 'had an encounter with')}{' '}
                <VesselLink vesselId={id}>
                  {formatInfoField(name, 'name')} ({formatInfoField(flag, 'flag')})
                </VesselLink>{' '}
                {mainRegionDescription && (
                  <Tooltip content={allRegionsDescription}>
                    <span className={styles.region}>
                      {t('common.in', 'in')} {mainRegionDescription}
                      {allRegionsDescription ? '...' : ''}
                    </span>
                  </Tooltip>
                )}
              </span>
            )
          } else return ''
        case EventTypes.Port:
          const { name, flag } = event.port_visit?.intermediateAnchorage ?? {}
          const portType = event.subType || event.type
          const portLabel = name
            ? [name, ...(flag ? [t(`flags:${flag}`, flag.toLocaleUpperCase())] : [])].join(', ')
            : ''
          return t(`event.${portType}ActionIn`, `${portType} {{port}}`, {
            port: formatInfoField(portLabel, 'port'),
          })
        case EventTypes.Loitering:
          return (
            mainRegionDescription && (
              <Tooltip content={allRegionsDescription}>
                <span className={styles.region}>
                  {t('event.loiteringActionIn', 'Loitering in {{regionName}}', {
                    regionName: mainRegionDescription,
                  })}
                  {allRegionsDescription ? '...' : ''}
                </span>
              </Tooltip>
            )
          )
        case EventTypes.Fishing:
          return (
            mainRegionDescription && (
              <Tooltip content={allRegionsDescription}>
                <span className={styles.region}>
                  {t('event.fishingActionIn', 'Fished in {{regionName}}', {
                    regionName: mainRegionDescription,
                  })}
                  {allRegionsDescription ? '...' : ''}
                </span>
              </Tooltip>
            )
          )
        case EventTypes.Gap:
          return (
            mainRegionDescription && (
              <Tooltip content={allRegionsDescription}>
                <span className={styles.region}>
                  {t('event.gapActionIn', 'Likely Disabling in {{regionName}}', {
                    regionName: mainRegionDescription,
                  })}
                  {allRegionsDescription ? '...' : ''}
                </span>
              </Tooltip>
            )
          )
        default:
          return t('event.unknown', 'Unknown event')
      }
    },
    [getEventRegionDescription, t]
  )

  const getEventDurationDescription = useCallback(
    (event: ActivityEvent) => {
      const durationDiff = getUTCDateTime(event.end as number).diff(
        getUTCDateTime(event.start as number),
        ['days', 'hours', 'minutes']
      )
      const duration = durationDiff.toObject()

      const durationDescription =
        event.end > event.start
          ? [
              duration.days && duration.days > 0
                ? t('event.dayAbbreviated', '{{count}}d', { count: duration.days })
                : '',
              duration.hours && duration.hours > 0
                ? t('event.hourAbbreviated', '{{count}}h', { count: duration.hours })
                : '',
              duration.minutes && duration.minutes > 0
                ? t('event.minuteAbbreviated', '{{count}}m', {
                    count: Math.round(duration.minutes as number),
                  })
                : '',
            ].join(' ')
          : null
      return durationDescription
    },
    [t]
  )

  return useMemo(
    () => ({
      getEventDescription,
      getEventDurationDescription,
      getEventRegionDescription,
    }),
    [getEventDescription, getEventDurationDescription, getEventRegionDescription]
  )
}
