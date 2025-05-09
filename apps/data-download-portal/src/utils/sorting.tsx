import type { Dataset } from '@globalfishingwatch/api-types'

export function sortByName(data: Dataset[], direction: 'asc' | 'desc') {
  return [...data].sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    if (nameA === nameB) return 0
    return direction === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
  })
}

export function sortByLastUpdated(data: Dataset[]) {
  return [...data].sort((a, b) => {
    if (!a.lastUpdated) return 1
    if (!b.lastUpdated) return -1
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  })
}

export function sortDatasets(
  data: Dataset[],
  sortBy: 'name' | 'lastUpdated',
  direction: 'asc' | 'desc' = 'asc'
) {
  switch (sortBy) {
    case 'name':
      return sortByName(data, direction)
    case 'lastUpdated':
      return sortByLastUpdated(data)
    default:
      return data
  }
}
