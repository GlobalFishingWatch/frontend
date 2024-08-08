import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { IdentityVessel, Resource } from '@globalfishingwatch/api-types'
import { UserTracksLayer, VesselLayer } from '@globalfishingwatch/deck-layers'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { Bbox } from 'types'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { getUTCDateTime } from 'utils/dates'

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
          setTimerange({
            start: new Date(minTimestamp).toISOString(),
            end: new Date(maxTimestamp).toISOString(),
          })
        }
      } else {
        const bbox = layer.getVesselTrackBounds()
        if (bbox) {
          fitBounds(bbox as Bbox, { padding: 60, fitZoom: true })
        } else {
          const transmissionDateFrom = getVesselProperty(
            infoResource?.data!,
            'transmissionDateFrom'
          )
          const transmissionDateTo = getVesselProperty(infoResource?.data!, 'transmissionDateTo')
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
                start: getUTCDateTime(transmissionDateFrom).toISO()!,
                end: getUTCDateTime(transmissionDateTo).toISO()!,
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
                  start: new Date(minTimestamp).toISOString(),
                  end: new Date(maxTimestamp).toISOString(),
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
