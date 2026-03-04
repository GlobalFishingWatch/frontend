import { useEffect, useEffectEvent, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { IconButton } from '@globalfishingwatch/ui-components'

import { selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import { selectHasDeprecatedDataviewInstances } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { htmlSafeParse } from 'utils/html-parser'

import { selectIsWorkspaceOwnerOrDefault } from './workspace.selectors'

import styles from './Workspace.module.css'

export const useMigrateWorkspaceToast = () => {
  const { t } = useTranslation()
  const hasDeprecatedDataviews = useSelector(selectHasDeprecatedDataviewInstances)
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwnerOrDefault)
  const toastId = useRef<any>(undefined)

  const closeToast = () => {
    toast.dismiss(toastId.current)
  }

  const ToastContent = () => (
    <div className={styles.disclaimer}>
      <IconButton icon="warning" type="warning-invert" size="small" />
      <div>
        <p>{t((t) => t.workspace.migrationDisclaimer)}</p>
        <p className={styles.secondary}>
          {htmlSafeParse(t((t) => t.workspace.migrationDisclaimerNote))}
        </p>
      </div>
    </div>
  )

  const onDeprecatedDataviewsChange = useEffectEvent(() => {
    console.warn('Deprecated datasets:')
    console.log(deprecatedDatasets)
  })

  useEffect(() => {
    if (hasDeprecatedDataviews && isWorkspaceOwner) {
      toastId.current = toast(<ToastContent />, {
        toastId: 'migrateWorkspace',
        autoClose: 10000,
        closeButton: true,
      })
      onDeprecatedDataviewsChange()
      return () => {
        closeToast()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDeprecatedDataviews])
}
