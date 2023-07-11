import { upperFirst } from 'lodash'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { EventTypes, GapPosition, Regions } from '@globalfishingwatch/api-types'
import { EMPTY_API_VALUES } from 'features/reports/reports.selectors'
import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.slice'
import { ActivityEvent } from 'types/activity'
import { getUTCDateTime } from 'utils/dates'
import { getEEZName } from 'utils/region-name-transform'

function useActivityEventConnect() {
  const { t } = useTranslation()
  const eezs = useSelector(selectEEZs)
  const rfmos = useSelector(selectRFMOs)
  const mpas = useSelector(selectMPAs)

  const getEventRegionDescription = useCallback(
    (event: ActivityEvent | GapPosition) => {
      const getRegionNamesByType = (regionType: string, values: string[]) => {
        switch (regionType) {
          case 'eez':
            return values
              .map((eezId) =>
                getEEZName(
                  eezs.find((eez) => {
                    return eez.id?.toString() === eezId
                  })
                )
              )
              .filter((value) => value.length > 0)
              .join(', ')
          case 'rfmo':
            return values
              .map((regionId) => rfmos.find((rfmo) => rfmo.id.toString() === regionId)?.label ?? '')
              .filter((value) => value.length > 0)
              .join(', ')
          case 'mpa':
            return values
              .map((mpaId) => mpas.find((mpa) => mpa.id.toString() === mpaId)?.label ?? '')
              .filter((value) => value.length > 0)
              .join(', ')
          default:
            return values.join(', ')
        }
      }
      const regionsDescription = (['eez', 'rfmo', 'mpa'] as (keyof Regions)[])
        // use only regions with values
        .filter((regionType) => event?.regions && event?.regions[regionType]?.length > 0)
        // retrieve its corresponding names
        .map((regionType) =>
          event?.regions && event?.regions[regionType]
            ? `${getRegionNamesByType(
                regionType,
                event?.regions[regionType]
                  .map((regionId) => `${regionId}`)
                  .filter((x: string) => x.length > 0)
              )}`
            : ''
        )
        // combine all the regions with commas
        .join(', ')

      return regionsDescription ?? ''
    },
    [eezs, rfmos, mpas]
  )

  const getEventDescription = (event?: ActivityEvent) => {
    if (!event) return EMPTY_API_VALUES
    let description = ''
    const regionDescription = getEventRegionDescription(event)
    switch (event.type) {
      case EventTypes.Encounter:
        if (event.encounter) {
          description = regionDescription
            ? t(
                'dataTerminology:event.encounterActionWith',
                'had an encounter with {{vessel}} in {{regionName}}',
                {
                  vessel:
                    event.encounter.vessel.name ??
                    t('dataTerminology:event.encounterAnotherVessel', 'another vessel'),
                  regionName: regionDescription,
                }
              )
            : t('dataTerminology:event.encounterActionWithNoRegion', 'Encounter with {{vessel}}', {
                vessel:
                  event.encounter.vessel.name ??
                  t('dataTerminology:event.encounterAnotherVessel', 'another vessel'),
              })
        }
        break
      case EventTypes.Port:
        const { name, flag } = [
          event.port_visit?.intermediateAnchorage,
          event.port_visit?.startAnchorage,
          event.port_visit?.endAnchorage,
        ].reduce(
          (prev, curr) => {
            if (prev.name && prev.flag) return prev
            if (curr?.name && curr?.flag) return { name: curr.name, flag: curr.flag }
            return prev
          },
          { name: undefined, flag: undefined }
        )

        const portType = event.id.endsWith('-exit') ? 'exited' : 'entered'
        if (name) {
          const portLabel = [
            name,
            ...(flag ? [t(`flags:${flag}`, flag.toLocaleUpperCase())] : []),
          ].join(', ')
          description = t(
            `dataTerminology:event.${portType}PortAt`,
            `${upperFirst(portType)} Port {{port}}`,
            {
              port: portLabel,
            }
          )
        } else {
          description = t(
            `dataTerminology:event.${portType}PortAction`,
            `${upperFirst(portType)} Port`
          )
        }
        break
      case EventTypes.Loitering:
        description = t('dataTerminology:event.loiteringAction', 'Loitering in {{regionName}}', {
          regionName: regionDescription,
        })
        break
      case EventTypes.Fishing:
        description = t('dataTerminology:event.fishingAction', 'Fishing in {{regionName}}', {
          regionName: regionDescription,
        })
        break
      case EventTypes.Gap:
        description = t('dataTerminology:event.gapAction', 'Likely Disabling in {{regionName}}', {
          regionName: regionDescription,
        })
        break
      default:
        description = t('event.unknown', 'Unknown event')
    }

    return description
  }

  const getEventDurationDescription = (event: ActivityEvent) => {
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
  }

  return {
    getEventDescription,
    getEventDurationDescription,
    getEventRegionDescription,
  }
}

export default useActivityEventConnect
