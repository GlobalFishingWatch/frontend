import { useState } from 'react'
import { useSelector } from 'react-redux'
import { kebabCase } from 'lodash'
import { ActionCreators as UndoActionCreators } from 'redux-undo'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { TrackPoint } from '@globalfishingwatch/api-types'

import { LABELER_VERSION } from '../../data/config'
import { Field } from '../../data/models'
import type { Project} from '../../data/projects';
import { commonFilters, PROJECTS } from '../../data/projects'
import { setProject } from '../../features/projects/projects.slice'
import { getVesselInfo, selectVesselOriginalTrack } from '../../features/tracks/tracks.selectors'
import { extractLabeledTrack, fixCoordinates } from '../../features/tracks/tracks.utils'
import { selectUserData } from '../../features/user/user.slice'
import type {
  SelectedTrackType} from '../../features/vessels/selectedTracks.slice';
import {
  clearSelected,
  deleteSelectedTrack,
  futureSelectedtracks,
  pastSelectedtracks,
  selectedtracks,
  setSelectedTrack,
  updateActionSelectedTrack,
} from '../../features/vessels/selectedTracks.slice'
import { updateQueryParams } from '../../routes/routes.actions'
import { useAppDispatch } from '../../store.hooks'
import type { ActionType, ExportData, ExportFeature, Label } from '../../types'

import { selectProject, selectProjectId, selectVessel } from './../../routes/routes.selectors'
import type { TrackInterface } from './../vessels/vessels.slice';
import { setImportedData, setVesselInfo } from './../vessels/vessels.slice'

