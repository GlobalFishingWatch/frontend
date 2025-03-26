import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { selectFeatureFlags } from 'features/workspace/workspace.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import type { FeatureFlag } from 'types'

export const useToggleFeatureFlag = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const featureFlags = useSelector(selectFeatureFlags)

  const toggleFeatureFlag = useCallback(
    (flag: FeatureFlag) => {
      if (featureFlags?.includes(flag)) {
        dispatchQueryParams({ featureFlags: featureFlags.filter((f) => f !== flag) })
      } else {
        dispatchQueryParams({ featureFlags: [...(featureFlags || []), flag] })
      }
    },
    [dispatchQueryParams, featureFlags]
  )

  return toggleFeatureFlag
}
