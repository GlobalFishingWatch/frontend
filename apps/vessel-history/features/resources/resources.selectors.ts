import { createSelector } from '@reduxjs/toolkit'
import { Dataset, EventType, EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { selectVisibleEvents } from 'features/event-filters/filters.selectors'
import { selectResources } from './resources.slice'

export const selectVisibleResources = createSelector(
  [selectResources, selectVisibleEvents],
  (resources, visibleEvents) => {
    if (visibleEvents === 'all') {
      return resources
    }

    const resourcesEntries = Object.entries(resources).filter(([url, resource]) => {
      return url.includes('events') && resource.dataset?.configuration?.type
        ? visibleEvents.includes(resource.dataset.configuration.type)
        : true
    })
    return Object.fromEntries(resourcesEntries)
  }
)

const getDatasetEventType = (dataset: Dataset): EventType => {
  const datasetToEventTypeMapping = {
    vessel: {
      [EventTypes.Encounter]: EventTypes.Encounter,
      [EventTypes.Fishing]: EventTypes.Fishing,
      [EventTypes.Loitering]: EventTypes.Loitering,
      [EventTypes.Port]: EventTypes.Port,
    },
  }
  return (
    (datasetToEventTypeMapping[dataset?.category] &&
      datasetToEventTypeMapping[dataset?.category][dataset?.subcategory]) ??
    undefined
  )
}
export const selectEventResourcesLoading = createSelector([selectResources], (resources) => {
  return Object.entries(resources)
    .filter(([url, resource]) => resource.status === ResourceStatus.Loading)
    .map(([url, resource]) => getDatasetEventType(resource.dataset))
})
