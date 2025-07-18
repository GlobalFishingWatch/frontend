import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { createFileRoute, Link } from '@tanstack/react-router'

import { routerQueryMiddleware } from '@/fishing-map/routes/routes.middlewares'

import type { DatasetAreaDetail } from '../../../../fishing-map/features/areas/areas.slice'

export const Route = createFileRoute('/ports/')({
  component: RouteComponent,
})

// export const selectDownloadActivityArea = (
//   areaKey: string,
//   areas: Record<string, DatasetAreaDetail>
// ): DatasetAreaDetail | undefined => {
//   if (!areaKey || !areas) {
//     return undefined
//   }
//   return areas[areaKey]
// }
// const selectAreas = (state: any) => state.areas
// const useUrlSelector = (
//   urlSelectors: string[],
//   appSelectors: (typeof createSelector)[],
//   selector: (...args: any[]) => any
// ) => {
//   const search = Route.useSearch()
//   const urlData = urlSelectors.map((urlSelector) => search[urlSelector])
//   const selectorData = appSelectors.map((selector) => useSelector(selector))
//   return useMemo(() => {
//     return selector(...urlData, ...selectorData)
//   }, [urlData, ...selectorData])
// }

// const useActivityArea = () => {
//   const activityArea = useUrlSelector(['area'], [selectAreas], selectDownloadActivityArea)
//   return activityArea
// }

const selectDownloadActivityAreas = createSelector(
  [(state) => state.areas, (state) => state.query.area],
  (areas, areaKey): DatasetAreaDetail | undefined => {
    if (!areaKey || !areas) {
      return undefined
    }
    return areas[areaKey]
  }
)

const useUrlSelectore = (selector: typeof createSelector) => {
  const search = Route.useSearch()
  return useSelector((state: any) => selector({ ...state, search }))
}

function RouteComponent() {
  // const query = useActivityArea()
  const areas = useUrlSelectore(selectDownloadActivityAreas)

  return (
    <div>
      <Link
        to="/map/$"
        params={{ _splat: 'fishing-activity/default-public/ports-report/esp-tenerife' }}
      >
        See port report
      </Link>
    </div>
  )
}
