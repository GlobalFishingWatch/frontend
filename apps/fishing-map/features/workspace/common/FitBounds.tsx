import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { IdentityVessel, Resource } from '@globalfishingwatch/api-types'
import { VesselLayer } from '@globalfishingwatch/deck-layers'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { Bbox } from 'types'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { getUTCDateTime } from 'utils/dates'

type FitBoundsProps = {
  hasError: boolean
  vesselLayer: VesselLayer
  infoResource?: Resource<IdentityVessel>
  className?: string
}

const FitBounds = ({ className, vesselLayer, hasError, infoResource }: FitBoundsProps) => {
  const { t } = useTranslation()
  const fitBounds = useMapFitBounds()
  const { setTimerange, start, end } = useTimerangeConnect()

  const onFitBoundsClick = useCallback(() => {
    if (vesselLayer && start && end) {
      const bbox = vesselLayer.getVesselTrackBounds()
      if (bbox) {
        fitBounds(bbox, { padding: 60, fitZoom: true })
      } else {
        const transmissionDateFrom = getVesselProperty(infoResource?.data!, 'transmissionDateFrom')
        console.log('🚀 ~ onFitBoundsClick ~ transmissionDateFrom:', transmissionDateFrom)
        const transmissionDateTo = getVesselProperty(infoResource?.data!, 'transmissionDateTo')
        console.log('🚀 ~ onFitBoundsClick ~ transmissionDateTo:', transmissionDateTo)
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
            const segments = vesselLayer.getVesselTrackSegments()
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
  }, [vesselLayer, start, end, fitBounds, infoResource, t, setTimerange])

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
