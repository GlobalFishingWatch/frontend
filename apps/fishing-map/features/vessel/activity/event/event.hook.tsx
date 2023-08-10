import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { EventTypes, GapPosition } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from 'utils/dates'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { REGIONS_PRIORITY } from 'features/vessel/vessel.config'
import VesselLink from 'features/vessel/VesselLink'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { useRegionNamesByType } from 'features/regions/regions.hooks'

export function useActivityEventTranslations() {
  const { t } = useTranslation()
  const { getRegionNamesByType } = useRegionNamesByType()

  const getEventRegionDescription = useCallback(
    (event: ActivityEvent | GapPosition) => {
      const regionsDescription = REGIONS_PRIORITY.reduce((acc, regionType) => {
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

      return regionsDescription
    },
    [getRegionNamesByType]
  )

  const getEventDescription = useCallback(
    (event?: ActivityEvent) => {
      if (!event) return EMPTY_FIELD_PLACEHOLDER
      const regionDescription = getEventRegionDescription(event)
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
                {regionDescription && (
                  <span>
                    {t('common.in', 'in')} {regionDescription}
                  </span>
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
          return t(`event.port_${portType}ActionIn`, `${portType} {{port}}`, {
            port: formatInfoField(portLabel, 'port'),
          })
        case EventTypes.Loitering:
          return t('event.loiteringActionIn', 'Loitering in {{regionName}}', {
            regionName: regionDescription,
          })
        case EventTypes.Fishing:
          return t('event.fishingActionIn', 'Fished in {{regionName}}', {
            regionName: regionDescription,
          })
        case EventTypes.Gap:
          return t('event.gapActionIn', 'Likely Disabling in {{regionName}}', {
            regionName: regionDescription,
          })
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
