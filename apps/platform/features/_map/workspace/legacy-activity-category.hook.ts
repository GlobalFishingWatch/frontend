import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import {
  FISHING_DATAVIEW_SLUG_ALL,
  PRESENCE_DATAVIEW_SLUG,
  VIIRS_MATCH_DATAVIEW_SLUG,
} from 'data/map/workspaces'
import { selectAllDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'
import { selectActivityCategory } from 'features/_map/workspace/selectors/app.selectors'
import { useDataviewInstancesConnect } from 'features/_map/workspace/workspace.hook'
import { useReplaceQueryParams } from 'router/routes.hook'

export const useHideLegacyActivityCategoryDataviews = () => {
  const actionDone = useRef(false)
  const { replaceQueryParams } = useReplaceQueryParams()
  const activityCategory = useSelector(selectActivityCategory)
  const dataviewInstancesResolved = useSelector(selectAllDataviewInstancesResolved)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
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
        } else {
          dataviewInstancesToUpdate = dataviewInstancesResolved.filter((dataviewInstance) => {
            return dataviewInstance.dataviewId === FISHING_DATAVIEW_SLUG_ALL
          })
        }
      }
      if (dataviewInstancesToUpdate.length) {
        upsertDataviewInstance(
          dataviewInstancesToUpdate.map(({ id }) => ({
            id,
            config: { visible: false },
          }))
        )
        replaceQueryParams({ activityCategory: undefined })
        actionDone.current = true
      }
    }
  }, [activityCategory, dataviewInstancesResolved, upsertDataviewInstance])

  return activityCategory
}
