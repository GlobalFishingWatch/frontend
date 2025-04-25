import { Fragment, useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { uniq } from 'es-toolkit'

import { IconButton } from '@globalfishingwatch/ui-components'

import { selectDebugActive } from 'features/debug/debug.slice'
import { selectFeatureFlags } from 'features/workspace/workspace.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import type { FeatureFlag } from 'types'

import styles from './DebugMenu.module.css'

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

let toastDismissed = false
export const useFeatureFlagsToast = () => {
  const featureFlags = useSelector(selectFeatureFlags)
  const toastId = useRef<any>(undefined)
  const debugActive = useSelector(selectDebugActive)

  useEffect(() => {
    if (featureFlags?.length > 0 && !debugActive && !toastDismissed) {
      if (!toastId.current) {
        toastId.current = toast(
          <p>⚠️ You are using the following experimental features: {featureFlags.join(', ')} </p>,
          {
            toastId: 'featureFlags',
            autoClose: false,
            closeButton: true,
            onClose: () => {
              toastDismissed = true
            },
          }
        )
      } else {
        toast.update(toastId.current, {
          render: (
            <p>⚠️ You are using the following experimental features: {featureFlags.join(', ')} </p>
          ),
        })
      }
    }
  }, [featureFlags, debugActive])
}
