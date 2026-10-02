import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { Icon } from '@globalfishingwatch/ui-components'

import { selectReadOnly } from 'features/_map/workspace/selectors/app.selectors'

import { selectWorkspace } from './workspace.selectors'

import styles from './Workspace.module.css'

const READ_ONLY_TOAST_ID = 'readOnlyWorkspace'
const readOnlyToastShownWorkspaceIds = new Set<string>()
export const useReadOnlyWorkspaceToast = () => {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const workspace = useSelector(selectWorkspace)
  const workspaceId = workspace?.id || ''

  useEffect(() => {
    if (!readOnly || !workspaceId) return
    if (!readOnlyToastShownWorkspaceIds.has(workspaceId)) {
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
          toastId: READ_ONLY_TOAST_ID,
          autoClose: false,
          closeButton: false,
        }
      )
    }
    return () => {
      if (toast.isActive(READ_ONLY_TOAST_ID)) {
        toast.dismiss(READ_ONLY_TOAST_ID)
        readOnlyToastShownWorkspaceIds.delete(workspaceId)
      }
    }
  }, [readOnly, workspaceId, t])
}
