import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { GapPosition, Regions, RegionType } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { useRegionNamesByType } from 'features/regions/regions.hooks'
import { selectRegionsDatasets } from 'features/regions/regions.selectors'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { REGIONS_PRIORITY } from 'features/vessel/vessel.config'
import VesselLink from 'features/vessel/VesselLink'
import { getUTCDateTime } from 'utils/dates'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'

import styles from './Event.module.css'

export function useFetchRegionsData() {
  const dispatch = useAppDispatch()
  const regionsDatasets = useSelector(selectRegionsDatasets)
  useEffect(() => {
    if (Object.values(regionsDatasets).every((d) => d)) {
      dispatch(fetchRegionsThunk(regionsDatasets))
    }
  }, [dispatch, regionsDatasets])
}

export function useActivityEventTranslations() {
  useFetchRegionsData()
  const { t } = useTranslation()
  const { getRegionNamesByType } = useRegionNamesByType()

  const getEventRegionDescription = useCallback(
    (event: ActivityEvent | GapPosition, regionsPriority = REGIONS_PRIORITY) => {
      const mainRegionDescription = regionsPriority.reduce((acc, regionType) => {
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
      const allRegionsDescriptionBlocks: string[] = []
      if (event.regions) {
        Object.entries(event.regions).forEach((entry) => {
          const regionType = entry[0] as keyof Regions
          const regions = entry[1] as string[]
          if (!regions.length || regionType === 'majorFao' || regionType === 'highSeas') return
          allRegionsDescriptionBlocks.push(
            `${t(`layer.areas.${regionType}`)}: ${getRegionNamesByType(regionType, regions).join(
              ', '
            )}`
          )
        })
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
    (event?: ActivityEvent, regionsPriority?: RegionType[]) => {
      if (!event) return EMPTY_FIELD_PLACEHOLDER
      const { mainRegionDescription, allRegionsDescription } = getEventRegionDescription(
        event,
        regionsPriority
      )
      switch (event.type) {
        case EventTypes.Encounter:
          if (event.encounter?.vessel) {
            const { flag, id, name, dataset } = event.encounter.vessel
            return (
              // TODO check if we can get the dataset of the vessel encountered, using Identity for now
              <span>
                {t('event.encounterAction', 'had an encounter with')}{' '}
                <VesselLink vesselId={id} datasetId={dataset}>
                  {formatInfoField(name, 'shipname')} ({formatInfoField(flag, 'flag')})
                </VesselLink>{' '}
                {mainRegionDescription && (
                  <Tooltip content={allRegionsDescription}>
                    <span className={styles.region}>
                      {t('common.in', 'in')} {mainRegionDescription}
                      {allRegionsDescription ? <span className="print-hidden">...</span> : ''}
                    </span>
                  </Tooltip>
                )}
              </span>
            )
          } else return ''
        case EventTypes.Port: {
          const { name, flag } = event.port_visit?.intermediateAnchorage ?? {}
          const portType = event.subType || event.type
          const portLabel = name
            ? [name, ...(flag ? [t(`flags:${flag}`, flag.toLocaleUpperCase())] : [])].join(', ')
            : ''
          return t(`event.${portType}ActionIn`, `${portType} {{port}}`, {
            port: formatInfoField(portLabel, 'port'),
          })
        }
        case EventTypes.Loitering:
          return (
            mainRegionDescription && (
              <Tooltip content={allRegionsDescription}>
                <span className={styles.region}>
                  {t('event.loiteringActionIn', 'Loitering in {{regionName}}', {
                    regionName: mainRegionDescription,
                  })}
                  {allRegionsDescription ? <span className="print-hidden">...</span> : ''}
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
                  {allRegionsDescription ? <span className="print-hidden">...</span> : ''}
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
                  {allRegionsDescription ? <span className="print-hidden">...</span> : ''}
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
