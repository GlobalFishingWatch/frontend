import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { Bbox } from 'types'

import type { IdentityVessel, Resource } from '@globalfishingwatch/api-types'
import { getUTCDate, segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { UserTracksLayer, VesselLayer } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { getVesselProperty } from 'features/vessel/vessel.utils'

type FitBoundsProps = {
  hasError?: boolean
  layer: VesselLayer | UserTracksLayer
  infoResource?: Resource<IdentityVessel>
  className?: string
  disabled?: boolean
}

const FitBounds = ({ className, layer, hasError, infoResource, disabled }: FitBoundsProps) => {
  const { t } = useTranslation()
  const fitBounds = useMapFitBounds()
  const { setTimerange, start, end } = useTimerangeConnect()

  const onFitBoundsClick = useCallback(() => {
    if (layer && start && end) {
      if (layer instanceof UserTracksLayer) {
        const bbox = layer.getBbox()
        if (bbox) {
          fitBounds(bbox as Bbox, { padding: 60, fitZoom: true })
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
          if (
            window.confirm(
              t(
                'layer.vessel_fit_bounds_out_of_timerange',
                'The track has no activity in your selected timerange. Change timerange to fit this track?'
              ) as string
            )
          ) {
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
  }, [layer, start, end, fitBounds, infoResource, t, setTimerange])

  let tooltip = ''
  if (hasError) {
    tooltip = t('errors.trackLoading', 'There was an error loading the vessel track')
  } else if (layer instanceof VesselLayer) {
    tooltip = t('layer.vessel_fit_bounds', 'Center view on vessel track')
  } else {
    tooltip = t('layer.user_track_fit_bounds', 'Change view and time range to see the entire track')
  }
  return (
    <IconButton
      size="small"
      disabled={hasError || disabled}
      icon={hasError ? 'warning' : 'target'}
      type={hasError ? 'warning' : 'default'}
      className={className}
      tooltip={tooltip}
      onClick={onFitBoundsClick}
      tooltipPlacement="top"
    />
  )
}

export default FitBounds
