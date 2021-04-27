import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import {
  Segment,
  segmentsToBbox,
  filterSegmentsByTimerange,
} from '@globalfishingwatch/data-transforms'
import { Resource } from '@globalfishingwatch/api-types'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { Bbox } from 'types'

type FitBoundsProps = {
  className: string
  trackResource: Resource<Segment[]>
  hasError: boolean
}

const FitBounds = ({ className, trackResource, hasError }: FitBoundsProps) => {
  const { t } = useTranslation()
  const fitBounds = useMapFitBounds()
  const { start, end } = useTimerangeConnect()
  const onFitBoundsClick = useCallback(() => {
    if (trackResource?.data) {
      const filteredSegments = filterSegmentsByTimerange(trackResource?.data, { start, end })
      const bbox = filteredSegments?.length ? segmentsToBbox(filteredSegments) : undefined
      if (bbox) {
        fitBounds(bbox as Bbox)
      } else {
        // TODO use prompt to ask user if wants to update the timerange to fit the track
        alert('The vessel has no activity in your selected timerange')
      }
    }
  }, [fitBounds, trackResource, start, end])
  return (
    <IconButton
      size="small"
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
