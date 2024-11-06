export const selectLocationQuery = () => jest.fn(() => '')

export const selectQueryParam = (param: string) => jest.fn(() => `${param} value`)

export const selectDataviewsQuery = selectQueryParam('workspaceDataviews')

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

export const getDateRange = () => jest.fn(() => ({}))

export const selectIsImportView = () => jest.fn(() => ({}))
export const getDateRangeTS = () => jest.fn(() => ({}))
export const selectProject = () => jest.fn(() => ({}))

export const selectHiddenLayers = () => jest.fn(() => ({}))

export const selectFilteredHours = () => jest.fn(() => ({}))

export const selectFilteredSpeed = () => jest.fn(() => ({}))

export const selectFilteredElevation = () => jest.fn(() => ({}))

export const selectFilteredDistanceFromPort = () => jest.fn(() => ({}))

export const selectViewport = () => jest.fn(() => ({}))
