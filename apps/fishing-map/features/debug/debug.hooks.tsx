import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import type { FeatureFlag } from 'features/debug/debug.slice'
import { selectDebugActive, selectFeatureFlags } from 'features/debug/debug.slice'

function FeatureFlagsToast({ featureFlags }: { featureFlags: FeatureFlag[] }) {
  if (featureFlags.length === 0) {
    return null
  }
  return <p>⚠️ You are using the following beta features: {featureFlags.join(', ')} </p>
}

let toastDismissed = false
export const useFeatureFlagsToast = () => {
  const allFeatureFlags = useSelector(selectFeatureFlags)
  const featureFlags = Object.entries(allFeatureFlags)
    .filter(([flag, value]) => flag !== 'workspaceGenerator' && value === true)
    .map(([flag]) => flag) as FeatureFlag[]
  const toastId = useRef<any>(undefined)
  const debugActive = useSelector(selectDebugActive)

  useEffect(() => {
    if (featureFlags?.length > 0 && !debugActive && !toastDismissed) {
      if (!toastId.current) {
        toastId.current = toast(<FeatureFlagsToast featureFlags={featureFlags} />, {
          toastId: 'featureFlags',
          autoClose: false,
          closeButton: true,
          onClose: () => {
            toastDismissed = true
          },
        })
      } else {
        toast.update(toastId.current, {
          render: <FeatureFlagsToast featureFlags={featureFlags} />,
        })
      }
    }
  }, [featureFlags, debugActive])
}
