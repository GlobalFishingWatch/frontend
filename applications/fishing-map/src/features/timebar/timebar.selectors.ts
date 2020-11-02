import { createSelector } from '@reduxjs/toolkit'
import { Segment } from '@globalfishingwatch/data-transforms'
import { selectStartQuery, selectEndQuery } from 'routes/routes.selectors'
import {
  selectWorkspaceTimeRange,
  selectVesselsDataviews,
  resolveDataviewDatasetResource,
} from 'features/workspace/workspace.selectors'
import { selectResources, Resource } from 'features/resources/resources.slice'
import { TRACKS_DATASET_TYPE } from 'data/datasets'

export const selectTimeRange = createSelector(
  [selectStartQuery, selectEndQuery, selectWorkspaceTimeRange],
  (start, end, workspaceTimerange) => {
    return {
      start: start || workspaceTimerange?.start || '',
      end: end || workspaceTimerange?.end || '',
    }
  }
)

type TimebarTrackSegment = {
  start: number
  end: number
}

type TimebarTrack = {
  segments: TimebarTrackSegment[]
  color: string
}

export const selectTracksData = createSelector(
  [selectVesselsDataviews, selectResources],
  (trackDataviews, resources) => {
    if (!trackDataviews || !resources) return

    const tracksSegments: TimebarTrack[] = trackDataviews.flatMap((dataview) => {
      const { url } = resolveDataviewDatasetResource(dataview, TRACKS_DATASET_TYPE)
      if (!url) return []
      const track = resources[url] as Resource<Segment[]>
      if (!track?.data) return []

      const trackSegments: TimebarTrackSegment[] = track.data.map((segment) => {
        return {
          start: segment[0].timestamp || 0,
          end: segment[segment.length - 1].timestamp || 0,
        }
      })
      return {
        segments: trackSegments,
        color: dataview.config?.color || '',
      }
    })

    return tracksSegments
  }
)
