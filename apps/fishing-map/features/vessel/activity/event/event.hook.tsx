import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { GapPosition, Regions, RegionType } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { useRegionNamesByType } from 'features/regions/regions.hooks'
import { selectRegionsDatasets } from 'features/regions/regions.selectors'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import PortsReportLink from 'features/reports/report-port/PortsReportLink'
import type { VesselEvent } from 'features/vessel/activity/event/Event'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { selectVesselEventsDatasets } from 'features/vessel/selectors/vessel.resources.selectors'
import { REGIONS_PRIORITY } from 'features/vessel/vessel.config'
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
  const vesselEventsDatasets = useSelector(selectVesselEventsDatasets)

  const getEventRegionDescription = useCallback(
    (event: VesselEvent | GapPosition, regionsPriority = REGIONS_PRIORITY) => {
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
        allRegionsDescription: (
          <div>
            {allRegionsDescriptionBlocks.map((block, index) => (
              <div key={index}>{block}</div>
            ))}
          </div>
        ),
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
            const { flag, name } = event.encounter.vessel
            return (
              // TODO check if we can get the dataset of the vessel encountered, using Identity for now
              <span>
                {t('event.encounterAction', 'had an encounter with')}{' '}
                {formatInfoField(name, 'shipname')} ({formatInfoField(flag, 'flag')}){' '}
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
          const { id, name, flag } = event.port_visit?.intermediateAnchorage ?? {}
          const portName = name || id
          const portType = event.subType || event.type
          const portLabel = portName
            ? [portName, ...(flag ? [t(`flags:${flag}`, flag.toLocaleUpperCase())] : [])].join(', ')
            : ''
          const portDataset = vesselEventsDatasets?.find((dataset) => dataset.id.includes('port'))
          return (
            <Fragment>
              {t(`event.${portType}ActionIn`, `${portType} {{port}}`, {
                port: '',
              })}
              <PortsReportLink port={{ id, name, country: flag, datasetId: portDataset?.id }}>
                {formatInfoField(portLabel, 'port')}
              </PortsReportLink>
            </Fragment>
          )
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
    (event: VesselEvent) => {
      const durationDiff = getUTCDateTime(event.end as number).diff(
        getUTCDateTime(event.start as number),
        ['years', 'months', 'days', 'hours', 'minutes']
      )
      const duration = durationDiff.toObject()

      const durationDescription =
        event.end > event.start
          ? [
              duration.years && duration.years > 0
                ? t('event.yearAbbreviated', '{{count}}y', { count: duration.years })
                : '',
              duration.months && duration.months > 0
                ? t('event.monthAbbreviated', '{{count}}m', { count: duration.months })
                : '',
              duration.days && duration.days > 0
                ? t('event.dayAbbreviated', '{{count}}d', { count: duration.days })
                : '',
              duration.years === 0 && duration.months === 0 && duration.hours && duration.hours > 0
                ? t('event.hourAbbreviated', '{{count}}h', { count: duration.hours })
                : '',
              duration.years === 0 &&
              duration.months === 0 &&
              duration.days === 0 &&
              duration.minutes &&
              Math.round(duration.minutes as number) > 0
                ? `${Math.round(duration.minutes as number)}'`
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
