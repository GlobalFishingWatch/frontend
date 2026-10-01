import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { Icon } from '@globalfishingwatch/ui-components'

import { selectReadOnly } from 'features/_map/workspace/selectors/app.selectors'

import { selectWorkspace } from './workspace.selectors'

import styles from './Workspace.module.css'

// Shown once per workspace per session, so returning from a vessel profile doesn't re-open it
const readOnlyToastShownWorkspaceIds = new Set<string>()
export const useReadOnlyWorkspaceToast = () => {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const workspace = useSelector(selectWorkspace)
  const workspaceId = workspace?.id || ''

  useEffect(() => {
    if (readOnly && workspaceId && !readOnlyToastShownWorkspaceIds.has(workspaceId)) {
      readOnlyToastShownWorkspaceIds.add(workspaceId)
      toast(
        <div className={styles.disclaimer}>
          <Icon icon="info" />
          <div>
            <p>{t((t) => t.workspace.readOnlyDisclaimer)}</p>
            <p className={styles.secondary}>{t((t) => t.workspace.readOnlyDisclaimerNote)}</p>
          </div>
        </div>,
        {
          toastId: 'readOnlyWorkspace',
          autoClose: false,
          closeButton: true,
        }
      )
    }
  }, [readOnly, workspaceId, t])
}
