import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { IdentityVessel, Resource } from '@globalfishingwatch/api-types'
import { getUTCDate, getUTCDateTime, segmentsToBbox } from '@globalfishingwatch/data-transforms'
import {
  UserContextTileLayer,
  UserPointsTileLayer,
  UserTracksLayer,
  VesselLayer,
} from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useTimebarUserPointsConnect, useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import type { Bbox } from 'types'

type FitBoundsProps = {
  hasError?: boolean
  layer: VesselLayer | UserTracksLayer | UserContextTileLayer | UserPointsTileLayer
  infoResource?: Resource<IdentityVessel>
  className?: string
  disabled?: boolean
  dataviewId?: string
}

export const useLayerFitBounds = () => {
  const { t } = useTranslation()
  const fitBounds = useMapFitBounds()
  const { setTimerange, start, end } = useTimerangeConnect()
  const { dispatchTimebarSelectedUserId } = useTimebarUserPointsConnect()

  const onFitBoundsClick = useCallback(
    async ({
      layer,
      infoResource,
      dataviewId,
    }: {
      layer: VesselLayer | UserTracksLayer | UserPointsTileLayer | UserContextTileLayer
      infoResource?: Resource<IdentityVessel>
      dataviewId?: string
    }) => {
      if (layer && start && end) {
        if (layer instanceof UserPointsTileLayer || layer instanceof UserContextTileLayer) {
          const startMs = getUTCDateTime(start).toMillis()
          const endMs = getUTCDateTime(end).toMillis()
          const boundsWithTime = await layer.getBbox(dataviewId!, {
            startDate: startMs,
            endDate: endMs,
          })
          const responseStartMs = boundsWithTime?.minStartTime
            ? getUTCDateTime(boundsWithTime.minStartTime).toMillis()
            : null
          const responseEndMs = boundsWithTime?.maxEndTime
            ? getUTCDateTime(boundsWithTime.maxEndTime).toMillis()
            : null
          const overlapsTimerange =
            boundsWithTime?.bbox &&
            (responseStartMs === null ||
              responseEndMs === null ||
              (responseEndMs >= startMs && responseStartMs <= endMs))

          const confirmMessage =
            layer instanceof UserContextTileLayer
              ? t((t) => t.layer.user_polygons_fit_bounds_out_of_timerange)
              : t((t) => t.layer.user_points_fit_bounds_out_of_timerange)

          if (overlapsTimerange) {
            fitBounds(boundsWithTime.bbox, {
              padding: 60,
              fitZoom: true,
              flyTo: true,
              maxZoom: 8,
            })
            if (dataviewId) dispatchTimebarSelectedUserId(dataviewId)
          } else if (window.confirm(confirmMessage)) {
            const bounds = await layer.getBbox(dataviewId!)
            if (bounds?.bbox) {
              fitBounds(bounds.bbox, {
                padding: 60,
                fitZoom: true,
                flyTo: true,
                maxZoom: 8,
              })
              if (bounds.minStartTime && bounds.maxEndTime) {
                setTimerange({
                  start: getUTCDate(bounds.minStartTime).toISOString(),
                  end: getUTCDate(bounds.maxEndTime).toISOString(),
                })
              }
              if (dataviewId) dispatchTimebarSelectedUserId(dataviewId)
            }
          }
        } else if (layer instanceof UserTracksLayer) {
          let bbox = layer.getBbox({ startDate: start, endDate: end })
          if (!bbox) {
            bbox = layer.getBbox() // try again to get the bbox without the time filter
            const segments = layer.getSegments()
            if (segments.length) {
              let minTimestamp = Number.POSITIVE_INFINITY
              let maxTimestamp = Number.NEGATIVE_INFINITY
              segments.forEach((seg) => {
                seg.forEach((pt) => {
                  if (pt.timestamp && pt.timestamp < minTimestamp) minTimestamp = pt.timestamp
                  if (pt.timestamp && pt.timestamp > maxTimestamp) maxTimestamp = pt.timestamp
                })
              })
              if (maxTimestamp > minTimestamp)
                setTimerange({
                  start: getUTCDate(minTimestamp).toISOString(),
                  end: getUTCDate(maxTimestamp).toISOString(),
                })
            }
          }
          if (bbox) {
            fitBounds(bbox as Bbox, { padding: 60, fitZoom: true, flyTo: true })
          }
        } else {
          const bbox = layer.getVesselTrackBounds()
          if (bbox) {
            fitBounds(bbox as Bbox, { padding: 60, fitZoom: true })
          } else {
            const transmissionDateFrom = infoResource?.data
              ? getVesselProperty(infoResource?.data, 'transmissionDateFrom')
              : ''
            const transmissionDateTo = infoResource?.data
              ? getVesselProperty(infoResource?.data, 'transmissionDateTo')
              : ''
            if (infoResource && (!transmissionDateFrom || !transmissionDateTo)) {
              console.warn("transmissionDates not available, can't fit time", infoResource)
              return
            }
            if (window.confirm(t((t) => t.layer.vessel_fit_bounds_out_of_timerange) as string)) {
              if (infoResource) {
                setTimerange({
                  start: getUTCDate(transmissionDateFrom).toISOString()!,
                  end: getUTCDate(transmissionDateTo).toISOString()!,
                })
              } else {
                const segments = layer.getVesselTrackSegments()
                let minTimestamp = Number.POSITIVE_INFINITY
                let maxTimestamp = Number.NEGATIVE_INFINITY
                segments.forEach((seg) => {
                  // TODO get the timestamp value from the timestamp field configured in the dataset
                  // this only works for datasets with the timestamp field named 'timestamp'
                  seg.forEach((pt) => {
                    if (pt.timestamp && pt.timestamp < minTimestamp) minTimestamp = pt.timestamp
                    if (pt.timestamp && pt.timestamp > maxTimestamp) maxTimestamp = pt.timestamp
                  })
                })
                const fullBBox = segmentsToBbox(segments)
                if (fullBBox && maxTimestamp > minTimestamp) {
                  setTimerange({
                    start: getUTCDate(minTimestamp).toISOString() as string,
                    end: getUTCDate(maxTimestamp).toISOString() as string,
                  })
                  fitBounds(fullBBox as Bbox)
                }
              }
            }
          }
        }
      }
    },
    [start, end, fitBounds, setTimerange, dispatchTimebarSelectedUserId, t]
  )

  return onFitBoundsClick
}

