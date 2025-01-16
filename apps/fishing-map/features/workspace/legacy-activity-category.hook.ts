import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import {
  FISHING_DATAVIEW_SLUG,
  PRESENCE_DATAVIEW_SLUG,
  VIIRS_MATCH_DATAVIEW_SLUG,
} from 'data/workspaces'
import { selectActivityCategory } from 'features/app/selectors/app.selectors'
import { selectAllDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'

export const useHideLegacyActivityCategoryDataviews = () => {
  const actionDone = useRef(false)
  const activityCategory = useSelector(selectActivityCategory)
  const dataviewInstancesResolved = useSelector(selectAllDataviewInstancesResolved)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()

  useEffect(() => {
    // When legacy activityCategory is present this hides
    // the dataviewInstances from the category not selected
    if (actionDone.current === false && activityCategory && dataviewInstancesResolved?.length) {
      let dataviewInstancesToUpdate = [] as UrlDataviewInstance[]
      if (activityCategory) {
        if (activityCategory === 'fishing') {
          dataviewInstancesToUpdate = dataviewInstancesResolved.filter((dataviewInstance) => {
            return (
              dataviewInstance.dataviewId === PRESENCE_DATAVIEW_SLUG ||
              dataviewInstance.dataviewId === VIIRS_MATCH_DATAVIEW_SLUG
            )
          })
        }
        dataviewInstancesToUpdate = dataviewInstancesResolved.filter((dataviewInstance) => {
          return dataviewInstance.dataviewId === FISHING_DATAVIEW_SLUG
        })
      }
      if (dataviewInstancesToUpdate.length) {
        upsertDataviewInstance(
          dataviewInstancesToUpdate.map(({ id }) => ({
            id,
            config: { visible: false },
          }))
        )
        dispatchQueryParams({ activityCategory: undefined })
        actionDone.current = true
      }
    }
  }, [activityCategory, dataviewInstancesResolved, dispatchQueryParams, upsertDataviewInstance])

  return activityCategory
}