export const useSelectedTracksConnect = () => {
  const dispatch = useAppDispatch()
  const [uploadingTrack, setUploadingTrack] = useState(false)
  const dispatchUpdateActionSelectedTrack = (index: number, action: ActionType | string) =>
    dispatch(updateActionSelectedTrack({ index, action }))
  const dispatchChangeMapPosition = (segment: SelectedTrackType, type: 'start' | 'end') => {
    if (type === 'start') {
      dispatch(
        updateQueryParams({ latitude: segment.startLatitude, longitude: segment.startLongitude })
      )
    }
    if (type === 'end') {
      dispatch(
        updateQueryParams({ latitude: segment.endLatitude, longitude: segment.endLongitude })
      )
    }
  }
  const dispatchDeleteSelectedTrack = (index: number) => dispatch(deleteSelectedTrack({ index }))

  const selectedSegments: SelectedTrackType[] = useSelector(selectedtracks)
  const vesselId: string = useSelector(selectVessel)
  const vessel = useSelector(getVesselInfo)
  const tracks: TrackInterface | null = useSelector(selectVesselOriginalTrack)
  const project = useSelector(selectProject)
  const projectId = useSelector(selectProjectId)
  const user = useSelector(selectUserData)
  let fileReader: FileReader
  // Prepare the selected track to be uploaded
  const getSelectedTracksAsGeoJson = (tracks: TrackInterface): ExportData => {
    return {
      type: 'FeatureCollection',
      properties: {
        version: LABELER_VERSION,
        labeling_project_name: project?.name,
        labeling_project_labels: project?.labels,
        vessel: {
          id: vessel?.id,
          shipname: vessel?.shipname,
          callsign: vessel?.callsign,
          mmsi: vessel?.mmsi,
          flag: vessel?.flag,
          imo: vessel?.imo,
        },
      },
      features: tracks.data.map((trackSegment) => {
        const feature: ExportFeature = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: trackSegment.map((point: TrackPoint) => [point.longitude, point.latitude]),
          },
          properties: {
            type: 'track',
            coordinateProperties: {
              times: trackSegment.map((point: TrackPoint) => point.timestamp),
              speed: trackSegment.map((point: TrackPoint) => point.speed),
              course: trackSegment.map((point: TrackPoint) => point.course),
              elevation: trackSegment.map((point: TrackPoint) => point.elevation),
              labels_id: trackSegment.map((point: TrackPoint) => {
                const actualSegment: SelectedTrackType | undefined = selectedSegments.find(
                  (segment: SelectedTrackType) => {
                    return (
                      segment &&
                      segment.start &&
                      segment.end &&
                      point.timestamp &&
                      segment.start <= point.timestamp &&
                      segment.end >= point.timestamp
                    )
                  }
                )
                if (actualSegment) {
                  return actualSegment.action
                }
                return null
              }),
            },
          },
        }

        return feature
      }),
    }
  }
  const dispatchUploadSelectedTracks = async () => {
    if (tracks) {
      setUploadingTrack(true)
      const data = getSelectedTracksAsGeoJson(tracks)
      const file = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const body = new FormData()
      body.append('file', file)
      body.append(
        'projectName',
        project?.name ? (projectId ? projectId + '-' : '') + project?.name : 'Unknown'
      )
      body.append('vesselId', vesselId)
      body.append('customFilename', vesselId + '_' + user?.email)
      const url = `/v1/labels/upload`
      const response = await GFWAPI.fetch<any>(url, {
        method: 'POST',
        requestType: 'formData',
        responseType: 'json',
        body: body,
      })
        .then((response) => {
          alert('Track labels were saved successfully')
          return response
        })
        .catch((error) => {
          console.log(error)
          alert('¿ERROR!')
        })
        .finally(() => setUploadingTrack(false))

      return response
    }
  }
  // Prepare the selected track to be downloaded
  const dispatchDownloadSelectedTracks = () => {
    if (tracks) {
      const data = getSelectedTracksAsGeoJson(tracks)
      const element = document.createElement('a')
      const file = new Blob([JSON.stringify(data)], { type: 'application/json' })
      element.href = URL.createObjectURL(file)
      element.download = vesselId + '_exported_data.json'
      document.body.appendChild(element) // Required for this to work in FireFox
      element.click()
    }
  }

  /**
   * handle the file after this was uploaded
   */
  const handleFileUploaded = (e: any) => {
    const content: string = fileReader.result as string
    const geojeson: ExportData = JSON.parse(content) as ExportData
    const { segments, start, end } = extractLabeledTrack(geojeson)
    const wrapedGeojson = fixCoordinates(geojeson)
    dispatch(clearSelected())
    dispatch(UndoActionCreators.clearHistory())
    dispatch(updateQueryParams({ importView: 'true', vessel: null }))
    dispatch(setImportedData({ data: wrapedGeojson }))
    dispatch(
      setVesselInfo({
        id: geojeson.properties.vessel.id as string,
        data: {
          id: geojeson.properties.vessel.id as string,
          imo: geojeson.properties.vessel.imo as string,
          callsign: geojeson.properties.vessel.callsign as string,
          flag: geojeson.properties.vessel.flag as string,
          mmsi: geojeson.properties.vessel.mmsi as string,
          shipname: geojeson.properties.vessel.shipname as string,
        },
      })
    )
    let projectLabels: Label[] = []
    let projectDisplayOptions: Field[] = []
    if (geojeson.properties.labeling_project_name) {
      const keyFound = Object.keys(PROJECTS).find(
        (key) => (PROJECTS[key] as Project).name === geojeson.properties.labeling_project_name
      )
      if (keyFound) {
        projectLabels = PROJECTS[keyFound]?.labels as Label[]
        projectDisplayOptions = PROJECTS[keyFound]?.display_options as Field[]
        dispatch(updateQueryParams({ project: keyFound }))
      }
    }

    dispatch(updateQueryParams({ start: start.toISOString(), end: end.toISOString() }))
    dispatch(setSelectedTrack(segments))
    const labels = geojeson.properties.labeling_project_labels
      ? [...geojeson.properties.labeling_project_labels, ...projectLabels]
      : projectLabels
    const displayOptions =
      projectDisplayOptions && projectDisplayOptions.length > 0
        ? [...projectDisplayOptions]
        : [Field.speed] // Default display options,
    dispatch(
      setProject({
        name: geojeson.properties.labeling_project_name ?? 'Not set',
        labels: labels.filter((obj, pos, arr) => {
          return arr.map((mapObj: Label) => mapObj['id']).indexOf(obj['id']) === pos
        }),
        available_filters: commonFilters,
        display_options: displayOptions,
        dataset: '',
        permission: {
          type: 'labeler-project',
          value: `${kebabCase(geojeson.properties.labeling_project_name ?? 'not-set')}`,
          action: 'read',
        },
      })
    )
  }

  /**
   * This function is fired when the file is selected
   * @param event
   */
  const dispatchImportHandler = (event: any) => {
    if (event.target.files && event.target.files.length) {
      fileReader = new FileReader()
      fileReader.onloadend = handleFileUploaded
      fileReader.readAsText(event.target.files[0])
    }
  }

  const pastSegments = useSelector(pastSelectedtracks)
  const futureSegments = useSelector(futureSelectedtracks)
  const dispatchUndo = () => {
    if (pastSegments.length > 0) {
      dispatch(UndoActionCreators.undo())
    }
  }
  const dispatchRedo = () => {
    if (futureSegments.length > 0) {
      dispatch(UndoActionCreators.redo())
    }
  }

  return {
    uploadingTrack,
    dispatchUpdateActionSelectedTrack,
    dispatchDeleteSelectedTrack,
    dispatchChangeMapPosition,
    dispatchDownloadSelectedTracks,
    dispatchUploadSelectedTracks,
    dispatchImportHandler,
    dispatchUndo,
    dispatchRedo,
  }
}
