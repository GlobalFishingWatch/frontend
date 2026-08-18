import { Fragment, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { Button, IconButton, InputText, Modal } from '@globalfishingwatch/ui-components'

import { PUBLIC_SUFIX, USER_SUFIX } from 'data/map/config'
import { WIZARD_TEMPLATE_ID } from 'data/map/highlighted-workspaces/marine-manager.dataviews'
import {
  DEEP_SEA_MINING_WORKSPACE_ID,
  DEFAULT_WORKSPACE_ID,
  WorkspaceCategory,
} from 'data/map/workspaces'
import { selectReadOnly } from 'features/_map/workspace/selectors/app.selectors'
import { selectWorkspace } from 'features/_map/workspace/workspace.selectors'
import { setWorkspaceProperty } from 'features/_map/workspace/workspace.slice'
import { getWorkspaceLabel } from 'features/_map/workspace/workspace.utils'
import { updateWorkspaceThunk } from 'features/_map/workspaces-list/workspaces-list.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { getModalParent } from 'features/modals/modals.utils'
import type { WelcomeLocalStorageKey } from 'features/welcome/Welcome'
import { DEEP_SEA_MINING_POPUP } from 'features/welcome/Welcome'
import { selectLocationCategory } from 'router/routes.selectors'
import { htmlSafeParse } from 'utils/html-parser'

import styles from './Workspace.module.css'

function WorkspaceTitle() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const readOnly = useSelector(selectReadOnly)
  const workspace = useSelector(selectWorkspace)
  const locationCategory = useSelector(selectLocationCategory)
  const isUserWorkspace =
    workspace?.id?.endsWith(`-${USER_SUFIX}`) ||
    workspace?.id?.endsWith(`-${USER_SUFIX}-${PUBLIC_SUFIX}`)
  const [workspaceEditName, setWorkspaceEditName] = useState(workspace?.name)
  const [workspaceEditDescription, setWorkspaceEditDescription] = useState(workspace?.description)
  const [workspaceEditModalOpen, setWorkspaceEditModalOpen] = useState(false)
  const [editWorkspaceLoading, setEditWorkspaceLoading] = useState(false)
  const [dsmWelcomePopup, setDsmWelcomePopup] = useLocalStorage<WelcomeLocalStorageKey>(
    DEEP_SEA_MINING_POPUP,
    { visible: false, showAgain: false }
  )

  useEffect(() => {
    if (workspace) {
      setWorkspaceEditName(workspace.name)
      setWorkspaceEditDescription(workspace.description)
    }
  }, [workspace])

  const onWorkspaceUpdateClose = useCallback(() => {
    setEditWorkspaceLoading(false)
    setWorkspaceEditModalOpen(false)
  }, [])

  const onWorkspaceUpdateClick = useCallback(
    async (workspaceId: string) => {
      setEditWorkspaceLoading(true)
      await dispatch(
        updateWorkspaceThunk({
          id: workspaceId,
          name: workspaceEditName,
          description: workspaceEditDescription,
        })
      )
      if (workspaceEditName) {
        dispatch(setWorkspaceProperty({ key: 'name', value: workspaceEditName }))
      }
      onWorkspaceUpdateClose()
    },
    [dispatch, onWorkspaceUpdateClose, workspaceEditDescription, workspaceEditName]
  )

  const openDSMPopup = () => {
    setDsmWelcomePopup({ ...dsmWelcomePopup, visible: true })
  }

  return (
    <Fragment>
      {(locationCategory === WorkspaceCategory.MarineManager ||
        locationCategory === WorkspaceCategory.FishingActivity) &&
        workspace?.name &&
        workspace?.id !== WIZARD_TEMPLATE_ID &&
        workspace?.id !== DEFAULT_WORKSPACE_ID &&
        !readOnly && (
          <div className={styles.header}>
            {isUserWorkspace && (
              <label className={styles.subTitle}>{t((t) => t.workspace.user)}</label>
            )}
            <h2 className={styles.title} data-test="user-workspace-title">
              {getWorkspaceLabel(workspace)}
              {/* {gfwUser && (
                <IconButton
                  className="print-hidden"
                  size="small"
                  icon="edit"
                  onClick={() => setWorkspaceEditModalOpen(true)}
                />
              )} */}
            </h2>
            {workspace?.id === DEEP_SEA_MINING_WORKSPACE_ID && (
              <h3 className={styles.subTitle}>
                {htmlSafeParse(workspace.description)}
                <IconButton
                  className={styles.subTitleBtn}
                  icon="info"
                  size="tiny"
                  onClick={openDSMPopup}
                />
              </h3>
            )}
            <Modal
              title={t((t) => t.workspace.edit)}
              isOpen={workspaceEditModalOpen}
              contentClassName={styles.modalContainer}
              onClose={onWorkspaceUpdateClose}
              parentSelector={getModalParent}
            >
              <div className={styles.content}>
                <InputText
                  value={workspaceEditName}
                  className={styles.input}
                  label={t((t) => t.common.name)}
                  onChange={(e) => setWorkspaceEditName(e.target.value)}
                />
                <InputText
                  value={workspaceEditDescription}
                  className={styles.input}
                  label={t((t) => t.common.description)}
                  onChange={(e) => setWorkspaceEditDescription(e.target.value)}
                />
              </div>
              <div className={styles.modalFooter}>
                <Button
                  className={styles.saveBtn}
                  loading={editWorkspaceLoading}
                  onClick={() => onWorkspaceUpdateClick(workspace?.id)}
                >
                  {t((t) => t.common.update) as string}
                </Button>
              </div>
            </Modal>
          </div>
        )}
    </Fragment>
  )
}

export default WorkspaceTitle
