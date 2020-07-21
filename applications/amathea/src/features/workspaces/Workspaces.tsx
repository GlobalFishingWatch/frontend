import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './Workspaces.module.css'
import { useWorkspacesConnect } from './workspaces.hook'

function Workspaces(): React.ReactElement {
  const { showModal } = useModalConnect()
  const { workspacesList, workspacesSharedList, deleteWorkspace } = useWorkspacesConnect()
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">Workspaces</h1>
      <label>Your workspaces</label>
      {workspacesList &&
        workspacesList.map((workspace) => (
          <div className={styles.listItem} key={workspace.id}>
            <button className={styles.titleLink}>{workspace.label}</button>
            {workspace.description && <IconButton icon="info" tooltip={workspace.description} />}
            <IconButton icon="edit" tooltip="Edit Workspace" />
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
              disabled={workspace.id === 5}
              tooltip="Delete Workspace"
              onClick={() => deleteWorkspace(workspace.id)}
            />
          </div>
        ))}
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
          <button className={styles.titleLink}>{workspace.label}</button>
          <IconButton icon="edit" tooltip="Edit Workspace" />
        </div>
      ))}
    </div>
  )
}

export default Workspaces
