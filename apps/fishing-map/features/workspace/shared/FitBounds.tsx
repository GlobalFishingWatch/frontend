import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { IdentityVessel, Resource } from '@globalfishingwatch/api-types'
import { getUTCDate, segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { UserTracksLayer, VesselLayer } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import type { Bbox } from 'types'

type FitBoundsProps = {
  hasError?: boolean
  layer: VesselLayer | UserTracksLayer
  infoResource?: Resource<IdentityVessel>
  className?: string
  disabled?: boolean
}

export const useTrackLayerFitBounds = () => {
  const { t } = useTranslation()
  const fitBounds = useMapFitBounds()
  const { setTimerange, start, end } = useTimerangeConnect()

  const onFitBoundsClick = useCallback(
    ({
      layer,
      infoResource,
    }: {
      layer: VesselLayer | UserTracksLayer
      infoResource?: Resource<IdentityVessel>
    }) => {
      if (layer && start && end) {
        if (layer instanceof UserTracksLayer) {
          const bbox = layer.getBbox()
          if (bbox) {
            fitBounds(bbox as Bbox, { padding: 60, fitZoom: true, flyTo: true })
          }
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
                start: getUTCDate(minTimestamp).toISOString() as string,
                end: getUTCDate(maxTimestamp).toISOString() as string,
              })
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
            if (window.confirm(t('layer.vessel_fit_bounds_out_of_timerange') as string)) {
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
    [start, end, fitBounds, t, setTimerange]
  )

  return onFitBoundsClick
}

const FitBounds = ({ className, layer, hasError, infoResource, disabled }: FitBoundsProps) => {
  const { t } = useTranslation()
  const trackLayerFitBounds = useTrackLayerFitBounds()

  let tooltip = ''
  if (hasError) {
    tooltip = t('errors.trackLoading')
  } else if (layer instanceof VesselLayer) {
    tooltip = t('layer.vessel_fit_bounds')
  } else {
    tooltip = t('layer.user_track_fit_bounds')
  }
  return (
    <IconButton
      size="small"
      disabled={hasError || disabled}
      icon={hasError ? 'warning' : 'target'}
      type={hasError ? 'warning' : 'default'}
      className={className}
      tooltip={tooltip}
      onClick={() => trackLayerFitBounds({ layer, infoResource })}
      tooltipPlacement="top"
    />
  )
}

export default FitBounds