const FitBounds = ({
  className,
  layer,
  hasError,
  infoResource,
  disabled,
  dataviewId,
}: FitBoundsProps) => {
  const { t } = useTranslation()
  const userLayerFitBounds = useLayerFitBounds()
  const [loading, setLoading] = useState(false)

  const onFitBoundsClick = useCallback(async () => {
    setLoading(true)
    await userLayerFitBounds({ layer, infoResource, dataviewId })
    setLoading(false)
  }, [userLayerFitBounds, layer, infoResource, dataviewId])

  let tooltip: string
  if (hasError) {
    tooltip = t((t) => t.errors.trackLoading)
  } else if (layer instanceof VesselLayer) {
    tooltip = t((t) => t.layer.vessel_fit_bounds)
  } else if (layer instanceof UserContextTileLayer) {
    tooltip = t((t) => t.layer.user_context_fit_bounds)
  } else if (layer instanceof UserPointsTileLayer) {
    tooltip = t((t) => t.layer.user_points_fit_bounds)
  } else {
    tooltip = t((t) => t.layer.user_track_fit_bounds)
  }
  return (
    <IconButton
      size="small"
      disabled={hasError || disabled}
      icon={hasError ? 'warning' : 'target'}
      type={hasError ? 'warning' : 'default'}
      loading={loading}
      className={className}
      tooltip={tooltip}
      onClick={onFitBoundsClick}
      tooltipPlacement="top"
    />
  )
}

export default FitBounds
