import { upperFirst } from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { EventTypes, GapPosition, Regions } from '@globalfishingwatch/api-types'
import { selectEEZs, selectFAOs, selectMPAs, selectRFMOs } from 'features/regions/regions.slice'
import { getUTCDateTime } from 'utils/dates'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { REGIONS_PRIORITY } from 'features/vessel/vessel.config'
import VesselLink from 'features/vessel/VesselLink'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'

function useActivityEventConnect() {
  const { t } = useTranslation()
  const eezs = useSelector(selectEEZs)
  const rfmos = useSelector(selectRFMOs)
  const mpas = useSelector(selectMPAs)
  const faos = useSelector(selectFAOs)

  const getRegionNamesByType = useCallback(
    (regionType: keyof Regions, values: string[]) => {
      if (!values?.length) return []
      const regions = { eez: eezs, rfmo: rfmos, mpa: mpas, fao: faos }[regionType] || []
      let labels = values
      if (regions?.length) {
        labels = values.flatMap(
          (id) =>
            regions
              .find((region) => region.id?.toString() === id)
              ?.label?.replace('Exclusive Economic Zone', t('layer.areas.eez', 'EEZ')) || []
        )
      }
      return labels
    },
    [eezs, faos, mpas, rfmos, t]
  )

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
                  {name} ({formatInfoField(flag, 'flag')})
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
          return t(`event.port_${portType}ActionIn`, `${portType} Port {{port}}`, {
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
      getRegionNamesByType,
      getEventDescription,
      getEventDurationDescription,
      getEventRegionDescription,
    }),
    [
      getEventDescription,
      getEventDurationDescription,
      getEventRegionDescription,
      getRegionNamesByType,
    ]
  )
}

export default useActivityEventConnect
