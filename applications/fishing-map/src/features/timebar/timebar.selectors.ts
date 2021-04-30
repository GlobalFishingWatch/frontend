import { createSelector } from '@reduxjs/toolkit'
import { DatasetTypes, Resource, TrackResourceData } from '@globalfishingwatch/api-types'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import { geoJSONToSegments, Segment } from '@globalfishingwatch/data-transforms'
import { selectTimebarGraph } from 'features/app/app.selectors'
import {
  selectActiveTrackDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/dataviews.selectors'
import { selectResources } from 'features/resources/resources.slice'

type TimebarTrackSegment = {
  start: number
  end: number
}

type TimebarTrack = {
  segments: TimebarTrackSegment[]
  color: string
}

export const selectTracksData = createSelector(
  [selectActiveTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    if (!trackDataviews || !resources) return

    const tracksSegments: TimebarTrack[] = trackDataviews.flatMap((dataview) => {
      const { url } = resolveDataviewDatasetResource(dataview, [
        DatasetTypes.Tracks,
        DatasetTypes.UserTracks,
      ])
      if (!url) return []
      const track = resources[url] as Resource<TrackResourceData>
      if (!track?.data) return []

      const segments = (track.data as any).features
        ? geoJSONToSegments(track.data as any)
        : (track?.data as Segment[])

      const trackSegments: TimebarTrackSegment[] = segments.map((segment) => {
        return {
          start: segment[0].timestamp || 0,
          end: segment[segment.length - 1].timestamp || 0,
        }
      })
      return {
        segments: trackSegments,
        color: dataview.config?.color || '',
        segmentsOffsetY: track.datasetType === DatasetTypes.UserTracks,
      }
    })

    return tracksSegments
  }
)

export const selectTracksGraphs = createSelector(
  [selectActiveVesselsDataviews, selectTimebarGraph, selectResources],
  (vesselDataviews, timebarGraph, resources) => {
    if (!vesselDataviews || vesselDataviews.length > 2 || !resources) return

    const graphs = vesselDataviews.flatMap((dataview) => {
      const { url } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
      if (!url) return []
      const track = resources[url] as Resource<TrackResourceData>
      if (!track?.data) return []

      const segmentsWithCurrentFeature = track.data?.map((segment) => {
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
