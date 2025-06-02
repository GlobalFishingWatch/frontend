import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { uniq } from 'es-toolkit'

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

function FeatureFlagsToast({ featureFlags }: { featureFlags: FeatureFlag[] }) {
  if (featureFlags.length === 0) {
    return null
  }
  if (featureFlags.length === 1 && featureFlags[0] === 'globalReports') {
    return (
      <p>
        Welcome! You're using the <strong>beta version of Global Reports</strong>. <br />
        <a
          className={styles.link}
          href="https://global-fishing-watch.canny.io/2025-global-reports-feedback"
          target="_blank"
        >
          {' '}
          We’d love your feedback{' '}
        </a>{' '}
        a to help shape the public release.
      </p>
    )
  }
  return <p>⚠️ You are using the following beta features: {featureFlags.join(', ')} </p>
}

let toastDismissed = false
export const useFeatureFlagsToast = () => {
  const allFeatureFlags = useSelector(selectFeatureFlags)
  const featureFlags = allFeatureFlags.filter((flag) => flag !== 'workspaceGenerator')
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
