import React, { useCallback } from 'react'
import Link from 'redux-first-router-link'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { Workspace } from '@globalfishingwatch/dataviews-client'
import { useModalConnect } from 'features/modal/modal.hooks'
import { WORKSPACE_EDITOR } from 'routes/routes'
import styles from './Workspaces.module.css'
import { useWorkspacesConnect, useWorkspacesAPI } from './workspaces.hook'

function Workspaces(): React.ReactElement {
  const { showModal } = useModalConnect()
  const { deleteWorkspace } = useWorkspacesAPI()
  const {
    workspaceStatus,
    workspaceStatusId,
    workspacesList,
    workspacesSharedList,
  } = useWorkspacesConnect()

  const onDeleteClick = useCallback(
    (workspace: Workspace) => {
      const confirmation = window.confirm(
        `Are you sure you want to permanently delete this workspace?\n${workspace.name}`
      )
      if (confirmation) {
        deleteWorkspace(workspace.id)
      }
    },
    [deleteWorkspace]
  )

  if (workspaceStatus === 'loading') {
    return <Spinner />
  }

  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">Workspaces</h1>
      <label>Your workspaces</label>
      <ul>
        {workspacesList && workspacesList.length ? (
          workspacesList.map((workspace) => (
            <li className={styles.listItem} key={workspace.id}>
              <Link
                className={styles.titleLink}
                to={{ type: WORKSPACE_EDITOR, payload: { workspaceId: workspace.id } }}
              >
                {workspace.name}
              </Link>
              {workspace.description && <IconButton icon="info" tooltip={workspace.description} />}
              <Link to={{ type: WORKSPACE_EDITOR, payload: { workspaceId: workspace.id } }}>
                <IconButton icon="edit" tooltip="Edit Workspace" />
              </Link>
              {/* <IconButton icon="publish" tooltip="Publish workspace" /> */}
              <IconButton
                icon="share"
                tooltip="Share Workspace"
                onClick={() => {
                  showModal('shareWorkspace')
                }}
              />
              <IconButton
                icon="delete"
                type="warning"
                disabled={workspace.id === 5 || workspace.id === 19}
                loading={workspaceStatus === 'loading.delete' && workspaceStatusId === workspace.id}
                onClick={() => onDeleteClick(workspace)}
              />
            </li>
          ))
        ) : (
          <li className={styles.listPlaceholder}>There are no workspaces yet</li>
        )}
      </ul>
      <Button
        onClick={() => {
          showModal('newWorkspace')
        }}
        className={styles.rightSide}
      >
        Create new workspace
      </Button>
      <label>Workspaces shared with you</label>
      {workspacesSharedList.map((workspace) => (
        <div className={styles.listItem} key={workspace.id}>
          <button className={styles.titleLink}>{workspace.name}</button>
          <IconButton icon="edit" tooltip="Edit Workspace" />
        </div>
      ))}
    </div>
  )
}

export default Workspaces
