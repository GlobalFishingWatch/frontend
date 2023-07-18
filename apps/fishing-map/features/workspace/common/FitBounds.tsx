import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { FeatureCollection } from 'geojson'
import { IconButton } from '@globalfishingwatch/ui-components'
import {
  segmentsToBbox,
  filterSegmentsByTimerange,
  geoJSONToSegments,
} from '@globalfishingwatch/data-transforms'
import { Resource, Segment, Vessel } from '@globalfishingwatch/api-types'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { Bbox } from 'types'

type FitBoundsProps = {
  hasError: boolean
  trackResource: Resource<Segment[] | FeatureCollection>
  infoResource?: Resource<Vessel>
  className?: string
}

const FitBounds = ({ className, trackResource, hasError, infoResource }: FitBoundsProps) => {
  const { t } = useTranslation()
  const fitBounds = useMapFitBounds()
  const { setTimerange, start, end } = useTimerangeConnect()

  const onFitBoundsClick = useCallback(() => {
    if (trackResource?.data && start && end) {
      const segments = (trackResource.data as FeatureCollection).features
        ? geoJSONToSegments(trackResource.data as FeatureCollection)
        : (trackResource?.data as Segment[])
      const filteredSegments = filterSegmentsByTimerange(segments, { start, end })
      const bbox = filteredSegments?.length ? segmentsToBbox(filteredSegments) : undefined
      if (bbox) {
        fitBounds(bbox)
      } else {
        if (
          infoResource &&
          (!infoResource.data?.firstTransmissionDate || !infoResource.data?.firstTransmissionDate)
        ) {
          console.warn('transmissionDates not available, cant fit time', infoResource)
          return
        }
        if (
          window.confirm(
            t(
              'layer.vessel_fit_bounds_out_of_timerange',
              'The track has no activity in your selected timerange. Change timerange to fit this track?'
            )
          )
        ) {
          if (infoResource) {
            setTimerange({
              start: new Date(infoResource.data!?.firstTransmissionDate).toISOString(),
              end: new Date(infoResource.data!?.lastTransmissionDate).toISOString(),
            })
          } else {
            let minTimestamp = Number.POSITIVE_INFINITY
            let maxTimestamp = Number.NEGATIVE_INFINITY
            segments.forEach((seg) => {
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
  }, [trackResource?.data, start, end, fitBounds, infoResource, t, setTimerange])

  return (
    <IconButton
      size="small"
      disabled={hasError}
      icon={hasError ? 'warning' : 'target'}
      type={hasError ? 'warning' : 'default'}
      className={className}
      tooltip={
        hasError
          ? t('errors.trackLoading', 'There was an error loading the vessel track')
          : t('layer.vessel_fit_bounds', 'Center view on vessel track')
      }
      onClick={onFitBoundsClick}
      tooltipPlacement="top"
    />
  )
}

export default FitBounds
