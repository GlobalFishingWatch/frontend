import { createSelector } from '@reduxjs/toolkit'
import { EventTypes, Resource } from '@globalfishingwatch/api-types/dist'
import {
  ResourcesState as CommonResourcesState,
  resourcesSlice,
  selectResources as originalSelectResource,
} from '@globalfishingwatch/dataviews-client'

export {
  fetchResourceThunk,
  selectResourceByUrl,
  selectResourcesLoading,
} from '@globalfishingwatch/dataviews-client'

export const selectResources = createSelector([originalSelectResource], (resources) => {

  return Object.keys(resources)
    .map((url) => {
      const resource = resources[url]
      const portExitEvents =
        Array.isArray(resource.data) &&
        (resource.data as any[])
          .filter((event) => event.type === EventTypes.Port)
          .map((event) => ({
            ...event,
            timestamp: event.end as number,
            // Important: To display port exits in map it's necessary
            // to override start timestamp because that's used to
            //  filter events when highlightTime is set
            start: event.end as number,
            id: `${event.id}-exit`,
          }))

      return [
        url,
        {
          ...resource,
          data: Array.isArray(resource.data)
            ? (resource.data as any[])?.concat(portExitEvents)
            : resource.data,
        } as Resource,
      ]
    })
    .reduce(
      (prev, [url, resource]) => ({ ...prev, [url as string]: resource }),
      {}
    ) as CommonResourcesState
})

export type ResourcesState = CommonResourcesState
export default resourcesSlice.reducer
