import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import { useLocationConnect } from 'routes/routes.hook'
import { selectFeatureFlags } from 'routes/routes.selectors'
import type { FeatureFlag } from 'types'

export const useToggleFeatureFlag = () => {
  const { dispatchQueryParams } = useLocationConnect()
  const featureFlags = useSelector(selectFeatureFlags)

  const toggleFeatureFlag = useCallback(
    (flag: FeatureFlag) => {
      if (featureFlags?.includes(flag)) {
        dispatchQueryParams({ featureFlags: uniq(featureFlags.filter((f) => f !== flag)) })
      } else {
        dispatchQueryParams({ featureFlags: uniq([...(featureFlags || []), flag]) })
      }
    },
    [dispatchQueryParams, featureFlags]
  )

  return toggleFeatureFlag
}
