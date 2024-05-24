import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { InputText, Button, Modal, SwitchRow } from '@globalfishingwatch/ui-components'
import { getOceanAreaName, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import {
  saveWorkspaceThunk,
  updatedCurrentWorkspaceThunk,
} from 'features/workspace/workspace.slice'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { pickDateFormatByRange } from 'features/map/controls/MapInfo'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectViewport } from 'features/app/selectors/app.viewport.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { PUBLIC_SUFIX, ROOT_DOM_ELEMENT } from 'data/config'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { selectUserWorkspaceEditPermissions } from 'features/user/selectors/user.permissions.selectors'
import { selectWorkspaceId } from 'routes/routes.selectors'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { selectIsGFWWorkspace } from 'features/workspace/workspace.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectPrivateDatasetsInWorkspace } from 'features/dataviews/selectors/dataviews.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import styles from './WorkspaceSaveModal.module.css'
import { useSaveWorkspaceModalConnect } from './workspace-save.hooks'

type EditWorkspaceModalProps = {
  title?: string
  isOpen: boolean
  workspace: AppWorkspace
  onFinish?: (workspace: AppWorkspace) => void
}

function EditWorkspaceModal({ title, isOpen, onFinish, workspace }: EditWorkspaceModalProps) {
  const { t, i18n } = useTranslation()

  const { dispatchWorkspaceModalOpen } = useSaveWorkspaceModalConnect('editWorkspace')

  const onClose = () => {
    dispatchWorkspaceModalOpen(false)
  }

  const updateWorkspace = async () => {
    // if (workspace) {
    //   setUpdateLoading(true)
    //   const dispatchedAction = await dispatch(updatedCurrentWorkspaceThunk({ ...workspace, name }))
    //   if (updatedCurrentWorkspaceThunk.fulfilled.match(dispatchedAction)) {
    //     trackEvent({
    //       category: TrackCategory.WorkspaceManagement,
    //       action: 'Edit current workspace',
    //       label: dispatchedAction.payload?.name ?? 'Unknown',
    //     })
    //     setUpdateLoading(false)
    //     if (onFinish) {
    //       onFinish(dispatchedAction.payload)
    //     }
    //   } else {
    //     setUpdateLoading(false)
    //     setError('Error updating workspace')
    //   }
    // }
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={title || t('workspace.edit', 'Edit workspace')}
      isOpen={isOpen}
      shouldCloseOnEsc
      contentClassName={styles.modal}
      onClose={onClose}
    >
      TODO
    </Modal>
  )
}

export default EditWorkspaceModal
