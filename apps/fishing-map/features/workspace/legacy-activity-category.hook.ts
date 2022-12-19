import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useLocationConnect } from 'routes/routes.hook'
import { selectAllDataviewInstancesResolved } from 'features/dataviews/dataviews.slice'
import { selectActivityCategory } from 'features/app/app.selectors'
import { FISHING_DATAVIEW_ID, PRESENCE_DATAVIEW_ID, VIIRS_MATCH_DATAVIEW_ID } from 'data/workspaces'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

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
      let dataviewInstancesToUpdate = []
      if (activityCategory) {
        if (activityCategory === 'fishing') {
          dataviewInstancesToUpdate = dataviewInstancesResolved.filter((dataviewInstance) => {
            return (
              dataviewInstance.dataviewId === PRESENCE_DATAVIEW_ID ||
              dataviewInstance.dataviewId === VIIRS_MATCH_DATAVIEW_ID
            )
          })
        }
        dataviewInstancesToUpdate = dataviewInstancesResolved.filter((dataviewInstance) => {
          return dataviewInstance.dataviewId === FISHING_DATAVIEW_ID
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
