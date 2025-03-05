import { createSelector } from '@reduxjs/toolkit'

import { DEFAULT_WORKSPACE } from '../data/config'
import type { Project} from '../data/projects';
import { PROJECTS } from '../data/projects'
import { selectedProject } from '../features/projects/projects.slice'
import type { RootState } from '../store'
import type { TrackColor, WorkspaceParam } from '../types';
import { TRACK_COLORS } from '../types'

const selectLocation = (state: RootState) => {
  return state.location
}
export const selectLocationQuery = createSelector([selectLocation], (location) => {
  return location.query
})

export const getLocationType = createSelector([selectLocation], (location) => {
  return location.type
})

export const selectQueryParam = <T = any>(param: WorkspaceParam) =>
  createSelector([selectLocationQuery], (query: any) => {
    if (query === undefined || query[param] === undefined) {
      return DEFAULT_WORKSPACE[param] as T
    }
    return query[param] as T
  })

export const selectDataviewsQuery = selectQueryParam<any[]>('workspaceDataviews')

export const selectMapZoomQuery = selectQueryParam('zoom')
export const selectProjectId = selectQueryParam('project')
export const selectSatellite = selectQueryParam('satellite')
export const selectMapLatitudeQuery = selectQueryParam('latitude')
export const selectMapLongitudeQuery = selectQueryParam('longitude')
export const selectStartQuery = selectQueryParam('start')
export const selectEndQuery = selectQueryParam('end')
export const selectVessel = selectQueryParam('vessel')
export const selectMinSpeed = selectQueryParam('minSpeed')
export const selectMaxSpeed = selectQueryParam('maxSpeed')
export const selectMinElevation = selectQueryParam('minElevation')
export const selectMaxElevation = selectQueryParam('maxElevation')
export const selectMinDistanceFromPort = selectQueryParam('minDistanceFromPort')
export const selectMaxDistanceFromPort = selectQueryParam('maxDistanceFromPort')
export const selectFromHour = selectQueryParam('fromHour')
export const selectToHour = selectQueryParam('toHour')
export const selectTimebarMode = selectQueryParam('timebarMode')
export const selectColorMode = selectQueryParam('colorMode')
export const selectFilterMode = selectQueryParam('filterMode')
export const selectImportView = selectQueryParam('importView')

/**
 * get the start and end dates in string format
 */
export const getDateRange = createSelector([selectStartQuery, selectEndQuery], (start, end) => ({
  start,
  end,
}))

/**
 * verify if the a geojson was uploaded
 */
export const selectIsImportView = createSelector([selectImportView], (importView) => {
  return importView === 'true'
})

/**
 * get the start and end dates in timestamp format
 */
export const getDateRangeTS = createSelector([selectStartQuery, selectEndQuery], (start, end) => ({
  start: new Date(start).getTime(),
  end: new Date(end).getTime(),
}))

/**
 * Select the currect selected project
 */
export const selectProject = createSelector(
  [selectProjectId, selectIsImportView, selectedProject],
  (projectId: string, importView: boolean, virtualProject): Project | null => {
    if (importView && virtualProject) {
      return virtualProject as Project
    }

    if (!PROJECTS || !PROJECTS[projectId]) {
      return null
    }

    return PROJECTS[projectId] as Project
  }
)

/**
 * Gets the composed list of label colors for the project.
 * Combining colors defined globally (TRACK_COLORS) with colors
 * defined at project level (projects.ts).
 * When defined on both, colors defined at project level takes precedence.
 */
export const selectProjectColors = createSelector([selectProject], (project): TrackColor => {
  if (!project || !project.labels) {
    return TRACK_COLORS
  }
  const projectColors = project.labels.reduce(
    (previous, current) => ({
      ...previous,
      [current.id]: current.color,
    }),
    {}
  )

  return { ...TRACK_COLORS, ...projectColors }
})

/**
 * Get the hidden layers in the map
 */
export const selectHiddenLayers = createSelector(
  [selectQueryParam('hiddenLayers')],
  (hiddenLayers) => hiddenLayers?.split(',') || []
)

export const selectHiddenLabels = createSelector(
  [selectQueryParam('hiddenLabels')],
  (hiddenLabels) => hiddenLabels?.split(',') || []
)

export const selectFilteredHours = createSelector(
  [selectFromHour, selectToHour],
  (fromHour, toHour) => ({
    fromHour: parseInt(fromHour),
    toHour: parseInt(toHour),
  })
)

export const selectFilteredSpeed = createSelector(
  [selectMinSpeed, selectMaxSpeed],
  (minSpeed, maxSpeed) => ({
    minSpeed: parseFloat(minSpeed),
    maxSpeed: parseFloat(maxSpeed),
  })
)

export const selectFilteredElevation = createSelector(
  [selectMinElevation, selectMaxElevation],
  (minElevation, maxElevation) => ({
    minElevation: parseInt(minElevation),
    maxElevation: parseInt(maxElevation),
  })
)

export const selectFilteredDistanceFromPort = createSelector(
  [selectMinDistanceFromPort, selectMaxDistanceFromPort],
  (min, max) => ({
    minDistanceFromPort: parseInt(min),
    maxDistanceFromPort: parseInt(max),
  })
)

export const selectViewport = createSelector(
  [selectMapZoomQuery, selectMapLatitudeQuery, selectMapLongitudeQuery, selectColorMode],
  (zoom, latitude, longitude, colorMode) => ({
    zoom,
    latitude,
    longitude,
    colorMode,
  })
)
