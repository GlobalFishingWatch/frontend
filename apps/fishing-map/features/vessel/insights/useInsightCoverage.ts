import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import { EventTypes } from '@globalfishingwatch/api-types'
import { getUTCDateTime } from '@globalfishingwatch/data-transforms'

import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectVesselPortEvents } from 'features/vessel/selectors/vessel.resources.selectors'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { useVesselProfileLayer } from 'features/vessel/vessel.hooks'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'

export const useInsightCoverage = () => {
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const vesselLayer = useVesselProfileLayer()
  const portEvents = useSelector(selectVesselPortEvents)
  const visibleEvents = useSelector(selectVisibleEvents)
  const portEventsActive = useMemo(
    () => visibleEvents === 'all' || visibleEvents.includes(EventTypes.Port),
    [visibleEvents]
  )

  const isLoading = useMemo(() => !vesselLayer?.loaded, [vesselLayer?.loaded])
  const hasError = useMemo(
    () => !!vesselLayer?.instance?.getVesselLayersError('track'),
    [vesselLayer?.instance]
  )

  const coverage = useMemo(() => {
    if (!vesselLayer || !vesselLayer.loaded || !vesselLayer.instance || !start || !end || !vessel) {
      return undefined
    }
    const startMs = getUTCDateTime(start).toMillis()
    const endMs = getUTCDateTime(end).toMillis()

    const { transmissionDateFrom, transmissionDateTo } = getSearchIdentityResolved(vessel)

    const clippedStartMs = transmissionDateFrom
      ? Math.max(startMs, DateTime.fromISO(transmissionDateFrom, { zone: 'utc' }).toMillis())
      : startMs
    const clippedEndMs = transmissionDateTo
      ? Math.min(endMs, DateTime.fromISO(transmissionDateTo, { zone: 'utc' }).toMillis())
      : endMs

    if (clippedEndMs <= clippedStartMs) {
      return undefined
    }

    const segments = vesselLayer.instance.getVesselTrackSegments({
      startTime: clippedStartMs,
      endTime: clippedEndMs,
      includeMiddlePoints: true,
    })

    const sortedPortEvents = [...portEvents].sort(
      (a, b) => (a.start as number) - (b.start as number)
    )
    const allTrackTimestamps = segments
      .flat()
      .map((p) => p.timestamp)
      .filter((t): t is number => !!t)
      .sort((a, b) => a - b)

    if (allTrackTimestamps.length === 0) {
      return undefined
    }

    const minTrackTs = DateTime.fromMillis(allTrackTimestamps[0], { zone: 'utc' })
      .plus({ hours: 1 })
      .startOf('hour')
      .toMillis()
    const maxTrackTs = allTrackTimestamps[allTrackTimestamps.length - 1]

    const atSeaPoints: number[] = []
    let pIdx = 0
    for (const ts of allTrackTimestamps) {
      while (pIdx < sortedPortEvents.length && (sortedPortEvents[pIdx].end as number) < ts) {
        pIdx++
      }
      const isInPort =
        pIdx < sortedPortEvents.length &&
        (sortedPortEvents[pIdx].start as number) <= ts &&
        (sortedPortEvents[pIdx].end as number) >= ts
      if (!isInPort) {
        atSeaPoints.push(ts)
      }
    }

    let eligibleBlocks = 0
    let coveredBlocks = 0
    let currentMs = minTrackTs
    let portPointer = 0
    let pointPointer = 0

    while (currentMs < maxTrackTs) {
      const nextHour = currentMs + 60 * 60 * 1000
      const blockEnd = Math.min(nextHour, maxTrackTs)

      while (
        portPointer < sortedPortEvents.length &&
        (sortedPortEvents[portPointer].end as number) < currentMs
      ) {
        portPointer++
      }
      const isAtPort =
        portPointer < sortedPortEvents.length &&
        (sortedPortEvents[portPointer].start as number) <= currentMs &&
        (sortedPortEvents[portPointer].end as number) >= currentMs

      if (!isAtPort) {
        eligibleBlocks++
        while (pointPointer < atSeaPoints.length && atSeaPoints[pointPointer] < currentMs) {
          pointPointer++
        }
        if (pointPointer < atSeaPoints.length && atSeaPoints[pointPointer] < blockEnd) {
          coveredBlocks++
        }
      }
      currentMs = blockEnd
    }

    if (eligibleBlocks === 0) return 100

    console.log({
      blocks: eligibleBlocks,
      blocksWithPositions: coveredBlocks,
      percentage: (coveredBlocks / eligibleBlocks) * 100,
    })

    return Math.min(100, (coveredBlocks / eligibleBlocks) * 100)
  }, [vesselLayer, start, end, vessel, portEvents])

  return useMemo(
    () => ({ coverage, isLoading, hasError, portEventsActive }),
    [coverage, isLoading, hasError, portEventsActive]
  )
}
