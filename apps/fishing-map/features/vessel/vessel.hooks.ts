import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { getRelatedDatasetByType, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectVesselTracksData } from 'features/vessel/vessel.selectors'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { selectUrlTimeRange } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { DEFAULT_TIME_RANGE } from 'data/config'

export type VesselDataviewInstanceParams = { id: string; dataset: Dataset }

export const useAddVesselDataviewInstance = () => {
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const addVesselDataviewInstance = useCallback(
    (vessel: VesselDataviewInstanceParams) => {
      const vesselTrackDataset = getRelatedDatasetByType(vessel.dataset, DatasetTypes.Tracks)
      const vesselEventsDatasets = getRelatedDatasetsByType(vessel.dataset, DatasetTypes.Events)
      const eventsDatasetsId =
        vesselEventsDatasets && vesselEventsDatasets?.length
          ? vesselEventsDatasets.map((d) => d.id)
          : []

      const vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        info: vessel.dataset.id,
        track: vesselTrackDataset?.id,
        ...(eventsDatasetsId.length > 0 && { events: eventsDatasetsId }),
      })
      upsertDataviewInstance(vesselDataviewInstance)
    },
    [upsertDataviewInstance]
  )

  return addVesselDataviewInstance
}

export const useVesselFitBounds = (enabled: boolean = true) => {
  const fitBounds = useMapFitBounds()
  const segments = useSelector(selectVesselTracksData)
  const urlTimerange = useSelector(selectUrlTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const { setTimerange } = useTimerangeConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const [timerangeBoundsUpdated, seTimerangeBoundsUpdated] = useState(false)
  const [trackBoundsUpdated, setTrackBoundsUpdated] = useState(false)
  const { transmissionDateFrom, transmissionDateTo } = getSearchIdentityResolved(vessel)

  // Updates the timerange to the vessel's transmission dates only if not set or are the default of the workspace
  const isDefaultTimerange =
    urlTimerange &&
    urlTimerange.start === DEFAULT_TIME_RANGE.start &&
    urlTimerange.end === DEFAULT_TIME_RANGE.end
  const needsTimerangeUpdate =
    isDefaultTimerange && vessel !== null && transmissionDateFrom && transmissionDateTo

  useEffect(() => {
    if (enabled && needsTimerangeUpdate) {
      // This is needed to update the url instantly instead of waiting for the debounced
      // update in setTimerange fn as the resouce needs to be generated asap
      dispatchQueryParams({ start: transmissionDateFrom, end: transmissionDateTo })
      setTimerange({ start: transmissionDateFrom, end: transmissionDateTo })
      requestAnimationFrame(() => {
        seTimerangeBoundsUpdated(true)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsTimerangeUpdate])

  // There has to wait for the timerange to be updated so the track loads with the entire track
  useEffect(() => {
    if (enabled && segments?.length && timerangeBoundsUpdated && !trackBoundsUpdated) {
      const bbox = segments?.length ? segmentsToBbox(segments) : undefined
      if (bbox) {
        fitBounds(bbox)
        setTrackBoundsUpdated(true)
      }
    }
  }, [enabled, fitBounds, segments, timerangeBoundsUpdated, trackBoundsUpdated])
}
