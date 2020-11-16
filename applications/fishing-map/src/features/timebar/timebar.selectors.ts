import { createSelector } from '@reduxjs/toolkit'
import { Segment } from '@globalfishingwatch/data-transforms'
import { selectTimebarGraph } from 'features/app/app.selectors'
import {
  selectVesselsDataviews,
  resolveDataviewDatasetResource,
} from 'features/workspace/workspace.selectors'
import { selectResources, Resource } from 'features/resources/resources.slice'
import { TRACKS_DATASET_TYPE } from 'data/datasets'

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
      const { url } = resolveDataviewDatasetResource(dataview, { type: TRACKS_DATASET_TYPE })
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

export const selectTracksGraphs = createSelector(
  [selectVesselsDataviews, selectTimebarGraph, selectResources],
  (trackDataviews, timebarGraph, resources) => {
    if (!trackDataviews || !resources) return

    const graphs = trackDataviews.flatMap((dataview) => {
      const { url } = resolveDataviewDatasetResource(dataview, { type: TRACKS_DATASET_TYPE })
      if (!url) return []
      const track = resources[url] as Resource<Segment[]>
      if (!track?.data) return []

      const segmentsWithCurrentFeature = track.data.map((segment) => {
        return segment.flatMap((pt) => {
          const value = (pt as any)[timebarGraph]
          if (!value) return []
          return {
            date: pt.timestamp,
            value,
          }
        })
      })
      return {
        color: dataview.config?.color || '',
        segmentsWithCurrentFeature,
        // TODO Figure out this magic value
        maxValue: 25,
      }
    })
    return graphs
  }
)
