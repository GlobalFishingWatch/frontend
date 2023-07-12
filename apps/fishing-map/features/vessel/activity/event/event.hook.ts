import { upperFirst } from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { EventTypes, GapPosition, Regions } from '@globalfishingwatch/api-types'
import { EMPTY_API_VALUES } from 'features/reports/reports.selectors'
import { RegionType, selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.slice'
import { getUTCDateTime } from 'utils/dates'
import {
  ActivityEvent,
  PortVisitSubEvent,
} from 'features/vessel/activity/vessels-activity.selectors'

const regionsPriority: (keyof Regions)[] = ['mpa', 'eez', 'rfmo']
function useActivityEventConnect() {
  const { t } = useTranslation()
  const eezs = useSelector(selectEEZs)
  const rfmos = useSelector(selectRFMOs)
  const mpas = useSelector(selectMPAs)

  const getEventRegionDescription = useCallback(
    (event: ActivityEvent | GapPosition) => {
      const getRegionNamesByType = (regionType: keyof Regions, values: string[]) => {
        const regions = { eez: eezs, rfmo: rfmos, mpa: mpas }[regionType] || []
        let label = values
        if (regions?.length) {
          label = values.flatMap(
            (id) =>
              regions
                .find((region) => region.id?.toString() === id)
                ?.label?.replace('Exclusive Economic Zone', t('layer.areas.eez', 'EEZ')) || []
          )
        }
        return label.join(', ')
      }

      const regionsDescription = regionsPriority.reduce((acc, regionType) => {
        // We already have the most prioritized region, so we don't need to look for more
        if (!acc && event?.regions?.[regionType]?.length) {
          const values = event?.regions[regionType].flatMap((regionId) =>
            regionId.length ? `${regionId}` : []
          )
          return `${getRegionNamesByType(regionType, values)}`
        }
        return acc
      }, '')

      return regionsDescription
    },
    [eezs, mpas, rfmos, t]
  )

  const getEventDescription = useCallback(
    (event?: ActivityEvent) => {
      if (!event) return EMPTY_API_VALUES
      let description = ''
      const regionDescription = getEventRegionDescription(event)
      switch (event.type) {
        case EventTypes.Encounter:
          if (event.encounter) {
            description = regionDescription
              ? t('event.encounterActionIn', 'had an encounter with {{vessel}} in {{regionName}}', {
                  vessel:
                    event.encounter.vessel.name ??
                    t('event.encounterAnotherVessel', 'another vessel'),
                  regionName: regionDescription,
                })
              : t('event.encounterActionWithNoRegion', 'Encounter with {{vessel}}', {
                  vessel:
                    event.encounter.vessel.name ??
                    t('event.encounterAnotherVessel', 'another vessel'),
                })
          }
          break
        case EventTypes.Port:
          const { name, flag } = event.port_visit?.intermediateAnchorage ?? {}
          let portType: EventTypes.Port | PortVisitSubEvent = event.type
          if (event.id.endsWith(PortVisitSubEvent.Exit)) {
            portType = PortVisitSubEvent.Exit
          } else if (event.id.endsWith(PortVisitSubEvent.Entry)) {
            portType = PortVisitSubEvent.Entry
          }
          const portLabel = name
            ? [name, ...(flag ? [t(`flags:${flag}`, flag.toLocaleUpperCase())] : [])].join(', ')
            : ''
          description = t(
            `event.port_${portType}ActionIn`,
            `${upperFirst(portType)} Port {{port}}`,
            {
              port: portLabel,
            }
          )
          break
        case EventTypes.Loitering:
          description = t('event.loiteringActionIn', 'Loitering in {{regionName}}', {
            regionName: regionDescription,
          })
          break
        case EventTypes.Fishing:
          description = t('event.fishingActionIn', 'Fishing in {{regionName}}', {
            regionName: regionDescription,
          })
          break
        case EventTypes.Gap:
          description = t('event.gapActionIn', 'Likely Disabling in {{regionName}}', {
            regionName: regionDescription,
          })
          break
        default:
          description = t('event.unknown', 'Unknown event')
      }

      return description
    },
    [getEventRegionDescription, t]
  )

  const getEventDurationDescription = useCallback(
    (event: ActivityEvent) => {
      const durationDiff = getUTCDateTime(event.end as number).diff(
        getUTCDateTime(event.start as number),
        ['hours', 'minutes']
      )
      const duration = durationDiff.toObject()

      const durationDescription =
        event.end > event.start
          ? [
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

export default useActivityEventConnect
